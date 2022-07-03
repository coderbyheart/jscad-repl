import { booleans, colors, primitives, transforms } from '@jscad/modeling'
import type {
	Geom2,
	Geom3,
	Path2,
	Poly3,
} from '@jscad/modeling/src/geometries/types'
import { roundedRect } from './roundedRect'

const { translateX, translateZ } = transforms
const { union } = booleans
const { polygon } = primitives
const { colorize, hexToRgb } = colors

const cornerRadiusMm = 5
export const displayWidthMm = 305
export const displayHeightMm = 195
const bottomHeight = 80
const screenThicknessTopMM = 4
const screenThicknessBottomMM = 5

export const display = (): (Geom2 | Geom3 | Poly3 | Path2)[] => {
	return [
		// Screen
		translateZ(
			screenThicknessBottomMM,
			roundedRect({
				width: displayWidthMm,
				height: displayHeightMm,
				borderRadius: cornerRadiusMm,
				thickness: screenThicknessTopMM,
			}),
		),
		// Back
		translateX(
			(displayHeightMm - bottomHeight) / 2,
			roundedRect({
				width: displayWidthMm,
				height: bottomHeight,
				borderRadius: cornerRadiusMm,
				thickness: screenThicknessBottomMM,
			}),
		),
	]
}
