import {Injectable} from '@angular/core';
import {TransformNode, Vector3} from '@babylonjs/core';
import {SlotBox} from './slot-box';
import {Dimensions, SlotTransformNode, SlotType} from './slot-transform';
import {SlotFactory} from '../services/slot-factory.service';


export interface SlotContainerStack {
    dimensions: Dimensions;
     slotFactory: SlotFactory;
    name: string;

    createStack();
}

export function slotContainerStackBehavior(parent: SlotContainer) {
    const stackDim = {
        ...parent.dimensions,
        height: parent.dimensions.height / 2 - 0.35,
        position: new Vector3(0, -parent.dimensions.height / 2 / 2, 0),
    };
    parent.slotFactory.create(SlotBox, stackDim, parent.name + 'stack', SlotType.Box, parent);

    parent.slotFactory.create(SlotBox, {
        ...parent.dimensions,
        height: parent.dimensions.height / 2,
        position: new Vector3(0, +parent.dimensions.height / 2 / 2, 0),
    }, parent.name + 'stack', SlotType.Box, parent).addLight();
}

@Injectable()
export class SlotContainer extends SlotTransformNode implements SlotContainerStack {

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
                    SlotBox,
                    { ...this.dimensions, position: Vector3.Zero() },
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
