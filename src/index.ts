import { demo } from './demo'
import { renderModel } from './renderModel'

const containerElement = document.getElementById('jscad')

if (containerElement !== null)
	renderModel({ containerElement, model: demo({ scale: 1 }) })
