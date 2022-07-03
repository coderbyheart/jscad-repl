import { display, displayHeightMm, displayWidthMm } from './models/display'

import { colors, transforms } from '@jscad/modeling'
import { baseThicknessMM, screenBaseHeight, stand } from './models/stand'

const { translate, rotateY, rotateX, rotate, translateZ } = transforms
const { colorize, hexToRgb } = colors

export const demo = (parameters: { scale: number }) => {
	return [
		...colorize(
			hexToRgb('333333'),
			translate(
				[-11, 0, displayHeightMm / 2 + screenBaseHeight],
				rotateY(Math.PI / 2.1, display()),
			),
		),
		colorize(
			hexToRgb('ff3333'),
			translate(
				[0, baseThicknessMM / 2 - (displayWidthMm * 1) / 3, 250],
				rotate([0, Math.PI / 2, -Math.PI / 2], stand()),
			),
		),
		colorize(
			hexToRgb('ff3333'),
			translate(
				[0, baseThicknessMM / 2 + (displayWidthMm * 1) / 3, 250],
				rotate([0, Math.PI / 2, -Math.PI / 2], stand()),
			),
		),
		stand(),
	]
}
