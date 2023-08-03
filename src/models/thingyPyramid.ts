import { subtract } from '@jscad/modeling/src/operations/booleans'
import { hullChain } from '@jscad/modeling/src/operations/hulls'
import { rotateZ, translateZ } from '@jscad/modeling/src/operations/transforms'
import { cuboid, sphere } from '@jscad/modeling/src/primitives'
import { degToRad } from '@jscad/modeling/src/utils'

export const thingyPyramid = () => [
	translateZ(
		38,
		subtract(
			cuboid({
				size: [60, 60, 2],
			}),
			cuboid({
				size: [50, 50, 2],
			}),
		),
	),
	hullChain(
		sphere({
			radius: 2,
			center: [30, 30, 40],
		}),
		sphere({
			radius: 2,
			center: [-30, 30, 40],
		}),
		sphere({
			radius: 2,
			center: [-42, 42, 3],
		}),
		sphere({
			radius: 2,
			center: [42, 42, 3],
		}),
	),
	rotateZ(
		degToRad(90),
		hullChain(
			sphere({
				radius: 2,
				center: [30, 30, 40],
			}),
			sphere({
				radius: 2,
				center: [-30, 30, 40],
			}),
			sphere({
				radius: 2,
				center: [-42, 42, 3],
			}),
			sphere({
				radius: 2,
				center: [42, 42, 3],
			}),
		),
	),
	rotateZ(
		degToRad(180),
		hullChain(
			sphere({
				radius: 2,
				center: [30, 30, 40],
			}),
			sphere({
				radius: 2,
				center: [-30, 30, 40],
			}),
			sphere({
				radius: 2,
				center: [-42, 42, 3],
			}),
			sphere({
				radius: 2,
				center: [42, 42, 3],
			}),
		),
	),
	rotateZ(
		degToRad(270),
		hullChain(
			sphere({
				radius: 2,
				center: [30, 30, 40],
			}),
			sphere({
				radius: 2,
				center: [-30, 30, 40],
			}),
			sphere({
				radius: 2,
				center: [-42, 42, 3],
			}),
			sphere({
				radius: 2,
				center: [42, 42, 3],
			}),
		),
	),
]
