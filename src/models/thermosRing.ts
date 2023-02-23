import {
	booleans,
	colors,
	hulls,
	primitives,
	transforms,
} from '@jscad/modeling'
import { translateX } from '@jscad/modeling/src/operations/transforms'

const { translate, scale, mirrorX, scaleZ, translateZ } = transforms
const { cylinder, cuboid, sphere } = primitives
const { hull } = hulls
const { colorize, hexToRgb } = colors
const { subtract, union } = booleans

const innerSize = 72
const thickness = 10

export const thermosRing = () => {
	return [
		subtract(
			union(
				hull(
					cylinder({
						height: thickness,
						radius: innerSize + 1.5 * thickness,
						segments: 128,
					}),
					translateX(
						innerSize + 3 * thickness,
						cylinder({
							height: thickness,
							radius: 3 * thickness,
							segments: 64,
						}),
					),
				),
			),
			cylinder({
				height: thickness,
				radius: innerSize,
				segments: 128,
			}),
			translateX(
				innerSize + 3 * thickness,
				subtract(
					cylinder({
						height: thickness,
						radius: 1.5 * thickness,
						segments: 64,
					}),
				),
			),
		),
	]
}
