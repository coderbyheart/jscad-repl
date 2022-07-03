import { hulls, primitives, transforms } from '@jscad/modeling'
import type { Geometry } from '@jscad/modeling/src/geometries/types'

const { cylinder } = primitives
const { translate } = transforms
const { hull } = hulls

export const roundedRect = ({
	width,
	height,
	thickness,
	borderRadius,
}: {
	width: number
	height: number
	thickness: number
	borderRadius: number
}): Geometry => {
	const corner = () =>
		cylinder({
			radius: borderRadius,
			height: thickness,
			segments: 64,
		})
	return translate(
		[-height / 2, -width / 2, thickness / 2],
		hull([
			// Top left corner
			translate([borderRadius, borderRadius, 0], corner()),
			// Top right corner
			translate([borderRadius, width - borderRadius, 0], corner()),
			// Bottom left corner
			translate([height - borderRadius, borderRadius, 0], corner()),
			// BottomRightCorner
			translate([height - borderRadius, width - borderRadius, 0], corner()),
		]),
	)
}
