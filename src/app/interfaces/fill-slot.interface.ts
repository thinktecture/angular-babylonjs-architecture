import {BoxBuilder, Mesh} from '@babylonjs/core';
import {TransformNodeGameObject} from '../game-objects/transform-node.game-object';
import {BoxGameObject} from '../game-objects/box.game-object';

export interface Fillable {
    readonly meshes?: Mesh[];

    fillGameObject(meshes: TransformNodeGameObject);
}

export function fillBehavior(parent: BoxGameObject) {
    if (parent.meshes.length) {
        parent.meshes.forEach(m => m.dispose());
        parent.meshes.length = 0;
    }

    const box = BoxBuilder.CreateBox(parent.name + 'Mesh', {...parent.dimensions}, parent.sceneContext.scene);
    box.parent = this;
    box.material = parent.materialService.getBoxMaterial(Math.random() > .5);
    parent.lightService.addShadowCaster(box);
    parent.meshes.push(box);
}

export function isContainer(toCheck: any): toCheck is Fillable {
    return toCheck.fillSlot;
}
