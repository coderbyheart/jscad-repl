import { booleans, extrusions, primitives, transforms } from '@jscad/modeling'
import type {
	Geom2,
	Geom3,
	Path2,
	Poly3,
} from '@jscad/modeling/src/geometries/types'
import { hexagonGrid, width as hexagonWidth } from '../utils/hexagon'

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
				translateY(
					-2 * hexagonWidth(screenGapHeight * 2),
					hexagonGrid({
						cols: 5,
						rows: 9,
						height: baseThicknessMM,
						size: screenGapHeight * 2,
						wallThickness: wallThickness,
					}),
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
