import { colorize, hexToRgb } from '@jscad/modeling/src/colors'
import {
	intersect,
	subtract,
	union,
} from '@jscad/modeling/src/operations/booleans'
import { hull, hullChain } from '@jscad/modeling/src/operations/hulls'
import {
	translate,
	translateY,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'

const tablet_width = 250
const tablet_height = 154
const tablet_depth = 7
const tablet_cornerRadius = 11
const thickness = 2

const tabletBody = ({
	width,
	height,
	depth,
	cornerRadius,
}: {
	width: number
	height: number
	depth: number
	cornerRadius: number
}) =>
	hull(
		cylinder({
			segments: 64,
			center: [-width / 2 + cornerRadius, -height / 2 + cornerRadius, 0],
			radius: cornerRadius,
			height: depth,
		}),
		cylinder({
			segments: 64,
			center: [width / 2 - cornerRadius, -height / 2 + cornerRadius, 0],
			radius: cornerRadius,
			height: depth,
		}),
		cylinder({
			segments: 64,
			center: [width / 2 - cornerRadius, height / 2 - cornerRadius, 0],
			radius: cornerRadius,
			height: depth,
		}),
		cylinder({
			segments: 64,
			center: [-width / 2 + cornerRadius, height / 2 - cornerRadius, 0],
			radius: cornerRadius,
			height: depth,
		}),
	)

const triangle = (
	radius: number,
	width: number,
	height: number,
	depth = tablet_depth,
) =>
	hull(
		cylinder({
			radius: 2 * radius,
			segments: 64,
			center: [-width / 2 + radius, height / 2 - radius, depth],
			height: depth * 2,
		}),
		cylinder({
			radius: 2 * radius,
			segments: 64,
			center: [width / 2 - radius, height / 2 - radius, depth],
			height: depth * 2,
		}),
		cylinder({
			radius: 2 * radius,
			segments: 64,
			center: [0, -height / 2 + radius, depth],
			height: depth * 2,
		}),
	)

const hanger = (height: number, width: number, depth: number) =>
	triangle(1, width, height, depth)

export const tabletHolder = () => [
	/*
	translateZ(
		tablet_depth + thickness + 1,
		colorize(
			hexToRgb('#3333333'),
			tabletBody({
				width: tablet_width,
				height: tablet_height,
				depth: tablet_depth,
				cornerRadius: tablet_cornerRadius,
			}),
		),
	),*/
	colorize(
		hexToRgb('#0000cc'),
		translateZ(
			tablet_depth + thickness,
			intersect(
				// Outer frame
				subtract(
					tabletBody({
						width: tablet_width + 4 * thickness,
						height: tablet_height + 4 * thickness,
						depth: tablet_depth + thickness,
						cornerRadius: tablet_cornerRadius + 2 * thickness,
					}),
					translateZ(
						thickness / 2,
						tabletBody({
							width: tablet_width,
							height: tablet_height,
							depth: tablet_depth,
							cornerRadius: tablet_cornerRadius,
						}),
					),
					// Cutout for hanger
					translate(
						[0, -tablet_height / 2 - 5, -tablet_depth],
						hanger(20, 25, tablet_depth * 2),
					),
				),
				// Large Triangle
				translateZ(
					-tablet_depth,
					subtract(
						triangle(tablet_cornerRadius, tablet_width, tablet_height),
						translateY(
							tablet_cornerRadius * 6.5,
							triangle(tablet_cornerRadius, tablet_width, tablet_height),
						),
						// Inner triangle
						subtract(
							hullChain(
								cylinder({
									segments: 64,
									radius: tablet_cornerRadius,
									height: tablet_depth * 2,
									center: [
										tablet_width / 2 - tablet_cornerRadius * 2,
										tablet_height / 2 - tablet_cornerRadius * 2,
										0,
									],
								}),
								cylinder({
									segments: 64,
									radius: tablet_cornerRadius,
									height: tablet_depth * 2,
									center: [
										0,
										-tablet_height / 2 + tablet_cornerRadius * 1.5,
										0,
									],
								}),
								cylinder({
									segments: 64,
									radius: tablet_cornerRadius,
									height: tablet_depth * 2,
									center: [
										-tablet_width / 2 + tablet_cornerRadius * 2,
										tablet_height / 2 - tablet_cornerRadius * 2,
										0,
									],
								}),
							),
							subtract(
								cylinder({
									segments: 64,
									radius: tablet_cornerRadius * 2,
									height: tablet_depth * 2,
									center: [0, -tablet_height / 2 + tablet_cornerRadius * 2, 0],
								}),
								cylinder({
									segments: 64,
									radius: tablet_cornerRadius,
									height: tablet_depth * 2,
									center: [0, -tablet_height / 2 + tablet_cornerRadius * 2, 0],
								}),
							),
						),
						// Groves
						translateZ(
							tablet_depth + thickness / 2,
							intersect(
								subtract(
									tabletBody({
										width: tablet_width + 4 * thickness - 3,
										height: tablet_height + 4 * thickness - 3,
										depth: tablet_depth,
										cornerRadius: tablet_cornerRadius + 1.5 * thickness,
									}),
									tabletBody({
										width: tablet_width + thickness,
										height: tablet_height + thickness,
										depth: tablet_depth,
										cornerRadius: tablet_cornerRadius + 0.5 * thickness,
									}),
								),
								cuboid({
									size: [
										tablet_width + 4 * thickness,
										tablet_height / 2,
										tablet_depth * 2,
									],
									center: [0, tablet_height / 2, 0],
								}),
							),
						),
					),
				),
			),
		),
	),
	// Bottom corners
	colorize(
		hexToRgb('#ffff00'),
		translateZ(
			50,
			intersect(
				subtract(
					intersect(
						union(
							// Frame
							subtract(
								tabletBody({
									width: tablet_width + 4 * thickness - 3,
									height: tablet_height + 4 * thickness - 3,
									depth: tablet_depth,
									cornerRadius: tablet_cornerRadius + 1.5 * thickness,
								}),
								tabletBody({
									width: tablet_width + thickness,
									height: tablet_height + thickness,
									depth: tablet_depth,
									cornerRadius: tablet_cornerRadius + 0.5 * thickness,
								}),
							),
							// Cover
							translateZ(
								tablet_depth - thickness - 0.5,
								tabletBody({
									width: tablet_width + 4 * thickness,
									height: tablet_height + 4 * thickness,
									depth: thickness,
									cornerRadius: tablet_cornerRadius + 2 * thickness,
								}),
							),
						),
						// Big triangle
						translateZ(
							-tablet_depth,
							subtract(
								triangle(tablet_cornerRadius, tablet_width, tablet_height),
								translateY(
									tablet_cornerRadius * 6.5,
									triangle(tablet_cornerRadius, tablet_width, tablet_height),
								),
							),
						),
					),
					// Inner cutout
					translateZ(
						tablet_depth / 2,
						tabletBody({
							width: tablet_width - 6,
							height: tablet_height - 6,
							depth: tablet_depth,
							cornerRadius: tablet_cornerRadius - 2,
						}),
					),
				),
				// Only botton half
				cuboid({
					size: [tablet_width + 4 * thickness, tablet_height, tablet_depth * 4],
					center: [0, tablet_height / 2, 5],
				}),
			),
		),
	),
	// Hanger
	colorize(
		hexToRgb('#ff0000'),
		translate(
			[0, -50, 0],
			subtract(
				translate(
					[0, -tablet_height / 2 - 5, tablet_depth - 0.5 - thickness],
					subtract(
						hanger(20, 25, tablet_depth / 2 + thickness),
						cylinder({
							radius: 3,
							segments: 64,
							height: tablet_depth * 4,
							center: [0, 2, tablet_depth],
						}),
					),
				),
				// Cutout for tablet
				translateZ(
					tablet_depth + 1 + thickness,
					tabletBody({
						width: tablet_width,
						height: tablet_height,
						depth: tablet_depth,
						cornerRadius: tablet_cornerRadius,
					}),
				),
			),
		),
	),
]
