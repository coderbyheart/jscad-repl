import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { cuboid, cylinder } from "@jscad/modeling/src/primitives";
import { cone } from "./chargerPlate";
import { rotateZ, translateZ } from "@jscad/modeling/src/operations/transforms";
import { degToRad } from "@jscad/modeling/src/utils";

export const plantPotInlay = () => [
    translateZ(20, union(
        subtract(
            cylinder({
                center: [0,0,35/2],
                radius: 40,
                height: 35,
                segments: 64
            }),
            cylinder({
                center: [0,0,35/2],
                radius: 38,
                height: 35,
                segments: 64
            }),
        ),
        subtract(
            cone({
                topRadius: 40,
                bottomRadius: 7,
                height: 20,
                center: [0,0,-20]
            }),
            cone({
                topRadius: 38,
                bottomRadius: 5,
                height: 20,
                center: [0,0,-20]
            })
        ),
        cuboid({
            center: [0,0,-19.5],
            size: [12,1,1]
        }),
        rotateZ(degToRad(90), cuboid({
            center: [0,0,-19.5],
            size: [12,1,1]
        }))
    ))
]