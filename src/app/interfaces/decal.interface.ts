import {Mesh, Vector3} from '@babylonjs/core';
import {SlotTransformNode} from '../slots/transform-node.slot';

export interface DecalSlot {
    decal: Mesh;
    meshes?: Mesh[]; // TODO cut better interfaces
    removeDecal: () => void;

    addDecal(parent: SlotTransformNode);
}

export function isDecalSlot(toCheck: any): toCheck is DecalSlot {
    return toCheck.removeDecal && toCheck.addDecal;
}

export function decalSlotBehavior(parent: SlotTransformNode) {
    if (isDecalSlot(parent) && !parent.decal) {
        parent.decal = Mesh.CreateDecal(
            parent.name + 'decal',
            parent.meshes[0],
            parent.meshes[0].getAbsolutePosition().add(new Vector3(parent.dimensions.width / 2 + 0.01, 0, parent.dimensions.depth / 4)),
            new Vector3(1, 0, 0),
            new Vector3(3, 3, 3),
            0);
        parent.decal.material = this.materialService.getDecalMaterial();
    }
}

export function removeDecalSlotBehavior(parent: SlotTransformNode) {
    if (isDecalSlot(parent)) {
        parent.decal.dispose();
        parent.decal = undefined;
    }
}
