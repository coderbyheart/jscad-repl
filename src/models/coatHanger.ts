import {
	booleans,
	colors,
	hulls,
	primitives,
	transforms,
} from '@jscad/modeling'
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions'
import { rotateX, rotateZ } from '@jscad/modeling/src/operations/transforms'
import { degToRad } from '@jscad/modeling/src/utils'

const { translate, scale, mirrorX, scaleZ, translateZ } = transforms
const { cylinder, cuboid, sphere, triangle } = primitives
const { hull } = hulls
const { colorize, hexToRgb } = colors
const { subtract, union } = booleans

const height = 50
const gapWidth = 19.5
const gapHeight = 3
const thickness = 2
const hangerDepth = 15
const width = 10

export const coatHanger = () => {
	return [
		translateZ(
			height,
			union([
				cuboid({
					size: [thickness, width, thickness + gapHeight],
					center: [-(gapWidth + thickness) / 2, 0, -(gapHeight / 2)],
				}),
				cuboid({
					size: [gapWidth, width, thickness],
				}),
				cuboid({
					size: [thickness, width, height + 2],
					center: [(gapWidth + thickness) / 2, 0, -height / 2],
				}),
				cuboid({
					size: [hangerDepth, width, thickness],
					center: [hangerDepth + 2 * thickness, 0, -(height / (3 / 2))],
				}),
				cuboid({
					size: [thickness, width, 4],
					center: [
						hangerDepth + gapWidth / 2 + thickness,
						0,
						-(height / (3 / 2)) + 1,
					],
				}),
				cuboid({
					size: [width * 2, width, thickness],
					center: [-(hangerDepth + width / 2), 0, -(thickness + thickness / 2)],
				}),
				translate(
					[
						height / (3 / 2) / 2 + hangerDepth / 2 + 2 * thickness - 0.5,
						-2 * thickness + 1,
						-(height / (3 / 2)),
					],
					rotateZ(
						degToRad(180),
						rotateX(
							degToRad(270),
							extrudeLinear(
								{
									height: thickness,
								},
								triangle({
									type: 'SAS',
									values: [
										height / (3 / 2) / 2,
										degToRad(90),
										height / (3 / 2) / 2,
									],
								}),
							),
						),
					),
				),
			]),
		),
	]
}
