import { measurements } from '@jscad/modeling'
import { serialize } from '@jscad/stl-serializer'
import { showerPlate } from './models/showerPlate.js'
import { renderModel } from './renderModel.js'

const modelName = 'showerPlate'
const model = showerPlate()

const containerElement = document.getElementById('jscad')
const renderer =
	containerElement !== null
		? renderModel({ containerElement, model })
		: undefined

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
	addButton(toolbar, 'Download STL', () => download(model, `${modelName}.stl`))
	if (renderer !== undefined) {
		addButton(toolbar, 'Toggle grid', renderer.toggleGrid)
	}
	if (parts.length > 1) {
		parts.forEach((part, i) =>
			addButton(toolbar, `Part ${i + 1}`, () =>
				download(part, `${modelName}-${i + 1}.stl`),
			),
		)
	}
}
