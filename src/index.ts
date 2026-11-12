import { measurements } from '@jscad/modeling'
import { serialize } from '@jscad/stl-serializer'
import { listModels, loadModel } from './models.ts'
import { renderModel, type CameraView } from './renderModel.ts'

const base = import.meta.env.BASE_URL
const modelUrl = (name: string): string => `${base}${name}`

// /jscad-repl/nordanWindowClip → nordanWindowClip
const modelNameFromLocation = (): string => {
	const { pathname } = window.location
	// /jscad-repl (base without its trailing slash) is the home page
	if (`${pathname}/` === base) return ''
	const path = pathname.startsWith(base)
		? pathname.slice(base.length)
		: pathname.replace(/^\/+/, '')
	let name: string
	try {
		name = decodeURIComponent(path)
	} catch {
		// Malformed escape sequence
		name = path
	}
	name = name.replace(/\.html$/, '').replace(/\/+$/, '')
	// /jscad-repl/index.html is the home page
	return name === 'index' ? '' : name
}

const showGridKey = 'showGrid'
const loadShowGrid = (): boolean => {
	try {
		return localStorage.getItem(showGridKey) !== 'false'
	} catch {
		return true
	}
}
const saveShowGrid = (show: boolean): void => {
	try {
		localStorage.setItem(showGridKey, String(show))
	} catch {
		// Storage unavailable (e.g. private mode), ignore
	}
}

const viewKey = (modelName: string): string => `view:${modelName}`
const isVec3 = (v: unknown): boolean =>
	Array.isArray(v) &&
	v.length === 3 &&
	v.every((n) => typeof n === 'number' && Number.isFinite(n))
const loadView = (modelName: string): CameraView | undefined => {
	try {
		const view = JSON.parse(localStorage.getItem(viewKey(modelName)) ?? 'null')
		if (isVec3(view?.position) && isVec3(view?.target)) return view
	} catch {
		// Storage unavailable or invalid JSON, use default view
	}
	return undefined
}
const saveView = (modelName: string, view: CameraView): void => {
	try {
		localStorage.setItem(viewKey(modelName), JSON.stringify(view))
	} catch {
		// Storage unavailable (e.g. private mode), ignore
	}
}

const download = (solids: unknown, fileName: string) => {
	const rawData = serialize({ binary: true }, solids)
	const file = new File(rawData, fileName, { type: 'model/stl' })
	const link = document.createElement('a')
	link.style.display = 'none'
	link.href = URL.createObjectURL(file)
	link.download = file.name

	document.body.appendChild(link)
	link.click()

	setTimeout(() => {
		URL.revokeObjectURL(link.href)
		link.remove()
	}, 0)
}

const addButton = (
	parent: HTMLElement,
	label: string,
	onClick: () => void,
): void => {
	const button = document.createElement('button')
	button.type = 'button'
	button.textContent = label
	button.addEventListener('click', onClick)
	parent.appendChild(button)
}

const showModel = (modelName: string, model: unknown): void => {
	document.title = modelName
	const containerElement = document.getElementById('jscad')
	const renderer =
		containerElement !== null
			? renderModel({
					containerElement,
					model,
					showGrid: loadShowGrid(),
					view: loadView(modelName),
					onViewChange: (view) => saveView(modelName, view),
				})
			: undefined

	const toolbar = document.getElementById('toolbar')
	if (toolbar !== null) {
		const parts = Array.isArray(model) ? model : [model]
		const [min, max] = measurements.measureAggregateBoundingBox(...parts)
		const dimensions = document.createElement('span')
		dimensions.className = 'dimensions'
		// JSCAD units are mm
		dimensions.textContent = `${[0, 1, 2]
			.map((i) => ((max[i] - min[i]) / 10).toFixed(1))
			.join(' × ')} cm`
		dimensions.title = 'Bounding box (X × Y × Z)'
		toolbar.appendChild(dimensions)
		addButton(toolbar, 'Download STL', () =>
			download(model, `${modelName}.stl`),
		)
		if (renderer !== undefined) {
			addButton(toolbar, 'Toggle grid', () =>
				saveShowGrid(renderer.toggleGrid()),
			)
		}
		if (parts.length > 1) {
			parts.forEach((part, i) =>
				addButton(toolbar, `Part ${i + 1}`, () =>
					download(part, `${modelName}-${i + 1}.stl`),
				),
			)
		}
	}
}

const showModelList = async (message?: string): Promise<void> => {
	document.getElementById('jscad')?.remove()
	document.getElementById('toolbar')?.remove()
	const main = document.createElement('main')
	main.className = 'model-list'
	const h1 = document.createElement('h1')
	h1.textContent = 'Models'
	main.appendChild(h1)
	if (message !== undefined) {
		const p = document.createElement('p')
		p.textContent = message
		main.appendChild(p)
	}
	const ul = document.createElement('ul')
	for (const name of await listModels()) {
		const li = document.createElement('li')
		const a = document.createElement('a')
		a.href = modelUrl(name)
		a.textContent = name
		li.appendChild(a)
		ul.appendChild(li)
	}
	main.appendChild(ul)
	document.body.appendChild(main)
}

const main = async (): Promise<void> => {
	const modelName = modelNameFromLocation()
	if (modelName === '') return showModelList()
	let model
	try {
		model = await loadModel(modelName)
	} catch (error) {
		console.error(error)
		return showModelList(`Model "${modelName}" failed to load: ${error}`)
	}
	if (model === undefined)
		return showModelList(`Model "${modelName}" not found.`)
	let geometry
	try {
		geometry = model()
	} catch (error) {
		console.error(error)
		return showModelList(`Model "${modelName}" failed to build: ${error}`)
	}
	showModel(modelName, geometry)
}

main().catch((error) => {
	console.error(error)
	document.body.textContent = `Failed to start: ${error}`
})
