import { primitives } from '@jscad/modeling'
import type { Geometry } from '@jscad/modeling/src/geometries/types'
import { subtract } from '@jscad/modeling/src/operations/booleans'

const { cylinder } = primitives

export const wheelPlug = (height = 25): Geometry =>
	subtract(
		cylinder({
			height,
			radius: 9,
			segments: 16,
		}),
		cylinder({
			height,
			radius: 4.9,
			segments: 64,
		}),
	)
