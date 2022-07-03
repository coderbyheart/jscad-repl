import { booleans, extrusions, primitives, transforms } from '@jscad/modeling'
import type {
	Geom2,
	Geom3,
	Path2,
	Poly3,
} from '@jscad/modeling/src/geometries/types'

const { cylinder, cuboid, polygon } = primitives
const { translateZ, translate, translateY, translateX, rotateZ, rotate } =
	transforms
const { subtract, intersect, union } = booleans
const { extrudeRectangular, extrudeLinear } = extrusions

export const baseThicknessMM = 5
const screenGapWidth = 9.5
const screenGapHeight = 10
export const screenBaseHeight = 250
const wallThickness = 2
const baseToHeighRatio = 10 / 40
const gapRotation = 0.1
const gapYShift = -1.5

const hexSegment = ({
	radius,
	height,
	wallThickness,
}: {
	radius: number
	height: number
	wallThickness: number
}) =>
	subtract([
		cylinder({
			height,
			radius: radius + wallThickness,
			segments: 6,
		}),
		cylinder({
			height: height,
			radius: radius - wallThickness,
			segments: 6,
		}),
	])

const outerFrame = ({
	height,
	wallThickness,
	thickness,
	baseToHeighRatio,
	topWidth,
}: {
	height: number
	wallThickness: number
	thickness: number
	topWidth: number
	baseToHeighRatio: number
}) => [
	extrudeRectangular(
		{ size: wallThickness, height: thickness },
		polygon({
			points: [
				[topWidth / 2, -topWidth / 2],
				[topWidth / 2, topWidth / 2],
				[height, height * baseToHeighRatio],
				[height, -(height * baseToHeighRatio)],
			],
		}),
	),
]

export const stand = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	return [
		union(
			subtract([
				translate(
					[0, 0, baseThicknessMM / 2],
					cylinder({
						height: baseThicknessMM,
						radius: screenGapHeight * 2,
						segments: 6,
					}),
				),
				translate(
					[-screenGapHeight * 2, gapYShift, 0],
					rotateZ(
						Math.PI * 2 + gapRotation,
						cuboid({
							size: [screenGapHeight * 4, screenGapWidth, screenGapHeight * 2],
						}),
					),
				),
			]),
			intersect(
				extrudeLinear(
					{
						height: baseThicknessMM * 2,
					},
					polygon({
						points: [
							[screenGapHeight, screenGapHeight],
							[screenGapHeight, -screenGapHeight],
							[screenBaseHeight, -(screenBaseHeight * baseToHeighRatio)],
							[screenBaseHeight, screenBaseHeight * baseToHeighRatio],
						],
					}),
				),
				union(
					// Hex row 1
					translateX(
						screenGapHeight * 4,
						rotateZ(
							Math.PI / 3,
							translate(
								[screenGapHeight * 2, 0, baseThicknessMM / 2],
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translateX(
						screenGapHeight * 4,
						rotateZ(
							-Math.PI / 3,
							translate(
								[screenGapHeight * 2, 0, baseThicknessMM / 2],
								rotateZ(
									0,
									hexSegment({
										height: baseThicknessMM,
										radius: screenGapHeight * 2,
										wallThickness: wallThickness,
									}),
								),
							),
						),
					),
					// Hex row 2
					translate(
						[screenGapHeight * 8, 0, baseThicknessMM / 2],
						hexSegment({
							height: baseThicknessMM,
							radius: screenGapHeight * 2,
							wallThickness: wallThickness,
						}),
					),
					// Hex row 3
					translate(
						[screenGapHeight * 10, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 2,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 10, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 2,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					// Hex row 4
					translate(
						[screenGapHeight * 14, 0, baseThicknessMM / 2],
						hexSegment({
							height: baseThicknessMM,
							radius: screenGapHeight * 2,
							wallThickness: wallThickness,
						}),
					),
					translate(
						[screenGapHeight * 12, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 4,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 12, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 4,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					// Hex row 5
					translate(
						[screenGapHeight * 16, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 2,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 16, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 2,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					// Hex row 6
					translate(
						[screenGapHeight * 20, 0, baseThicknessMM / 2],
						hexSegment({
							height: baseThicknessMM,
							radius: screenGapHeight * 2,
							wallThickness: wallThickness,
						}),
					),
					translate(
						[screenGapHeight * 18, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 4,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 18, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 4,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 16, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 8,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 16, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 8,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),

					// Hex row 5
					translate(
						[screenGapHeight * 22, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 2,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 22, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 2,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 20, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 6,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 20, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 6,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 18, 0, baseThicknessMM / 2],
						rotateZ(
							Math.PI / 3,
							translateX(
								screenGapHeight * 10,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
					translate(
						[screenGapHeight * 18, 0, baseThicknessMM / 2],
						rotateZ(
							-Math.PI / 3,
							translateX(
								screenGapHeight * 10,
								hexSegment({
									height: baseThicknessMM,
									radius: screenGapHeight * 2,
									wallThickness: wallThickness,
								}),
							),
						),
					),
				),
			),
			subtract(
				outerFrame({
					height: screenBaseHeight - wallThickness,
					wallThickness,
					thickness: baseThicknessMM,
					baseToHeighRatio,
					topWidth: screenGapHeight * 2,
				}),
				translateY(
					gapYShift,
					rotateZ(
						Math.PI * 2 + gapRotation,
						cuboid({
							size: [screenGapHeight * 4, screenGapWidth, screenGapHeight * 2],
						}),
					),
				),
			),
		),
	]
}
