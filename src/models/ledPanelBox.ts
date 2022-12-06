import {
	intersect,
	subtract,
	union,
} from '@jscad/modeling/src/operations/booleans'
import {
	rotate,
	rotateX,
	rotateZ,
	translate,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

const panelWidth = 100
const panelLength = 279
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
	const sideCutsLeft = []
	const sideCutsRight = []
	for (let i = 0; i < height / (radius + padding / 2); i++) {
		sideCutsLeft.push(
			translate(
				[length / 2, 0, i * (radius + padding / 2) - height / 2 - 25],
				rotateX(
					degToRad(90),
					cylinder({
						segments,
						radius: radius / 2,
						height: padding,
					}),
				),
			),
		)
		sideCutsRight.push(
			translate(
				[-length / 2, 0, i * (radius + padding / 2) - height / 2 - 25],
				rotateX(
					degToRad(90),
					cylinder({
						segments,
						radius: radius / 2,
						height: padding,
					}),
				),
			),
		)
	}
	return union(
		// Plate
		subtract(
			union(
				// Base plate
				cuboid({ size: [length, thickness, height] }),
				// Inner support ridge
				subtract(
					cuboid({
						size: [length - 2 * radius, 6, 10],
						center: [0, -5, height / 2 - 5],
					}),
					rotate(
						[degToRad(90), 0, degToRad(90)], // Ridge
						cylinder({
							segments: 32,
							height: length - 2 * radius,
							radius: 15,
							center: [-15, height / 2 - 17, 0],
						}),
					),
				),
			),
			// ridge for LED panel
			cuboid({
				size: [length, 50, thickness],
				center: [0, -25, height / 2],
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
			...sideCutsLeft,
			...sideCutsRight,
		),
	)
}

export const ledPanelBox = () => [
	/*
	colorize(
		hexToRgb('#6a97bf'),
		translateZ(boxHeight, rotateX(degToRad(180), ledPanel())),
	),
	*/
	// Only print sides
	intersect(
		subtract(
			union(
				translate(
					[0, panelWidth / 2, boxHeight / 2],
					side({
						height: boxHeight,
						length: panelLength + thickness,
						thickness,
					}),
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
			// Cut-out for cable fastener
			cuboid({
				size: [10, panelWidth * 1.1, 2.5],
				center: [panelLength / 2 - 40, 0, boxHeight - 10],
			}),
		),
		cuboid({
			size: [50, 200, boxHeight],
			center: [(panelLength + thickness) / 2 - 25, 0, boxHeight / 2],
		}),
	),
]
