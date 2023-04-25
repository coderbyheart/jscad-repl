import { colorize, hexToRgb } from '@jscad/modeling/src/colors'
import type { Geometry } from '@jscad/modeling/src/geometries/types'
import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import { hull } from '@jscad/modeling/src/operations/hulls'
import { scaleY, translate } from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'

const innerWidth = 83
const innerHeight = 55
const innerDepth = 7
const cornerRadius = 12.5

const hole = (depth: number, width: number, height: number) =>
	hull(
		translate(
			[cornerRadius, cornerRadius, 0],
			cylinder({
				radius: cornerRadius,
				height: depth,
				segments: 120,
			}),
		),
		translate(
			[width - cornerRadius, cornerRadius, 0],
			cylinder({
				radius: cornerRadius,
				height: depth,
				segments: 120,
			}),
		),
		translate(
			[width / 2, height / 2, 0],
			scaleY(
				0.68,
				subtract(
					cylinder({
						height: depth,
						radius: width / 2,
						segments: 240,
					}),
					cuboid({
						size: [width, width / 2, depth],
						center: [0, -width / 4, 0],
					}),
				),
			),
		),
	)

const scaleFactor = 0.05

export const vanButtonCover = (): Geometry[] => [
	colorize(
		hexToRgb('#CCCCCC'),
		subtract(
			hole(innerDepth, innerWidth, innerHeight),
			translate([2, 2.5, 0], hole(innerDepth, innerWidth - 4, innerHeight - 6)),
		),
	),
	colorize(
		hexToRgb('#FF9999'),
		translate(
			[-3, -3, 4.5],
			subtract(
				hole(2, innerWidth + 6, innerHeight + 6),
				cylinder({
					height: 20,
					segments: 120,
					radius: 10,
					center: [(innerWidth + 6) / 2, innerHeight / 2, 0],
				}),
			),
		),
	),
	colorize(
		hexToRgb('#30FF30'),
		union(
			cuboid({
				size: [10, 3.5, 2],
				center: [(innerWidth + 6 - 10) / 2, 1, -4.5],
			}),
			cuboid({
				size: [10, 3.5, 2],
				center: [(innerWidth + 6 - 10) / 2, innerHeight, -4.5],
			}),
			cuboid({
				size: [3.5, 10, 2],
				center: [1, innerHeight / 2 - 5, -4.5],
			}),
			cuboid({
				size: [3.5, 10, 2],
				center: [innerWidth - 1, innerHeight / 2 - 5, -4.5],
			}),
		),
	),
]
