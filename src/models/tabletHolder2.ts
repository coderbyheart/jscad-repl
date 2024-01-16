import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import { hull } from '@jscad/modeling/src/operations/hulls'
import { translateZ } from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'

const tablet = (
	width: number,
	length: number,
	height: number,
	cornerRadius: number,
) =>
	hull([
		cylinder({
			height,
			segments: 64,
			radius: cornerRadius,
			center: [width / 2 - cornerRadius, length / 2 - cornerRadius, 0],
		}),
		cylinder({
			height,
			segments: 64,
			radius: cornerRadius,
			center: [width / 2 - cornerRadius, -length / 2 + cornerRadius, 0],
		}),
		cylinder({
			height,
			segments: 64,
			radius: cornerRadius,
			center: [-width / 2 + cornerRadius, length / 2 - cornerRadius, 0],
		}),
		cylinder({
			height,
			segments: 64,
			radius: cornerRadius,
			center: [-width / 2 + cornerRadius, -length / 2 + cornerRadius, 0],
		}),
	])

export const tabletHolder2 = () => {
	return [
		translateZ(
			6,
			union(
				subtract(
					tablet(254, 164, 12, 15),
					tablet(244, 154, 8, 10),
					cuboid({
						size: [224, 154, 2],
						center: [0, 0, 5],
					}),
					cuboid({
						size: [254, 154, 40],
						center: [0, -154 * (2 / 6), 0],
					}),
					cuboid({
						size: [220, 35, 10],
						center: [0, 52.5, -5],
					}),
				),
				cuboid({
					size: [10, 135, 2],
					center: [0, 12.5, -5],
				}),
				cuboid({
					size: [10, 135, 2],
					center: [-80, 12.5, -5],
				}),
				cuboid({
					size: [10, 135, 2],
					center: [80, 12.5, -5],
				}),
			),
		),
	]
}
