import { Geom3 } from '@jscad/modeling/src/geometries/types'
import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import {
	extrudeLinear,
	extrudeRotate,
} from '@jscad/modeling/src/operations/extrusions'
import {
	rotate,
	rotateZ,
	translate,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { cylinder, ellipse, triangle } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const ring = (innerSize: number, thickness: number, height: number) =>
	union(
		subtract(
			cylinder({
				height,
				radius: innerSize / 2 + thickness,
				segments: 64,
			}),
			cylinder({
				height,
				radius: innerSize / 2,
				segments: 64,
			}),
		),
		translateZ(
			2,
			extrudeRotate(
				{
					segments: 64,
				},
				ellipse({
					radius: [1, 1],
					segments: 64,
					center: [innerSize / 2 + thickness - 1, 0],
				}),
			),
		),
		translateZ(
			-2,
			extrudeRotate(
				{
					segments: 64,
				},
				ellipse({
					radius: [1, 1],
					segments: 64,
					center: [innerSize / 2 + thickness - 1, 0],
				}),
			),
		),
	)

export const fidgetRing = (
	innerSize = 24,
	thickness = 2,
	height = 4,
): Geom3 => {
	const ridges: Geom3[] = []

	for (let i = 0; i < 32; i++) {
		ridges.push(
			rotateZ(
				degToRad((i * 360) / 32),
				translate(
					[0.5, innerSize / 2 + thickness, height / 2],
					rotate(
						[degToRad(180), degToRad(90), 0],
						extrudeLinear(
							{ height: 1 },
							triangle({
								type: 'ASA',
								values: [(Math.PI * 1) / 20, height, (Math.PI * 1) / 20],
							}),
						),
					),
				),
			),
		)
	}
	return subtract(ring(innerSize, thickness, height), ridges)
}
