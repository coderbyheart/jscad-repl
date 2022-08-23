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
	rotate,
	rotateY,
	rotateZ,
	translateY,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { sphere } from '@jscad/modeling/src/primitives'
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
	width = 22,
	depth = 8,
	height = 18,
	innerWidth = 18.5,
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
						size: [depth, innerWidth, width],
					}),
				),
				translateZ(
					12,
					cuboid({
						size: [depth, innerWidth, height],
					}),
				),
				// Hole
				translate(
					[-2.5 / 2, 0, 2.5],
					cuboid({
						size: [3.5, 25, 5.5],
					}),
				),

				// Slant of top cut
				translate(
					[-depth / 2, 0, -depth / 2 + 2],
					rotate(
						[degToRad(90), degToRad(-45), degToRad(90)],
						extrudeLinear(
							{
								height: depth,
							},
							triangle({
								type: 'AAS',
								values: [degToRad(90), degToRad(45), width],
							}),
						),
					),
				),
			),
		),
	)

const zipTieHole = () =>
	union(
		cuboid({
			size: [Math.sqrt(2.5 * 2.5 * 2), 10, 1],
		}),
		subtract(
			translateZ(
				0.5,
				rotateY(
					degToRad(45),
					cuboid({
						size: [2.5, 10, 2.5],
					}),
				),
			),
			translateZ(
				-1,
				cuboid({
					size: [Math.sqrt(2.5 * 2.5 * 2), 10, 1],
				}),
			),
		),
	)

const cableHolder = () => {
	const width = 8.5
	const depth = 5
	const thickness = 2
	const ridges = []
	for (let i = 0; i < 6; i++) {
		ridges.push(
			translate(
				[0, -2.5, -5 + i * 2],
				rotate(
					[degToRad(45), 0, 0],
					cuboid({
						size: [50, 2, 2],
					}),
				),
			),
		)
	}
	return translate(
		[0, 0, 7.5],
		union(
			subtract(
				cuboid({
					size: [width, depth, 15 + 2],
					center: [0, 0, -1],
				}),
				cuboid({
					size: [width - thickness * 2, depth - thickness, 15],
					center: [0, -1, 0],
				}),
				...ridges,
				// Zip tie holes
				translateZ(3, zipTieHole()),
				translateZ(-5, zipTieHole()),
			),
		),
	)
}

const frontWheel = () =>
	union(
		cylinder({
			height: 25,
			radius: 5,
			center: [5, 0, 12.5],
		}),
		cuboid({
			center: [2.5, 0, 10],
			size: [5, 10, 20],
		}),
		rotateX(
			degToRad(90),
			intersect(
				cylinder({
					height: 10,
					radius: 20,
					segments: 20,
				}),
				cuboid({
					size: [40, 40, 40],
					center: [-20, 20, 0],
				}),
			),
		),
		sphere({
			radius: 5,
			center: [5, 0, 25],
		}),
	)

const batteryStraps = (pcbWidth: number, depth = 12, thickness = 3) =>
	subtract(
		cuboid({
			size: [depth + 2 * thickness, pcbWidth + 6 * thickness, thickness],
			center: [0, 0, thickness / 2],
		}),
		cuboid({
			size: [depth, pcbWidth, thickness],
			center: [0, 0, thickness / 2],
		}),
		cuboid({
			size: [depth, thickness, thickness],
			center: [0, pcbWidth / 2 + 1.5 * thickness, thickness / 2],
		}),
		cuboid({
			size: [depth, thickness, thickness],
			center: [0, -pcbWidth / 2 - 1.5 * thickness, thickness / 2],
		}),
	)

export const robotBody = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	const pcbWidth = 63.5
	const padding = 15
	const width = pcbWidth + padding * 2
	const length = 134
	const thickness = 2
	const slant = 15
	const motorSupportWidth = 25
	const motorSupportDepth = 8.5

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
		union(
			translate(
				[2, 0, 2],
				subtract(
					union(
						translate(
							[-16, motorSupportWidth / 2 + 1, 1.5],
							rotateX(degToRad(slant), motorPlate()),
						),
						translate(
							[-16, width - motorSupportWidth / 2 - 1, 1.5],
							rotateX(degToRad(-slant), motorPlate()),
						),
						translate(
							[-13 - 44.25, motorSupportWidth / 2, 2.5],
							rotateX(
								degToRad(slant),
								union(
									motorSupport(motorSupportWidth, motorSupportDepth),
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
							[-13 - 44.25, width - motorSupportWidth / 2, 2.5],
							rotateX(
								degToRad(-slant),
								union(
									motorSupport(motorSupportWidth, motorSupportDepth),
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
						// ... under motor plates
						cuboid({
							size: [16, 21, thickness],
							center: [-10, 10.5, -thickness / 2],
						}),
						cuboid({
							size: [16, 21, thickness],
							center: [-10, width - 10.5, -thickness / 2],
						}),
						// ... under motor support
						cuboid({
							size: [14, motorSupportWidth + 8, thickness],
							center: [-57, (motorSupportWidth + 8) / 2, -thickness / 2],
						}),
						cuboid({
							size: [14, motorSupportWidth + 8, thickness],
							center: [
								-57,
								width - (motorSupportWidth + 8) / 2,
								-thickness / 2,
							],
						}),
						// ... under cable holders
						cuboid({
							size: [12, 20, 2],
							center: [-8.5, 21, -thickness / 2],
						}),
						cuboid({
							size: [12, 20, 2],
							center: [-8.5, width - 21, -thickness / 2],
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
							translate(
								[-length * 1.5 - 6, 10, 0],
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
				translate([-12, width / 2, 0], battery(thickness)),
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
					translate([-12, (width * 1) / 1.1 / 2, 0], battery(thickness)),
				),
				translate([-12, width / 2, 0], battery(thickness)),
				cuboid({
					size: [10, 50, 10],
					center: [5, width / 2, 0],
				}),
			),
			// Holders to fasten cables
			translate([-11 - 44.25, 29, 2], cableHolder()),
			translate(
				[-11 - 44.25, width - 29, 2],
				rotateZ(degToRad(180), cableHolder()),
			),
			translate([-16, 28, 2], cableHolder()),
			translate([-16, width - 28, 2], rotateZ(degToRad(180), cableHolder())),
			translate([-length + 20, width / 2, 0], frontWheel()),
			translate([-length + 20, width / 2, 0], batteryStraps(pcbWidth)),
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
			center: [-62, width - 1, 0],
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
			center: [-62, 1, 0],
		}),
	)
