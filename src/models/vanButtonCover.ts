import type { Geometry } from '@jscad/modeling/src/geometries/types'
import { subtract } from '@jscad/modeling/src/operations/booleans'
import { hull } from '@jscad/modeling/src/operations/hulls'
import {
	scale,
	scaleY,
	translate,
} from '@jscad/modeling/src/operations/transforms'
import { cylinder } from '@jscad/modeling/src/primitives'

const innerWidth = 83
const innerHeight = 55
const innerDepth = 3 // 7
const cornerRadius = 15

const hole = () =>
	hull(
		translate(
			[cornerRadius, cornerRadius, 0],
			cylinder({
				radius: cornerRadius,
				height: innerDepth,
			}),
		),
		translate(
			[innerWidth - cornerRadius, cornerRadius, 0],
			cylinder({
				radius: cornerRadius,
				height: innerDepth,
			}),
		),
		translate(
			[innerWidth / 2, innerHeight / 2, 0],
			scaleY(
				innerHeight / innerWidth,
				cylinder({
					height: innerDepth,
					radius: innerWidth / 2,
				}),
			),
		),
	)

const scaleFactor = 0.05

export const vanButtonCover = (): Geometry =>
	subtract(
		hole(),
		translate(
			[(innerWidth * scaleFactor) / 2, (innerHeight * scaleFactor) / 2, 0],
			scale([1 - scaleFactor, 1 - scaleFactor, 1], hole()),
		),
	)
