import {BoxBuilder, Mesh} from '@babylonjs/core';
import {SlotTransformNode} from '../slots/transform-node.slot';
import {BoxSlot} from '../slots/box.slot';

export interface Fillable {
    readonly meshes?: Mesh[];

    fillSlot(meshes: SlotTransformNode);
}

export function fillSlotBehavior(parent: BoxSlot) {
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

export function isContainerSlot(toCheck: any): toCheck is Fillable {
    return toCheck.fillSlot;
}
