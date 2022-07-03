import { booleans, extrusions, primitives, transforms } from '@jscad/modeling'

const { cylinder, cuboid, polygon } = primitives
const { translateZ, translate, translateY, translateX, rotateZ, rotate } =
	transforms
const { subtract, intersect, union } = booleans
const { extrudeRectangular, extrudeLinear } = extrusions

export const hexSegment = ({
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

export const hexagonGrid = ({
	size,
	height,
	wallThickness,
	rows,
	cols,
}: {
	size: number
	height: number
	wallThickness: number
	rows: number
	cols: number
}) => {
	const hexes = []
	const hexWidth = width(size)
	const hexHeight = size * 2
	for (let row = 0; row < rows; row++) {
		const x = hexHeight * row * (3 / 4)
		for (let col = 0; col < cols; col++) {
			const y = (hexWidth / 2) * (row % 2) + col * hexWidth
			hexes.push(
				translate(
					[x, y, 0],
					hexSegment({
						radius: size,
						height,
						wallThickness,
					}),
				),
			)
		}
	}
	return translate(
		[
			0,
			0,
			// Lay on 0 Z
			height / 2,
		],
		union(hexes),
	)
}

export const width = (size: number): number => Math.sqrt(3) * size
