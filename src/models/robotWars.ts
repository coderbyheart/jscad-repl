import {
	booleans,
	colors,
	extrusions,
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
import { intersect } from '@jscad/modeling/src/operations/booleans'
import { hullChain } from '@jscad/modeling/src/operations/hulls'
import {
	rotateY,
	rotateZ,
	translateX,
	translateY,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { degToRad } from '@jscad/modeling/src/utils'
import { hexagonGrid } from '../utils/hexagon'

const { translate, scale, mirrorX, rotateX } = transforms
const { cylinder, cuboid, triangle } = primitives
const { hull } = hulls
const { colorize, hexToRgb } = colors
const { subtract, union } = booleans
const { extrudeLinear } = extrusions

const counter = () =>
	translateY(
		1,
		rotateX(
			degToRad(90),
			extrudeLinear(
				{
					height: 2,
				},
				triangle({ type: 'AAS', values: [degToRad(90), degToRad(60), 24] }),
			),
		),
	)

const motorPlate = () =>
	subtract(
		union(
			translate(
				[1, 0, 6],
				cuboid({
					size: [2, 10, 22],
				}),
			),
			translate([2, 4, -4], counter()),
			translate([2, -4, -4], counter()),
		),
		cuboid({
			size: [10, 3, 5.5],
			center: [0, 0, 12],
		}),
	)

const battery = (thickness: number) =>
	rotateZ(
		degToRad(90),
		union(
			translateZ(
				thickness / 2,
				cylinder({
					height: thickness,
					radius: 11,
					segments: 32,
				}),
			),
			cuboid({
				size: [30, 25, thickness],
				center: [0, -7.5, thickness / 2],
			}),
		),
	)

export const motorSupport = (
	width = 21,
	thickness = 2,
	depth = 8,
	height = 18,
) =>
	translateZ(
		height / 2,
		union(
			subtract(
				// Base cube
				cuboid({
					size: [depth, width, height],
				}),
				intersect(
					rotateY(
						degToRad(90),
						cylinder({
							segments: 32,
							height: depth,
							radius: 10,
						}),
					),
					cuboid({
						size: [depth, 17, width],
					}),
				),
				translateZ(
					9,
					cuboid({
						size: [depth, width, height / 2],
					}),
				),
				translateX(
					-3.5 / 2,
					cuboid({
						size: [3.5, 25, 5.5],
					}),
				),
			),
			cuboid({
				size: [depth, width, thickness],
				center: [0, 0, -height / 2 + -thickness / 2],
			}),
		),
	)

export const robotBody = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	const pcbWidth = 63.5
	const padding = 12
	const width = pcbWidth + padding * 2
	const length = 134
	const thickness = 2
	const slant = 15
	const motorSupportWidth = 21
	const motorSupportDepth = 8

	const holes = [
		[-length + 120, 7.5 + padding],
		[-length + 67.8, 12.5 + padding],
		[-length + 67.8, width - padding - 23],
		[-length + 118.5, width - padding - 7.5],
		[-length + 37.3, 7.5 + padding],
		[-length + 43.6, width - padding - 7.5],
		[-length + 5.5, width - padding - 17],
	] as const

	return [
		translateZ(
			2,
			subtract(
				union(
					translate(
						[-17, motorSupportWidth / 2, 1.5],
						rotateX(degToRad(slant), motorPlate()),
					),
					translate(
						[-17, width - motorSupportWidth / 2, 1.5],
						rotateX(degToRad(-slant), motorPlate()),
					),
					//basePlate(70, width, thickness),
					translate(
						[-13 - 37.25, motorSupportWidth / 2, 4.5],
						rotateX(
							degToRad(slant),
							union(
								motorSupport(motorSupportWidth, thickness, motorSupportDepth),
								translateZ(
									-5,
									cuboid({
										size: [motorSupportDepth, motorSupportWidth, 10],
									}),
								),
							),
						),
					),
					translate(
						[-13 - 37.25, width - motorSupportWidth / 2, 4.5],
						rotateX(
							degToRad(-slant),
							union(
								motorSupport(motorSupportWidth, thickness, motorSupportDepth),
								translateZ(
									-5,
									cuboid({
										size: [motorSupportDepth, motorSupportWidth, 10],
									}),
								),
							),
						),
					),
					// Add connection plates
					cuboid({
						size: [20, 18, thickness],
						center: [-10, 9, -thickness / 2],
					}),
					cuboid({
						size: [20, 18, thickness],
						center: [-10, width - 9, -thickness / 2],
					}),
					cuboid({
						size: [14, 24, thickness],
						center: [-50, 12, -thickness / 2],
					}),
					cuboid({
						size: [14, 24, thickness],
						center: [-50, width - 12, -thickness / 2],
					}),
				),
				// Clean parts from motor support protruding under plate
				cuboid({
					size: [length, width, 10],
					center: [-length / 2, width / 2, -7],
				}),
			),
		),
		...holes.map(([x, y]) => screwHoleInHexagon(x, y, thickness)),
		subtract(
			union(
				subtract(
					translateZ(thickness, basePlate(60, width, thickness)),
					translate(
						[-2, 2, thickness],
						basePlate(60 - 2, width - 4, thickness),
					),
				),
				subtract(
					intersect(
						// Hexagon
						translateX(
							-length * 1.5,
							hexagonGrid({
								cols: 20,
								rows: 40,
								height: thickness,
								size: 8.445,
								wallThickness: 1,
							}),
						),
						// Cut to shape of frame
						union(
							translateZ(thickness, basePlate(60, width, thickness)),
							translateZ(thickness / 2, tip(length, width, thickness)),
						),
					),
				),
				translateZ(thickness / 2, tipFrame(length, width, thickness)),
			),
			translate([-11, width / 2, 0], battery(thickness)),
			// Punch holes
			...holes.map(([x, y]) =>
				cylinder({
					height: thickness,
					radius: 5,
					segments: 6,
					center: [x, y, thickness / 2],
				}),
			),
		),
		subtract(
			scale(
				[1.1, 1.1, 1],
				translate([-11, (width * 1) / 1.1 / 2, 0], battery(thickness)),
			),
			translate([-11, width / 2, 0], battery(thickness)),
			cuboid({
				size: [10, 50, 10],
				center: [5, width / 2, 0],
			}),
		),
	]
}
const basePlate = (length: number, width: number, thickness: number) =>
	cuboid({
		size: [length, width, thickness],
		center: [-length / 2, width / 2, -thickness / 2],
	})

const screwHoleInHexagon = (x: number, y: number, thickness: number) =>
	subtract(
		cylinder({
			height: thickness,
			radius: 5,
			segments: 6,
			center: [x, y, thickness / 2],
		}),
		cylinder({
			height: thickness,
			radius: 1.25,
			segments: 32,
			center: [x, y, thickness / 2],
		}),
	)

const tip = (length: number, width: number, thickness: number) =>
	hull(
		cylinder({
			height: thickness,
			radius: 5,
			segments: 6,
			center: [-60, 5, 0],
		}),
		cylinder({
			height: thickness,
			radius: 5,
			segments: 6,
			center: [-60, width - 5, 0],
		}),
		cylinder({
			height: thickness,
			radius: 5,
			segments: 6,
			center: [-length + 5, 29, 0],
		}),
		cylinder({
			height: thickness,
			radius: 5,
			segments: 6,
			center: [-length + 5, width - 29, 0],
		}),
	)

const tipFrame = (length: number, width: number, thickness: number) =>
	hullChain(
		cylinder({
			height: thickness,
			radius: 1,
			segments: 32,
			center: [-60, width - 1, 0],
		}),
		cylinder({
			height: thickness,
			radius: 1,
			segments: 32,
			center: [-length + 1, width - 25, 0],
		}),
		cylinder({
			height: thickness,
			radius: 1,
			segments: 32,
			center: [-length + 1, 25, 0],
		}),
		cylinder({
			height: thickness,
			radius: 1,
			segments: 32,
			center: [-60, 1, 0],
		}),
	)
