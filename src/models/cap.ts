import {
	booleans,
	colors,
	hulls,
	primitives,
	transforms,
} from '@jscad/modeling'

const { translate, scale, mirrorX, scaleZ, translateZ } = transforms
const { cylinder, cuboid, sphere } = primitives
const { hull } = hulls
const { colorize, hexToRgb } = colors
const { subtract, union } = booleans

export const cap = () => {
	return [
		subtract(
			union(
				cylinder({
					center: [0, 0, 0],
					height: 20,
					radius: 29 / 2,
					segments: 64,
				}),
				translateZ(
					-10,
					scaleZ(
						0.25,
						sphere({
							center: [0, 0, 0],
							radius: 29 / 2,
							segments: 64,
						}),
					),
				),
			),
			cylinder({
				center: [0, 0, 0],
				height: 20,
				radius: 26 / 2,
				segments: 64,
			}),
		),
	]
}
