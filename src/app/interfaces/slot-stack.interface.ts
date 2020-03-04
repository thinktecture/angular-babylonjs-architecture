import {Vector3} from '@babylonjs/core';
import {BoxSlot} from '../slots/box.slot';
import {SlotFactory} from '../services/slot.factory';
import {ContainerSlot} from '../slots/container.slot';
import {Dimensions} from '../base/dimensions.model';
import {SlotType} from '../base/game-object-type.model';

export interface SlotContainerStack {
    dimensions: Dimensions;
    slotFactory: SlotFactory;
    name: string;

    createStack();
}

export function slotContainerStackBehavior(parent: ContainerSlot) {
    const stackDim = {
        ...parent.dimensions,
        height: parent.dimensions.height / 2 - 0.35,
        position: new Vector3(0, -parent.dimensions.height / 2 / 2, 0),
    };
    parent.slotFactory.create(BoxSlot, stackDim, parent.name + 'stack', SlotType.Box, parent);

    parent.slotFactory.create(BoxSlot, {
        ...parent.dimensions,
        height: parent.dimensions.height / 2,
        position: new Vector3(0, +parent.dimensions.height / 2 / 2, 0),
    }, parent.name + 'stack', SlotType.Box, parent).addLight();
}
