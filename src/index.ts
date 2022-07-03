import { displayStand } from './displayStand'
import { renderModel } from './renderModel'

const containerElement = document.getElementById('jscad')

if (containerElement !== null)
	renderModel({ containerElement, model: displayStand() })
