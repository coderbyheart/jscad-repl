import { colorNameToRgb, colorize, hexToRgb } from '@jscad/modeling/src/colors'
import {
	intersect,
	subtract,
	union,
} from '@jscad/modeling/src/operations/booleans'
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions'
import {
	rotate,
	rotateX,
	rotateY,
	scale,
	translate,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, triangle } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'
import { hexagonGrid } from '../utils/hexagon.js'

const height = 2
const len = 223
const edge = 15
const width = 70

const plate = () =>
	union(
		cuboid({
			size: [len - edge * 2, width, height],
		}),
		cuboid({
			size: [edge, 30, height],
			center: [len / 2 - edge / 2, 0, 0],
		}),
		cuboid({
			size: [edge, 30, height],
			center: [-(len / 2) + edge / 2, 0, 0],
		}),
		translate(
			[-len / 2, edge, -height / 2],
			extrudeLinear(
				{ height },
				triangle({
					type: 'SAS',
					values: [edge, degToRad(90), (width - 2 * edge) / 2],
				}),
			),
		),
		rotateY(
			degToRad(180),
			translate(
				[-len / 2, edge, -height / 2],
				extrudeLinear(
					{ height },
					triangle({
						type: 'SAS',
						values: [edge, degToRad(90), (width - 2 * edge) / 2],
					}),
				),
			),
		),
		rotateX(
			degToRad(180),
			translate(
				[-len / 2, edge, -height / 2],
				extrudeLinear(
					{ height },
					triangle({
						type: 'SAS',
						values: [edge, degToRad(90), (width - 2 * edge) / 2],
					}),
				),
			),
		),
		rotate(
			[degToRad(180), degToRad(180), 0],
			translate(
				[-len / 2, edge, -height / 2],
				extrudeLinear(
					{ height },
					triangle({
						type: 'SAS',
						values: [edge, degToRad(90), (width - 2 * edge) / 2],
					}),
				),
			),
		),
	)

export const showerPlate = () => [
	union(
		subtract(plate(), scale([0.985, 0.95, 2], plate())),
		intersect(
			plate(),
			translate(
				[-120, -52.5, -height / 2],
				hexagonGrid({
					cols: 20,
					rows: 40,
					height,
					size: height * 2.01,
					wallThickness: height / 4,
				}),
			),
		),
	),
]
