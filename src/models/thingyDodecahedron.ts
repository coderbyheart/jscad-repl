import { colorize, hexToRgb } from '@jscad/modeling/src/colors'
import {
	intersect,
	subtract,
	union,
} from '@jscad/modeling/src/operations/booleans'
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions'
import { hullChain } from '@jscad/modeling/src/operations/hulls'
import {
	rotateX,
	rotateY,
	rotateZ,
	scale,
	translate,
	translateX,
	translateY,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import {
	cuboid,
	cylinder,
	sphere,
	triangle,
} from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const radius = 68 / 2
const innerRadius = radius * Math.cos(Math.PI / 5)
const faceAngle = 127 // 116.56505
const segmentAngle = 360 / 5
const depth = 5

const thingy = () =>
	union(
		translateZ(
			1.5,
			cuboid({
				size: [50, 50, 3],
			}),
		),
		translateZ(
			15 / 2 + 3,
			cuboid({
				size: [54, 54, 15],
			}),
		),
	)

const brace = () =>
	union(
		translate(
			[54 / 2, 54 / 2, radius],
			sphere({
				radius: 3 * 2,
				segments: 12,
			}),
		),
		translate(
			[radius - 6, 0, 6],
			sphere({
				radius: 3 * 2,
				segments: 12,
			}),
		),
		translate(
			[54 / 2, -54 / 2, radius],
			sphere({
				radius: 3 * 2,
				segments: 12,
			}),
		),
		rotateZ(
			degToRad(-segmentAngle),
			translate(
				[radius - 6, 0, 6],
				sphere({
					radius: 3 * 2,
					segments: 12,
				}),
			),
		),
		translate(
			[-54 / 2, -54 / 2, radius],
			sphere({
				radius: 3 * 2,
				segments: 12,
			}),
		),
		rotateZ(
			degToRad(-segmentAngle * 2),
			translate(
				[radius - 6, 0, 6],
				sphere({
					radius: 3 * 2,
					segments: 12,
				}),
			),
		),
		rotateZ(
			degToRad(-segmentAngle * 3),
			translate(
				[radius - 6, 0, 6],
				sphere({
					radius: 3 * 2,
					segments: 12,
				}),
			),
		),
		translate(
			[-54 / 2, 54 / 2, radius],
			sphere({
				radius: 3 * 2,
				segments: 12,
			}),
		),
		rotateZ(
			degToRad(-segmentAngle * 4),
			translate(
				[radius - 6, 0, 6],
				sphere({
					radius: 3 * 2,
					segments: 12,
				}),
			),
		),
		// Beams
		rotateX(
			degToRad(45),
			cuboid({
				size: [5, 5, radius + 12],
				center: [innerRadius, 3, 6 + radius / 2],
			}),
		),
		rotateX(
			degToRad(-45),
			cuboid({
				size: [5, 5, radius + 12],
				center: [innerRadius, -3, 6 + radius / 2],
			}),
		),
		translate(
			[-innerRadius + 2, -innerRadius / 2 - 8, radius / 2 + 4],
			rotateZ(
				degToRad(-25),
				rotateX(
					degToRad(30),
					cuboid({
						size: [5, 5, radius],
					}),
				),
			),
		),
		translate(
			[-innerRadius + 2, innerRadius / 2 + 8, radius / 2 + 4],
			rotateZ(
				degToRad(25),
				rotateX(
					degToRad(-30),
					cuboid({
						size: [5, 5, radius],
					}),
				),
			),
		),
		translate(
			[radius / 2, radius - 6, radius / 2 + 4],
			rotateZ(
				degToRad(10),
				rotateY(
					degToRad(40),
					cuboid({
						size: [5, 5, radius],
					}),
				),
			),
		),
		translate(
			[radius / 2, -radius + 6, radius / 2 + 4],
			rotateZ(
				degToRad(-10),
				rotateY(
					degToRad(40),
					cuboid({
						size: [5, 5, radius],
					}),
				),
			),
		),
		translate(
			[-radius / 2 + 10, radius - 6, radius / 2],
			rotateZ(
				degToRad(-5),
				rotateY(
					degToRad(-50),
					cuboid({
						size: [5, 5, radius * 1.4],
					}),
				),
			),
		),
		translate(
			[-radius / 2 + 10, -radius + 6, radius / 2],
			rotateZ(
				degToRad(5),
				rotateY(
					degToRad(-50),
					cuboid({
						size: [5, 5, radius * 1.4],
					}),
				),
			),
		),
		// Horizontal
		cuboid({
			size: [5, radius * 1.2, 5],
			center: [-radius * 0.65, 0, 5],
		}),
	)

const hexagon = () =>
	union(
		hullChain(
			...[...new Array(6)].map((_, i) =>
				rotateZ(
					degToRad(segmentAngle * i),
					translateX(
						radius - depth,
						rotateX(
							degToRad(90),
							translateZ(
								-0.05,
								extrudeLinear(
									{
										height: 0.1,
									},
									triangle({
										type: 'ASA',
										values: [degToRad(90), depth, degToRad(52.5)],
									}),
								),
							),
						),
					),
				),
			),
		),
		intersect(
			rotateZ(
				degToRad(segmentAngle / 2),
				translate(
					[0, 0, depth / 4],
					translateX(
						-1.5 * radius,
						cylinder({
							radius,
							segments: 5,
							height: depth / 2,
						}),
					),
				),
			),
			cylinder({
				radius: innerRadius + (radius - innerRadius) / 2,
				segments: 5,
				height: depth,
			}),
		),
	)

const cube = () => [
	hexagon(),
	...[...new Array(5)].map((_, i) =>
		rotateZ(
			degToRad(segmentAngle * i),
			translateX(
				-innerRadius,
				rotateY(
					degToRad(faceAngle / 2),
					rotateZ(degToRad(180), translateX(innerRadius, hexagon())),
				),
			),
		),
	),
	translateZ(radius * 2.6175, rotateY(degToRad(180), hexagon())),
	translateZ(
		radius * 2.6175,
		rotateY(
			degToRad(180),

			...[...new Array(5)].map((_, i) =>
				rotateZ(
					degToRad(segmentAngle * i),
					translateX(
						-innerRadius,
						rotateY(
							degToRad(faceAngle / 2),
							rotateZ(degToRad(180), translateX(innerRadius, hexagon())),
						),
					),
				),
			),
		),
	),
]

export const thingyDodecahedron = () => [
	// colorize(hexToRgb('#e76f51'), cube()),
	rotateZ(
		degToRad(segmentAngle * 2.5),
		translateZ(radius, colorize(hexToRgb('#ff6600'), thingy())),
	),
	colorize(hexToRgb('#3a86ff'), translateY(radius * 2, hexagon())),
	colorize(
		hexToRgb('#C2F261'),
		subtract(
			brace(),
			scale(
				[1.02, 1.02, 1.02],
				rotateZ(degToRad(segmentAngle * 2.5), translateZ(radius, thingy())),
			),
			cube(),
		),
	),
	colorize(
		hexToRgb('#61F2C2'),
		subtract(
			translateZ(radius * 2.575, rotateY(degToRad(180), brace())),
			scale(
				[1.02, 1.02, 1.02],
				rotateZ(degToRad(segmentAngle * 2.5), translateZ(radius, thingy())),
			),
			cube(),
		),
	),
]
