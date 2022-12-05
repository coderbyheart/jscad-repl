import { colorize, hexToRgb } from '@jscad/modeling/src/colors'
import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import {
	rotateX,
	rotateZ,
	translate,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const panelWidth = 120
const panelLength = 282
const boxHeight = 150
const thickness = 4

export const ledPanel = () => {
	const height = 2

	return union(
		cuboid({
			size: [panelLength, panelWidth, height],
			center: [0, 0, height / 2],
		}),
		// Connector plug
		cuboid({
			size: [15, 10, 5],
			center: [
				panelLength / 2 - 15 / 2,
				-(panelWidth / 2 - 10 / 2),
				height / 2 + 5 / 2,
			],
		}),
	)
}

const side = ({
	length,
	height,
	thickness,
}: {
	length: number
	height: number
	thickness: number
}) => {
	const padding = 15
	const radius = 20
	const segments = 64
	return union(
		// Plate
		subtract(
			cuboid({ size: [length, thickness, height] }),
			// ridge for LED panel
			cuboid({
				size: [length, thickness, thickness],
				center: [0, -thickness / 2, height / 2],
			}),
			// Cut out circle 1
			translate(
				[-length / 2 + 20 + padding, 0, height / 2 - 20 - padding],
				rotateX(
					degToRad(90),
					cylinder({
						segments,
						radius: radius,
						height: padding,
					}),
				),
			),
			// Cut out circle 2
			translate(
				[length / 2 - radius - padding, 0, height / 2 - radius - padding],
				rotateX(
					degToRad(90),
					cylinder({
						segments,
						radius: radius,
						height: padding,
					}),
				),
			),
			// Cut out box between circles
			translateZ(
				height / 2 - radius - padding,
				cuboid({
					size: [length - 2 * radius - 2 * padding, radius, radius * 2],
				}),
			),
			cuboid({
				size: [length - padding * 2, radius, height - padding * 2],
				center: [0, 0, -radius],
			}),
			// Cut out outer corner 1
			translate(
				[-length / 2, 0, height / 2],
				rotateX(
					degToRad(90),
					cylinder({
						segments,
						radius: radius,
						height: padding,
					}),
				),
			),
			// Cut out outer corner 2
			translate(
				[length / 2, 0, height / 2],
				rotateX(
					degToRad(90),
					cylinder({
						segments,
						radius: radius,
						height: padding,
					}),
				),
			),
		),
	)
}

export const ledPanelBox = () => [
	colorize(
		hexToRgb('#6a97bf'),
		translateZ(boxHeight, rotateX(degToRad(180), ledPanel())),
	),
	union(
		translate(
			[0, panelWidth / 2, boxHeight / 2],
			side({ height: boxHeight, length: panelLength + thickness, thickness }),
		),
		translate(
			[0, -panelWidth / 2, boxHeight / 2],
			rotateZ(
				degToRad(180),
				side({
					height: boxHeight,
					length: panelLength + thickness,
					thickness,
				}),
			),
		),
		translate(
			[-panelLength / 2, 0, boxHeight / 2],
			rotateZ(
				degToRad(90),
				side({
					height: boxHeight,
					length: panelWidth + thickness,
					thickness,
				}),
			),
		),
		translate(
			[panelLength / 2, 0, boxHeight / 2],
			rotateZ(
				degToRad(-90),
				side({
					height: boxHeight,
					length: panelWidth + thickness,
					thickness,
				}),
			),
		),
	),
]
