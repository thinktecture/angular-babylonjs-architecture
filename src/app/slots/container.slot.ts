import {Vector3} from '@babylonjs/core';
import {BoxSlot} from './box.slot';
import {SlotTransformNode} from './transform-node.slot';
import {SlotContainerStack, slotContainerStackBehavior} from '../interfaces/slot-stack.interface';
import {SlotableDecorator} from '../base/slotable.decorator';
import {Dimensions} from '../base/dimensions.model';
import {SlotType} from '../base/game-object-type.model';


@SlotableDecorator()
export class ContainerSlot extends SlotTransformNode implements SlotContainerStack {

    init(dimensions: Dimensions, name: string, slotType: SlotType) {
        this.dimensions = dimensions;
        this.position = this.dimensions.position;
        this.name = name;
        this.slotType = slotType;

        if (this.slotType === SlotType.Random) {
            const typeNum = Math.floor(Math.random() * 2);
            switch (typeNum) {
                case 0:
                    this.slotType = SlotType.Box;
                    break;
                case 1:
                    this.slotType = SlotType.Stack;
                    break;
            }
        }

        switch (this.slotType) {
            case SlotType.Box:
                this.slotFactory.create(
                    BoxSlot,
                    {...this.dimensions, position: Vector3.Zero()},
                    this.name + 'Box', SlotType.Box, this,
                ).addLight();
                break;
            case SlotType.Stack:
                this.createStack();
                break;
        }
    }

    createStack() {
        return slotContainerStackBehavior(this);
    }
}
