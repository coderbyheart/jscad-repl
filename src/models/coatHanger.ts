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
					center: [hangerDepth + 2 * thickness, 0, -height],
				}),
				cuboid({
					size: [thickness, width, 4],
					center: [hangerDepth + gapWidth / 2 + thickness, 0, -height + 1],
				}),
			]),
		),
	]
}
