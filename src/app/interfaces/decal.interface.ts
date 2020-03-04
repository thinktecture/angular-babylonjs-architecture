import {Mesh, Vector3} from '@babylonjs/core';
import {TransformNodeGameObject} from '../game-objects/transform-node.game-object';

export interface DecalGameObject {
    decal: Mesh;
    meshes?: Mesh[]; // TODO cut better interfaces
    removeDecal: () => void;

    addDecal(parent: TransformNodeGameObject);
}

export function isDecalGameObject(toCheck: any): toCheck is DecalGameObject {
    return toCheck.removeDecal && toCheck.addDecal;
}

export function addDecalbehavior(parent: TransformNodeGameObject) {
    if (isDecalGameObject(parent) && !parent.decal) {
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

export function removeDecalBehavior(parent: TransformNodeGameObject) {
    if (isDecalGameObject(parent)) {
        parent.decal.dispose();
        parent.decal = undefined;
    }
}
