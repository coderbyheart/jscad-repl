import { Geom3 } from '@jscad/modeling/src/geometries/types'
import {
	intersect,
	subtract,
	union,
} from '@jscad/modeling/src/operations/booleans'
import {
	rotateZ,
	translate,
	translateZ,
} from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

export const sproutCap = () => {
	const solids: Geom3[] = translateZ(
		5,
		subtract(
			cylinder({
				height: 10,
				radius: 85 / 2,
				segments: 64,
			}),
			cylinder({
				height: 10,
				radius: 80 / 2,
				segments: 64,
			}),
		),
		// Screw-ridges
		...[0, 1, 2, 3, 4, 5].map((i) =>
			rotateZ(
				degToRad(i * 60),
				intersect(
					translateZ(
						4,
						cylinder({
							height: 2,
							radius: 85 / 2,
							segments: 64,
						}),
					),
					translate(
						[80, 0, 4],
						cylinder({
							height: 2,
							radius: 85 / 2,
							segments: 64,
						}),
					),
				),
			),
		),
	)

	// Mesh
	const mesh: Geom3[] = []
	for (let i = 0; i < 85; i += 3) {
		mesh.push(
			cuboid({
				size: [1, 85, 1],
				center: [i - 85 / 2, 0, 0.5],
			}),
		)
	}
	solids.push(
		intersect(
			union(
				union(mesh),
				union(rotateZ(degToRad(90), ...mesh)),
				subtract(
					cylinder({
						height: 1,
						radius: 85 / 2,
						segments: 64,
						center: [0, 0, 0.5],
					}),
					cylinder({
						height: 1,
						radius: 76 / 2,
						segments: 64,
						center: [0, 0, 0.5],
					}),
				),
			),
			cylinder({
				height: 2,
				radius: 85 / 2,
				segments: 64,
			}),
		),
	)

	return union(solids)
}
