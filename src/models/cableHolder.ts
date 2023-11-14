import { Geom3 } from '@jscad/modeling/src/geometries/types'
import { union, subtract } from '@jscad/modeling/src/operations/booleans'
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions'
import {
	rotate,
	rotateX,
	translate,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, triangle } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

export const cableHolder = (): Geom3[] => [
	union(
		cuboid({
			size: [14, 2, 30],
			center: [0, 4, 15],
		}),
		cuboid({
			size: [14, 14, 2],
			center: [0, 10, 30],
		}),
		cuboid({
			size: [14, 2, 22],
			center: [0, 18, 40],
		}),
		translate(
			[0, 16.5, 52.5],
			rotateX(
				degToRad(45),
				cuboid({
					size: [14, 2, 37],
				}),
			),
		),
		translate(
			[0, 17, 28],
			rotateX(
				degToRad(-45),
				cuboid({
					size: [14, 2, 36],
				}),
			),
		),
		cuboid({
			size: [14, 18, 2],
			center: [0, 3, 57],
		}),
		subtract(
			union(
				translate(
					[0, 4, 67],
					rotateX(
						degToRad(45),
						cuboid({
							size: [14, 30, 2],
						}),
					),
				),
				translate(
					[0, 13, 79],
					rotateX(
						degToRad(45),
						cuboid({
							size: [14, 2, 6],
						}),
					),
				),
			),
			translate(
				[0, 12, 85],
				rotate(
					[degToRad(270) - degToRad(45), 0, 0],
					translate(
						[5.25, 0, 0],
						rotate(
							[0, 0, degToRad(15) + degToRad(90)],
							extrudeLinear(
								{
									height: 10,
								},
								triangle({
									type: 'SAS',
									values: [20, degToRad(30), 20],
								}),
							),
						),
					),
				),
			),
		),
	),
]
