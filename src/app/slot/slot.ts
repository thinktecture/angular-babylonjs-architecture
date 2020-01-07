import {Injectable} from '@angular/core';
import {TransformNode, Vector3} from '@babylonjs/core';
import {SceneContext} from '../services/scene-context.service';
import {SlotFactory} from '../services/slot-factory.service';
import {SlotBox} from './slot-box';
import {Dimensions, SlotTransformNode, SlotType} from './slot-transform';


@Injectable()
export class SlotContainer extends SlotTransformNode {

    constructor(private readonly sceneContext: SceneContext,
                private readonly slotFactory: SlotFactory,
                dimensions: Dimensions,
                name: string,
                private readonly slotType: SlotType = SlotType.Box,
                parent?: TransformNode,
    ) {
        super(name, sceneContext.scene);
        this.dimensions = dimensions;
        this.parent = parent;
        this.position = this.dimensions.position;

        if (this.slotType === SlotType.Random) {
            const typeNum = Math.floor(Math.random() * 2);
            switch (typeNum) {
                case 0:
                    this.slotType = SlotType.Box;
                    break;
                case 1:
                    this.slotType = SlotType.Stack;
                    break;
                case 2:
                    this.slotType = SlotType.Column;
                    break;
            }
        }
    }

    init() {
        switch (this.slotType) {
            case SlotType.Box:
                const box = this.slotFactory.create(SlotBox, this.dimensions, this.name + 'Box', SlotType.Box, this);
                box.parent = this;
                break;
            case SlotType.Stack:
                this.createStack();
                break;
        }
    }

    private createStack() {
        const spaceBetween = 0.1;
        const maxSize = Math.floor(Math.random() * 4);
        let nextPosition = Vector3.Zero();
        for (let stackLevel = 0; stackLevel < maxSize; stackLevel++) {
            const levelDim = {
                ...this.dimensions,
                height: this.dimensions.height / maxSize - spaceBetween,
                position: nextPosition,
            };
            if (levelDim.height + nextPosition.y > this.dimensions.height) {
                continue;
            }
            console.log('NEXT POS', nextPosition);
            const box = this.slotFactory.create(SlotBox, levelDim, this.name + 'stack' + stackLevel, SlotType.Box, this);
            box.position = nextPosition;
            nextPosition = new Vector3(nextPosition.x, nextPosition.y + levelDim.height + spaceBetween, nextPosition.z);
            box.parent = this;
        }
    }
}


