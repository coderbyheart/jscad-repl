// ********************
// Renderer configuration and initiation.
// ********************
import {
	cameras,
	controls,
	drawCommands,
	entitiesFromSolids,
	prepareRender,
} from '@jscad/regl-renderer'

const perspectiveCamera = cameras.perspective
const orbitControls = controls.orbit

type Vec3 = [number, number, number]
export type CameraView = { position: Vec3; target: Vec3 }

export const renderModel = ({
	containerElement,
	model,
	showGrid = true,
	view,
	onViewChange,
}: {
	containerElement: HTMLElement
	model: any
	showGrid?: boolean
	/** Initial camera view, e.g. restored from a previous session */
	view?: CameraView
	/** Called whenever the camera comes to rest after a change */
	onViewChange?: (view: CameraView) => void
}) => {
	const width = containerElement.clientWidth
	const height = containerElement.clientHeight

	const state: Record<string, any> = {}

	// prepare the camera
	state.camera = Object.assign({}, perspectiveCamera.defaults, {
		//position: [450, 550, 700],
		position: [1500, 2000, 2000],
		fov: Math.PI / 32,
		...(view !== undefined
			? { position: [...view.position], target: [...view.target] }
			: {}),
	})
	perspectiveCamera.setProjection(state.camera, state.camera, { width, height })
	perspectiveCamera.update(state.camera, state.camera)

	// prepare the controls
	state.controls = orbitControls.defaults

	// prepare the renderer
	const setupOptions = {
		glOptions: { container: containerElement },
	}
	const renderer = prepareRender(setupOptions)

	const gridOptions = {
		visuals: {
			drawCmd: 'drawGrid',
			show: showGrid,
		},
		size: [500, 500],
		ticks: [10, 1],
		color: [0, 0, 1, 1],
		subColor: [0, 0, 1, 0.5],
	}

	const axisOptions = {
		visuals: {
			drawCmd: 'drawAxis',
			show: true,
		},
		size: 300,
		// alwaysVisible: false,
		// xColor: [0, 0, 1, 1],
		// yColor: [1, 0, 1, 1],
		// zColor: [0, 0, 0, 1]
	}

	// axis labels: HTML overlays projected onto the tips of the axes
	containerElement.style.position = 'relative'
	const axisLabels = (
		[
			['X', [axisOptions.size, 0, 0], '#e00'],
			['Y', [0, axisOptions.size, 0], '#0a0'],
			['Z', [0, 0, axisOptions.size], '#00e'],
		] as [string, Vec3, string][]
	).map(([text, point, color]) => {
		const el = document.createElement('div')
		el.textContent = text
		Object.assign(el.style, {
			position: 'absolute',
			left: '0',
			top: '0',
			font: 'bold 16px sans-serif',
			color,
			pointerEvents: 'none',
			userSelect: 'none',
		})
		containerElement.appendChild(el)
		return { el, point }
	})
	const updateAxisLabels = () => {
		const { projection: p, view: v } = state.camera
		const w = containerElement.clientWidth
		const h = containerElement.clientHeight
		for (const { el, point } of axisLabels) {
			// column-major matrices: clip = projection * view * point
			const eye = [0, 1, 2, 3].map(
				(r) =>
					v[r] * point[0] +
					v[4 + r] * point[1] +
					v[8 + r] * point[2] +
					v[12 + r],
			)
			const clip = [0, 1, 2, 3].map(
				(r) =>
					p[r] * eye[0] +
					p[4 + r] * eye[1] +
					p[8 + r] * eye[2] +
					p[12 + r] * eye[3],
			)
			if (clip[3] <= 0) {
				el.style.display = 'none'
				continue
			}
			const x = ((clip[0] / clip[3]) * 0.5 + 0.5) * w
			const y = (1 - ((clip[1] / clip[3]) * 0.5 + 0.5)) * h
			el.style.display = 'block'
			el.style.transform = `translate(${x + 4}px, ${y - 8}px)`
		}
	}

	const entities = entitiesFromSolids({}, model)

	// assemble the options for rendering
	const renderOptions = {
		camera: state.camera,
		drawCommands: {
			drawAxis: drawCommands.drawAxis,
			drawGrid: drawCommands.drawGrid,
			drawLines: drawCommands.drawLines,
			drawMesh: drawCommands.drawMesh,
		},
		// define the visual content
		entities: [gridOptions, axisOptions, ...entities],
	}

	// the heart of rendering, as themes, controls, etc change
	let updateView = true

	const doRotatePanZoom = () => {
		if (rotateDelta[0] || rotateDelta[1]) {
			const updated = orbitControls.rotate(
				{ controls: state.controls, camera: state.camera, speed: rotateSpeed },
				rotateDelta,
			)
			state.controls = { ...state.controls, ...updated.controls }
			updateView = true
			rotateDelta = [0, 0]
		}

		if (panDelta[0] || panDelta[1]) {
			const updated = orbitControls.pan(
				{ controls: state.controls, camera: state.camera, speed: panSpeed },
				panDelta,
			)
			state.controls = { ...state.controls, ...updated.controls }
			panDelta = [0, 0]
			state.camera.position = updated.camera.position
			state.camera.target = updated.camera.target
			updateView = true
		}

		if (zoomDelta) {
			const updated = orbitControls.zoom(
				{ controls: state.controls, camera: state.camera, speed: zoomSpeed },
				zoomDelta,
			)
			state.controls = { ...state.controls, ...updated.controls }
			zoomDelta = 0
			updateView = true
		}
	}

	const updateAndRender = (timestamp: number) => {
		doRotatePanZoom()

		if (updateView) {
			const updates = orbitControls.update({
				controls: state.controls,
				camera: state.camera,
			})
			state.controls = { ...state.controls, ...updates.controls }
			updateView = state.controls.changed // for elasticity in rotate / zoom

			state.camera.position = updates.camera.position
			perspectiveCamera.update(state.camera)

			renderer(renderOptions)
			updateAxisLabels()

			// camera has settled
			if (!updateView)
				onViewChange?.({
					position: Array.from(state.camera.position) as Vec3,
					target: Array.from(state.camera.target) as Vec3,
				})
		}
		window.requestAnimationFrame(updateAndRender)
	}
	window.requestAnimationFrame(updateAndRender)

	// convert HTML events (mouse movement) to viewer changes
	let lastX = 0
	let lastY = 0

	const rotateSpeed = 0.002
	const panSpeed = 1
	const zoomSpeed = 0.08
	let rotateDelta = [0, 0]
	let panDelta = [0, 0]
	let zoomDelta = 0
	let pointerDown = false

	const moveHandler = (ev: PointerEvent) => {
		if (!pointerDown) return
		const dx = lastX - ev.pageX
		const dy = ev.pageY - lastY

		const shiftKey =
			ev.shiftKey === true ||
			((ev as unknown as TouchEvent).touches !== undefined &&
				(ev as unknown as TouchEvent).touches.length > 2)
		if (shiftKey) {
			panDelta[0] += dx
			panDelta[1] += dy
		} else {
			rotateDelta[0] -= dx
			rotateDelta[1] -= dy
		}

		lastX = ev.pageX
		lastY = ev.pageY

		ev.preventDefault()
	}
	const downHandler = (ev: PointerEvent) => {
		pointerDown = true
		lastX = ev.pageX
		lastY = ev.pageY
		containerElement.setPointerCapture(ev.pointerId)
	}

	const upHandler = (ev: PointerEvent) => {
		pointerDown = false
		containerElement.releasePointerCapture(ev.pointerId)
	}

	const wheelHandler = (ev: WheelEvent) => {
		zoomDelta += ev.deltaY
		ev.preventDefault()
	}

	containerElement.onpointermove = moveHandler
	containerElement.onpointerdown = downHandler
	containerElement.onpointerup = upHandler
	containerElement.onwheel = wheelHandler

	return {
		toggleGrid: (): boolean => {
			gridOptions.visuals.show = !gridOptions.visuals.show
			updateView = true
			return gridOptions.visuals.show
		},
	}
}
