import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import { hullChain } from '@jscad/modeling/src/operations/hulls'
import {
	rotateX,
	rotateY,
	translate,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const baseSize = 14.5
const cornerRadius = 2.5

export const growlightHolder = () => {
	return union([
		translate(
			[0, -baseSize / 2, baseSize / 2],
			cuboid({
				size: [baseSize + 10, baseSize, baseSize],
			}),
		),
		translate(
			[4.75 + 5, -3.5, baseSize - cornerRadius],
			subtract(
				hullChain(
					translate(
						[0, 1, 0],
						rotateY(
							degToRad(90),
							cylinder({
								radius: cornerRadius,
								height: 5,
							}),
						),
					),
					translate(
						[0, 1, -(baseSize - 2 * cornerRadius)],
						rotateY(
							degToRad(90),
							cylinder({
								radius: cornerRadius,
								height: 5,
							}),
						),
					),
					translate(
						[0, 100, -3],
						rotateY(
							degToRad(90),
							cylinder({
								radius: cornerRadius,
								height: 5,
							}),
						),
					),
					translate(
						[0, 100, 0],
						rotateY(
							degToRad(90),
							cylinder({
								radius: cornerRadius,
								height: 5,
							}),
						),
					),
					translate(
						[0, 1, 0],
						rotateY(
							degToRad(90),
							cylinder({
								radius: cornerRadius,
								height: 5,
							}),
						),
					),
				),
				translate(
					[0, 90, 5],
					rotateX(
						degToRad(-2),
						cuboid({
							size: [14, 14, 14],
						}),
					),
				),
			),
		),
	])
}
