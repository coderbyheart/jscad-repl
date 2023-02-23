import { booleans, hulls, primitives } from '@jscad/modeling'
import { translateX } from '@jscad/modeling/src/operations/transforms'

const { cylinder } = primitives
const { hull } = hulls
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
						radius: innerSize / 2 + thickness,
						segments: 128,
					}),
					translateX(
						innerSize / 2 + 2 * thickness,
						cylinder({
							height: thickness,
							radius: 2 * thickness,
							segments: 64,
						}),
					),
				),
			),
			cylinder({
				height: thickness,
				radius: innerSize / 2,
				segments: 128,
			}),
			translateX(
				innerSize / 2 + 2 * thickness,
				subtract(
					cylinder({
						height: thickness,
						radius: thickness,
						segments: 64,
					}),
				),
			),
		),
	]
}
