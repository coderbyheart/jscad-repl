import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import {
	rotateX,
	rotateZ,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

export const valveHolder = () => [
	translateZ(
		12,
		subtract(
			union([
				translateZ(
					-1,
					cylinder({
						height: 2,
						radius: 3,
						segments: 64,
					}),
				),
				cylinder({
					height: 6,
					radius: 2.4,
					segments: 64,
				}),
				translateZ(
					-6,
					union(
						cylinder({
							height: 8,
							radius: 6,
							segments: 8,
						}),
						rotateZ(
							degToRad(360 / 8 / 2),
							cylinder({
								height: 8,
								radius: 6,
								segments: 8,
							}),
						),
					),
				),
			]),
			translateZ(
				-8,
				subtract(
					rotateX(
						degToRad(45),
						cuboid({
							size: [20, 6, 6],
						}),
					),
					cuboid({
						size: [20, 20, 6],
						center: [0, 0, -3],
					}),
				),
			),
		),
	),
]
