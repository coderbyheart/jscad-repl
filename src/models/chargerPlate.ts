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
import { translateZ } from '@jscad/modeling/src/operations/transforms'

const { translate, scale, mirrorX } = transforms
const { cylinder, cuboid } = primitives
const { hull } = hulls
const { colorize, hexToRgb } = colors
const { subtract, union } = booleans

const segments = 128

const roundedRect = ({
	radius,
	size,
	height,
}: {
	radius: number
	size: number
	height: number
}) =>
	hull(
		cylinder({
			center: [radius, radius, 0],
			height,
			radius,
			segments,
		}),
		cylinder({
			center: [radius, size - radius, 0],
			height,
			radius,
			segments,
		}),
		cylinder({
			center: [size - radius, radius, 0],
			height,
			radius,
			segments,
		}),
		cylinder({
			center: [size - radius, size - radius, 0],
			height,
			radius,
			segments,
		}),
	)

export const cone = ({
	topRadius,
	bottomRadius,
	height,
}: {
	topRadius: number
	bottomRadius: number
	height: number
}) =>
	hull(
		cylinder({
			center: [0, 0, 0],
			height: 0.1,
			radius: bottomRadius,
			segments,
		}),
		cylinder({
			center: [0, 0, height],
			height: 0.1,
			radius: topRadius,
			segments,
		}),
	)

export const chargerPlate = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	const radius = 8
	const size = 46
	return [
		subtract(
			union(
				translate([3, 3, 0], roundedRect({ radius, size, height: 6 })),
				subtract(
					translateZ(-3, roundedRect({ radius: 4, size: 52, height: 4 })),
					subtract(
						union(
							cuboid({
								center: [52 / 2, 52 / 2, 0],
								size: [17, 60, 20],
							}),
							cuboid({
								center: [52 / 2, 52 / 2, 0],
								size: [60, 17, 20],
							}),
						),
						cuboid({ center: [52 / 2, 52 / 2, 0], size: [40, 40, 20] }),
					),
				),
			),
			cylinder({
				center: [size / 2 + 3, size / 2 + 3, 0],
				height: 20,
				radius: 14,
				segments,
			}),
			cylinder({
				center: [3.5, 3.5, 0],
				height: 20,
				radius: 1.75,
				segments,
			}),
			translate(
				[3.5, 3.5, -1.9],
				cone({
					topRadius: 2.5,
					bottomRadius: 1.75,
					height: 1.5,
				}),
			),
			cylinder({
				center: [3.5, 48.5, 0],
				height: 20,
				radius: 1.75,
				segments,
			}),
			translate(
				[3.5, 48.5, -1.9],
				cone({
					topRadius: 2.5,
					bottomRadius: 1.75,
					height: 1.5,
				}),
			),
			cylinder({
				center: [48.5, 3.5, 0],
				height: 20,
				radius: 1.75,
				segments,
			}),
			translate(
				[48.5, 3.5, -1.9],
				cone({
					topRadius: 2.5,
					bottomRadius: 1.75,
					height: 1.5,
				}),
			),
			cylinder({
				center: [48.5, 48.5, 0],
				height: 20,
				radius: 1.75,
				segments,
			}),
			translate(
				[48.5, 48.5, -1.9],
				cone({
					topRadius: 2.5,
					bottomRadius: 1.75,
					height: 1.5,
				}),
			),
		),
	]
}
