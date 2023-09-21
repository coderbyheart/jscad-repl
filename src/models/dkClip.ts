import { subtract } from '@jscad/modeling/src/operations/booleans'
import { hull } from '@jscad/modeling/src/operations/hulls'
import {
	rotateY,
	translate,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const height = 46
const width = 74
const slotWidth = 4
const depth = 2
const distanceFromSide = 8

export const dkClip = () => [
	translateZ(
		height / 2,
		subtract(
			cuboid({
				size: [depth, width, height],
			}),
			hull(
				translate(
					[
						0,
						-width / 2 + slotWidth / 2 + distanceFromSide,
						height / 2 - slotWidth / 2 - 5,
					],
					rotateY(
						degToRad(90),
						cylinder({
							height: 10,
							radius: slotWidth / 2,
						}),
					),
				),
				translate(
					[
						0,
						-width / 2 + slotWidth / 2 + distanceFromSide,
						-height / 2 + slotWidth / 2 + 5,
					],
					rotateY(
						degToRad(90),
						cylinder({
							height: 10,
							radius: slotWidth / 2,
						}),
					),
				),
			),
			hull(
				translate(
					[
						0,
						width / 2 - slotWidth / 2 - distanceFromSide,
						height / 2 - slotWidth / 2 - 5,
					],
					rotateY(
						degToRad(90),
						cylinder({
							height: 10,
							radius: slotWidth / 2,
						}),
					),
				),
				translate(
					[
						0,
						width / 2 - slotWidth / 2 - distanceFromSide,
						-height / 2 + slotWidth / 2 + 5,
					],
					rotateY(
						degToRad(90),
						cylinder({
							height: 10,
							radius: slotWidth / 2,
						}),
					),
				),
			),
			// Left hole
			cuboid({
				size: [depth, distanceFromSide - 2 * depth, height - 2 * depth],
				center: [0, -width / 2 + (distanceFromSide - 2 * depth) / 2 + depth, 0],
			}),
			// Right hole
			cuboid({
				size: [depth, distanceFromSide - 2 * depth, height - 2 * depth],
				center: [0, width / 2 - (distanceFromSide - 2 * depth) / 2 - depth, 0],
			}),
			// Center hole
			cuboid({
				size: [
					depth,
					width - 2 * (distanceFromSide + 2 * depth + 2),
					height - 2 * depth,
				],
			}),
			...[
				// Top right hole
				[width / 2 - slotWidth / 2 - distanceFromSide, height / 2],
				// Top left hole
				[-width / 2 + slotWidth / 2 + distanceFromSide, height / 2],
				// Bottom right hole
				[width / 2 - slotWidth / 2 - distanceFromSide, -height / 2],
				// Top Bottom hole
				[-width / 2 + slotWidth / 2 + distanceFromSide, -height / 2],
			].map(([y, z]) =>
				translate(
					[0, y, z],
					rotateY(
						degToRad(90),
						cylinder({
							height: 10,
							radius: slotWidth / 2,
						}),
					),
				),
			),
		),
	),
]
