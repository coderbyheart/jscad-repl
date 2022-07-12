import {
	booleans,
	colors,
	hulls,
	primitives,
	transforms,
} from '@jscad/modeling'
import type {
	Geom2,
	Geom3,
	Path2,
	Poly3,
} from '@jscad/modeling/src/geometries/types'

const { translateZ, scale, mirrorX } = transforms
const { cylinder, cuboid } = primitives
const { hull } = hulls
const { colorize, hexToRgb } = colors
const { subtract, union } = booleans

export const phoneHolder = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	return [
		union(
			translateZ(
				31,
				subtract(
					subtract(
						subtract(
							subtract(
								cylinder({
									center: [0, 0, 0],
									height: 20,
									radius: 8,
									segments: 32,
								}),
								cylinder({
									center: [0, 0, 0],
									height: 80,
									radius: 6,
									segments: 32,
								}),
							),
							cuboid({
								center: [7, 7, 20],
								size: [10, 10, 40],
							}),
						),
						cuboid({
							center: [-7, 7, -20],
							size: [10, 10, 40],
						}),
					),
					cuboid({
						center: [0, 7, 0],
						size: [40, 10, 8],
					}),
				),
				subtract(
					cuboid({
						center: [0, -4, 0],
						size: [16, 8, 20],
					}),
					cylinder({
						center: [0, 0, 0],
						height: 78,
						radius: 8,
						segments: 32,
					}),
				),
			),
			translateZ(
				-31,
				subtract(
					subtract(
						subtract(
							subtract(
								cylinder({
									center: [0, 0, 0],
									height: 20,
									radius: 8,
									segments: 32,
								}),
								cylinder({
									center: [0, 0, 0],
									height: 80,
									radius: 6,
									segments: 32,
								}),
							),
							cuboid({
								center: [7, 7, 20],
								size: [10, 10, 40],
							}),
						),
						cuboid({
							center: [-7, 7, -20],
							size: [10, 10, 40],
						}),
					),
					cuboid({
						center: [0, 7, 0],
						size: [40, 10, 8],
					}),
				),
				subtract(
					cuboid({
						center: [0, -4, 0],
						size: [16, 8, 20],
					}),
					cylinder({
						center: [0, 0, 0],
						height: 78,
						radius: 8,
						segments: 32,
					}),
				),
			),
			cuboid({
				center: [0, -7, 0],
				size: [16, 2, 78],
			}),
			cuboid({
				center: [0, -14, 40],
				size: [16, 12, 2],
			}),
			cuboid({
				center: [0, -20, 39],
				size: [16, 2, 4],
			}),
			cuboid({
				center: [0, -14, -40],
				size: [16, 12, 2],
			}),
			cuboid({
				center: [0, -20, -39],
				size: [16, 2, 4],
			}),
		),
	]
}
