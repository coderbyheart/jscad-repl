import type { Geom3 } from '@jscad/modeling/src/geometries/types'
import {
	intersect,
	subtract,
	union,
} from '@jscad/modeling/src/operations/booleans'
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions'
import {
	rotateX,
	rotateZ,
	translateX,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import {
	cuboid,
	cylinder,
	cylinderElliptic,
	triangle,
} from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const holes: Geom3[] = []

const holeSizeX = 9.5
const holeSizeY = 7.5

for (let i = 0; i < 8; i++) {
	holes.push(
		rotateZ(
			degToRad((360 / 8) * i),
			translateX(
				15,
				subtract(
					union(
						translateZ(
							3,
							subtract(
								cylinderElliptic({
									startRadius: [(holeSizeX * 1.05) / 2, (holeSizeY * 1.1) / 2],
									endRadius: [(holeSizeX * 1.05) / 2, (holeSizeY * 1.1) / 2],
									height: 1,
								}),
								cylinderElliptic({
									startRadius: [(holeSizeX - 2) / 2, (holeSizeY - 2) / 2],
									endRadius: [(holeSizeX - 2) / 2, (holeSizeY - 2) / 2],
									height: 5,
								}),
							),
						),
						subtract(
							cylinderElliptic({
								startRadius: [holeSizeX / 2, holeSizeY / 2],
								endRadius: [holeSizeX / 2, holeSizeY / 2],
								height: 5,
							}),
							cylinderElliptic({
								startRadius: [(holeSizeX - 2) / 2, (holeSizeY - 2) / 2],
								endRadius: [(holeSizeX - 2) / 2, (holeSizeY - 2) / 2],
								height: 5,
							}),
						),
					),
					cuboid({
						size: [12, 2, 10],
					}),
				),
			),
		),
	)
}

const grapper = () =>
	translateZ(
		20,
		intersect(
			union(
				subtract(
					cylinder({
						radius: 29.8 / 2,
						height: 6,
					}),
					cylinder({
						radius: 29.8 / 2 - 2,
						height: 6,
					}),
				),
				translateZ(
					2.5,
					subtract(
						cylinder({
							radius: 29.8 / 2 + 1,
							height: 1,
						}),
						cylinder({
							radius: 29.8 / 2,
							height: 1,
						}),
					),
				),
			),
			translateZ(
				-5,
				extrudeLinear(
					{
						height: 10,
					},
					triangle({
						type: 'SSA',
						values: [20, 20, Math.PI / 3],
					}),
				),
			),
		),
	)

export const robotWheelAdapter = () =>
	union([
		translateZ(5, union(holes)),
		translateZ(
			2,
			subtract(
				cylinder({
					radius: 20,
					height: 1,
				}),
				cylinder({
					radius: 10,
					height: 2,
				}),
			),
		),
		translateZ(
			19,
			rotateX(
				degToRad(180),
				union(
					grapper(),
					rotateZ(degToRad(120), grapper()),
					rotateZ(degToRad(-120), grapper()),
				),
			),
		),
	])
