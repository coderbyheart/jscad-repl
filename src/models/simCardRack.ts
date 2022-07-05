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

const { translate, scale, mirrorX } = transforms
const { cylinder, cuboid } = primitives
const { hull } = hulls
const { colorize, hexToRgb } = colors
const { subtract, union } = booleans

const simWidth = 12.3
const simHeight = 8.8

const sim = () => {
	const thickness = 0.67
	const cornerRadius = 1
	return translate(
		[0, 0, thickness / 2],
		hull([
			translate(
				[cornerRadius, cornerRadius, 0],
				cylinder({ height: thickness, radius: cornerRadius }),
			),
			translate(
				[simHeight - cornerRadius - 1, cornerRadius, 0],
				cylinder({ height: thickness, radius: cornerRadius }),
			),
			translate(
				[simHeight - cornerRadius, cornerRadius + 1, 0],
				cylinder({ height: thickness, radius: cornerRadius }),
			),
			translate(
				[simHeight - cornerRadius, simWidth - cornerRadius, 0],
				cylinder({ height: thickness, radius: cornerRadius }),
			),
			translate(
				[cornerRadius, simWidth - cornerRadius, 0],
				cylinder({ height: thickness, radius: cornerRadius }),
			),
		]),
	)
}

const simTray = () => {
	const thickness = 2
	const cornerRadius = 1
	const width = simWidth + 5
	const height = simHeight + 3
	return translate(
		[0, 0, thickness / 2],
		subtract(
			union(
				subtract(
					hull([
						// Bottom Tray
						translate(
							[cornerRadius, cornerRadius, 0],
							cylinder({ height: thickness, radius: cornerRadius }),
						),
						translate(
							[height - cornerRadius, cornerRadius, 0],
							cylinder({ height: thickness, radius: cornerRadius }),
						),
						translate(
							[cornerRadius, width - cornerRadius, 0],
							cylinder({ height: thickness, radius: cornerRadius }),
						),
						translate(
							[height - cornerRadius, width - cornerRadius, 0],
							cylinder({ height: thickness, radius: cornerRadius }),
						),
					]),
					translate([1.5, 1.5, 0], scale([1.025, 1.025, 2.3], sim())),
				),
				cuboid({
					size: [height - 1, 1.5, 0.5],
					center: [height / 2, width - 1.5, 1.2],
				}),
			),
			translate([2, 2.5, -2], scale([0.9, 0.9, 5], sim())),
		),
	)
}

export const simCardRack = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	return [
		//colorize(hexToRgb('#FFD700'), translate([1.5, 1.5, 4], sim())),
		colorize(hexToRgb('#3333ff'), simTray()),
	]
}
