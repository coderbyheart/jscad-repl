import { serialize } from '@jscad/stl-serializer'
import { robotBody } from './models/robotWars'
import { renderModel } from './renderModel'

const containerElement = document.getElementById('jscad')

const model = robotBody()

if (containerElement !== null) renderModel({ containerElement, model })

const download = async (blob: Blob) => {
	const file = new File([await blob.arrayBuffer()], `model.stl`)
	const link = document.createElement('a')
	link.style.display = 'none'
	link.href = URL.createObjectURL(file)
	link.download = file.name

	document.body.appendChild(link)
	link.click()

	setTimeout(() => {
		URL.revokeObjectURL(link.href)
		link.parentNode?.removeChild(link)
	}, 0)
}

;(window as any).startDownload = () => {
	const rawData = serialize({ binary: true }, model)
	const blob = new Blob(rawData)
	download(blob).catch(console.error)
}
