import { Geom3 } from '@jscad/modeling/src/geometries/types'
import { union, subtract } from '@jscad/modeling/src/operations/booleans'
import { rotateX, translate } from '@jscad/modeling/src/operations/transforms'
import { cuboid } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

export const cableHolder = (): Geom3[] => [
	union(
		cuboid({
			size: [60, 2, 60],
		}),
		cuboid({
			size: [60, 18, 2],
			center: [0, 8, 30],
		}),
		cuboid({
			size: [60, 2, 22],
			center: [0, 18, 40],
		}),
		translate(
			[0, 16.5, 52.5],
			rotateX(
				degToRad(45),
				cuboid({
					size: [60, 2, 37],
				}),
			),
		),
		translate(
			[0, 15, 26],
			rotateX(
				degToRad(-45),
				cuboid({
					size: [60, 2, 42],
				}),
			),
		),
		cuboid({
			size: [60, 18, 2],
			center: [0, 3, 57],
		}),
		subtract(
			union(
				translate(
					[0, 4, 67],
					rotateX(
						degToRad(45),
						cuboid({
							size: [60, 30, 2],
						}),
					),
				),
				translate(
					[0, 13, 79],
					rotateX(
						degToRad(45),
						cuboid({
							size: [60, 2, 6],
						}),
					),
				),
			),
			translate(
				[-7.5, 15, 79],
				rotateX(
					degToRad(45),
					cuboid({
						size: [5, 25, 10],
					}),
				),
			),
			translate(
				[7.5, 15, 79],
				rotateX(
					degToRad(45),
					cuboid({
						size: [5, 25, 10],
					}),
				),
			),
			translate(
				[-22.5, 15, 79],
				rotateX(
					degToRad(45),
					cuboid({
						size: [5, 25, 10],
					}),
				),
			),
			translate(
				[22.5, 15, 79],
				rotateX(
					degToRad(45),
					cuboid({
						size: [5, 25, 10],
					}),
				),
			),
		),
	),
]
