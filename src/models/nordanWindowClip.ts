import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import {
	cuboid,
	cylinder,
	cylinderElliptic,
} from '@jscad/modeling/src/primitives'
import { colors, transforms } from '@jscad/modeling'
import {
	translateX,
	translateY,
} from '@jscad/modeling/src/operations/transforms'
import { hull } from '@jscad/modeling/src/operations/hulls'
import { colorize, hexToRgb } from '@jscad/modeling/src/colors'
import { degToRad } from '@jscad/modeling/src/utils'

const { translate, rotateY, rotateX, rotate, translateZ } = transforms

const cutOutRadius = 7

export const nordanWindowClip = () => [
	subtract(
		cuboid({
			size: [35, 20, 11.5],
		}),
		translate(
			[8, 0, 1],
			cuboid({
				size: [19, 20, 9.5],
			}),
		),
		translate(
			[-(35 / 2 - 2.75), 0, 0],
			cuboid({
				size: [5.5, 11.5, 11.5],
			}),
		),
		// Under teeth
		translate([-(35 / 2 - 2.75), 0, -1], cuboid({ size: [5.5, 20, 9.5] })),
		// Drill hole
		translate(
			[35 / 2 - 22.5, 0, 10],
			cylinder({
				segments: 64,
				height: 40,
				radius: 2,
			}),
		),
		// Drill cone
		translate(
			[35 / 2 - 22.5, 0, -(11.5 / 2) + 2],
			cylinderElliptic({
				height: 4,
				segments: 64,
				startRadius: [4, 4],
				endRadius: [2, 2],
			}),
		),
		// Bottom hull
		translate(
			[35 / 2 - 6.5, 0, -(11.5 / 2) + 0.5],
			hull(
				translateY(
					-6,
					cylinder({
						segments: 64,
						height: 1,
						radius: 1.5,
					}),
				),
				translateY(
					6,
					cylinder({
						segments: 64,
						height: 1,
						radius: 1.5,
					}),
				),
			),
		),
		// Slanted edge
		translate(
			[2.5, 0, 10],
			rotateY(
				degToRad(80),
				cuboid({
					size: [20, 20, 10],
				}),
			),
		),
		// Left cutout
		translate(
			[-10, -cutOutRadius - 4.5, -1],
			cylinder({
				segments: 64,
				height: 9.5,
				radius: cutOutRadius,
			}),
		),
		// Right cutout
		translate(
			[-10, cutOutRadius + 4.5, -1],
			cylinder({
				segments: 64,
				height: 9.5,
				radius: cutOutRadius,
			}),
		),
		// Front slant
		rotateY(
			degToRad(65),
			translate([0, 0, -17], cuboid({ size: [10, 20, 10] })),
		),
	),
]
