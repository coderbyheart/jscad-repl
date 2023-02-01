import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions'
import { rotate, translate } from '@jscad/modeling/src/operations/transforms'
import { cuboid, polygon } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const fanWidth = 92
const fanDepth = 26
const thickness = 2

export const fanHolder = () =>
	union(
		translate(
			[0, (fanWidth + thickness * 2) / 2, 0],
			subtract(
				rotate(
					[degToRad(90), 0, 0],
					extrudeLinear(
						{
							height: fanWidth + thickness * 2,
						},
						polygon({
							points: [
								[0, 0],
								[4, 0],
								[5.5, 30],
								[-1.5, 30],
							],
						}),
					),
				),
				cuboid({
					size: [50, (fanWidth + thickness * 2) * 0.8, 25],
					center: [0, -(fanWidth + thickness * 2) / 2, 10],
				}),
			),
		),
		translate(
			[(-(fanDepth + thickness) / 2) * 0.25, 0, 30 + 20.5],
			rotate(
				[0, degToRad(15), 0],
				union(
					subtract(
						cuboid({
							size: [fanDepth + thickness, fanWidth + thickness * 2, 40],
						}),
						cuboid({
							size: [fanDepth, fanWidth, 40],
							center: [-thickness, 0, thickness],
						}),
						cuboid({
							size: [fanDepth, fanWidth - 10, 80],
							center: [-thickness, 0, thickness],
						}),
						cuboid({
							size: [fanDepth - thickness * 4, fanWidth - thickness * 4, 40],
							center: [10, 0, 6],
						}),
					),
					// Clamps
					translate(
						[-fanDepth / 2 - 5, -fanWidth / 2 - thickness, 5],
						extrudeLinear(
							{
								height: 15,
							},
							polygon({
								points: [
									[0, 0],
									[4, 0],
									[4, 5],
								],
							}),
						),
					),
					translate(
						[-fanDepth / 2 - 5, fanWidth / 2 + thickness, 20],
						rotate(
							[degToRad(180), 0, 0],
							extrudeLinear(
								{
									height: 15,
								},
								polygon({
									points: [
										[0, 0],
										[4, 0],
										[4, 5],
									],
								}),
							),
						),
					),
				),
			),
		),
	)
