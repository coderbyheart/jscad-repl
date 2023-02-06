import { subtract } from '@jscad/modeling/src/operations/booleans'
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions'
import {
	rotateZ,
	scale,
	translate,
} from '@jscad/modeling/src/operations/transforms'
import {
	cylinder,
	cylinderElliptic,
	triangle,
} from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

export const webcamFocusRing = () => {
	const teeth = []
	for (let i = 0; i < 12; i++) {
		teeth.push(
			rotateZ(
				degToRad(360 / 12) * i,
				translate(
					[-0.5, -0.1 - 6, -2.5],
					extrudeLinear(
						{
							height: 5,
						},
						triangle({
							type: 'AAS',
							values: [degToRad(60), degToRad(60), 1],
						}),
					),
				),
			),
		)
	}

	return scale(
		[10, 10, 10],
		translate(
			[0, 0, 1],
			subtract(
				cylinder({
					radius: 8,
					segments: 6,
					height: 2,
				}),
				translate(
					[0, 0, 0.5],
					cylinder({
						radius: 5,
						segments: 6,
						height: 1,
					}),
				),
				translate(
					[0, 0, -0.5],
					subtract(
						cylinder({
							radius: 6,
							segments: 64,
							height: 1,
						}),
						...teeth,
					),
				),
			),
		),
		translate(
			[0, 0, 7],
			subtract(
				cylinderElliptic({
					height: 10,
					startRadius: [8, 8],
					endRadius: [15, 15],
					segments: 6,
				}),

				cylinderElliptic({
					height: 10,
					startRadius: [5, 5],
					endRadius: [14, 14],
					segments: 6,
				}),
			),
		),
	)
}
