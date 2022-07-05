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

export const renderModel = ({
	containerElement,
	model,
}: {
	containerElement: HTMLElement
	model: any
}) => {
	const width = containerElement.clientWidth
	const height = containerElement.clientHeight

	const state: Record<string, any> = {}

	// prepare the camera
	state.camera = Object.assign({}, perspectiveCamera.defaults, {
		//position: [450, 550, 700],
		position: [450, 550, 700],
		fov: Math.PI / 32,
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
			show: true,
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
}
