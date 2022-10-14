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
import { translateY } from '@jscad/modeling/src/operations/transforms'

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
	const shaveOff = 0.2 // shave off a bit to fit in the rack
	const thickness = 2 - shaveOff
	const cornerRadius = 1
	const width = simWidth + 5 - shaveOff
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

export const simRack = ({
	slots,
	height,
	simHolder,
}: {
	slots: number
	height: number
	simHolder: {
		width: number
		depth: number
	}
}) => {
	const padding = 4
	const width = simHolder.width + padding
	const depthPerSlot = simHolder.depth + padding
	const slotHolders = []
	for (let i = 0; i < slots; i++) {
		slotHolders.push(
			translate(
				[((i % 2) * width) / 2, i * depthPerSlot, 0],
				subtract(
					cuboid({
						size: [width, depthPerSlot, height],
					}),
					cuboid({
						size: [simHolder.width, simHolder.depth, height],
					}),
				),
			),
		)
	}
	return translate(
		[0, 0, height / 2],
		union(
			translateY(depthPerSlot / 2, slotHolders),
			translate(
				[padding, 0, 0],
				union(
					subtract(
						cylinder({
							height: height,
							radius: width / 2 + padding,
						}),
						cylinder({
							height: height,
							radius: width / 2,
						}),
						cuboid({
							size: [(width / 2 + padding) * 2, width, height],
							center: [0, width / 2, 0],
						}),
					),
					cuboid({
						size: [padding, padding + simHolder.depth, height],
						center: [
							width / 2 + padding / 2,
							(padding + simHolder.depth) / 2,
							0,
						],
					}),
				),
			),
		),
	)
}

export const simCardRack = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	return [
		//colorize(hexToRgb('#FFD700'), translate([1.5, 1.5, 4], sim())),
		//colorize(hexToRgb('#3333ff'), translateX(-30, simTray())),
		colorize(
			hexToRgb('#ff3333'),
			simRack({
				slots: 10,
				height: 3,
				simHolder: {
					width: 12,
					depth: 2,
				},
			}),
		),
	]
}
