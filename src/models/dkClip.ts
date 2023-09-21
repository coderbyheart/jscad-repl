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

export const dkClip = () => [
	translateZ(
		height / 2,
		subtract(
			cuboid({
				size: [depth, width, height],
			}),
			hull(
				translate(
					[0, -width / 2 + slotWidth / 2 + 9, height / 2 - slotWidth / 2 - 5],
					rotateY(
						degToRad(90),
						cylinder({
							height: 10,
							radius: slotWidth / 2,
						}),
					),
				),
				translate(
					[0, -width / 2 + slotWidth / 2 + 9, -height / 2 + slotWidth / 2 + 5],
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
					[0, width / 2 - slotWidth / 2 - 9, height / 2 - slotWidth / 2 - 5],
					rotateY(
						degToRad(90),
						cylinder({
							height: 10,
							radius: slotWidth / 2,
						}),
					),
				),
				translate(
					[0, width / 2 - slotWidth / 2 - 9, -height / 2 + slotWidth / 2 + 5],
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
				size: [depth, 6, height - 4],
				center: [0, -width / 2 + 2.5 + 2, 0],
			}),
			// Right hole
			cuboid({
				size: [depth, 6, height - 4],
				center: [0, width / 2 - 2.5 - 2, 0],
			}),
			// Center hole
			cuboid({
				size: [depth, width - 2 * (9 + 4 + 2), height - 4],
			}),
		),
	),
]
