import type { Geometry } from '@jscad/modeling/src/geometries/types'
import {
	intersect,
	subtract,
	union,
} from '@jscad/modeling/src/operations/booleans'
import { rotateX, translateZ } from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

export const vanValveOpener = (): Geometry =>
	union(
		translateZ(
			20,
			intersect(
				union(
					subtract(
						cylinder({
							height: 40,
							radius: 34 / 2,
							segments: 60,
						}),
						translateZ(
							5,
							intersect(
								cylinder({
									height: 30,
									radius: 22 / 2,
									segments: 60,
								}),
								cuboid({
									size: [15, 22, 30],
								}),
							),
						),
					),
					translateZ(
						22.5,
						intersect(
							subtract(
								cylinder({
									height: 5,
									radius: 34 / 2,
									segments: 60,
								}),
								cylinder({
									height: 5,
									radius: 22 / 2,
									segments: 60,
								}),
							),
							cuboid({
								size: [10, 34 / 2, 5],
								center: [0, 34 / 2, 0],
							}),
						),
					),
				),
				cuboid({
					size: [22 + 4, 34, 60],
				}),
			),
		),
		subtract(
			cylinder({
				height: 30,
				radius: 10,
				center: [0, 0, -15],
				segments: 60,
			}),
			translateZ(
				-8.5,
				rotateX(
					degToRad(90),
					cylinder({
						height: 50,
						radius: 2,
					}),
				),
			),
		),
	)
