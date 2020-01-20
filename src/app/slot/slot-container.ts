import {Injectable} from '@angular/core';
import {Vector3} from '@babylonjs/core';
import {SlotBox} from './slot-box';
import {Dimensions, SlotTransformNode, SlotType} from './slot-transform';


@Injectable()
export class SlotContainer extends SlotTransformNode {

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

    private createStack() {
        const spaceBetween = 0.1;
        const maxSize = Math.floor(Math.random() * 4);

        this.position.y = this.dimensions.position.y / maxSize;

        // const maxSize = 4;
        let nextPosition = Vector3.Zero();
        for (let stackLevel = 0; stackLevel < maxSize; stackLevel++) {
            const levelDim = {
                ...this.dimensions,
                height: this.dimensions.height / maxSize - spaceBetween,
                position: nextPosition,
                parentDimension: this.dimensions,
            };
            if (levelDim.height + nextPosition.y > this.dimensions.height) {
                continue;
            }
            const box = this.slotFactory.create(SlotBox, levelDim, this.name + 'stack' + stackLevel, SlotType.Box, this);
            box.position = nextPosition;
            nextPosition = new Vector3(nextPosition.x, nextPosition.y + levelDim.height + spaceBetween, nextPosition.z);
            // box.position.y -= 1 / maxSize * 10;
        }
    }


    private createColumn() {
        console.log('CREATE COL');
        const spaceBetween = 0.1;
        const maxSize = Math.floor(Math.random() * 4);

        // this.position.z = this.dimensions.position.z / maxSize;

        let nextPosition = Vector3.Zero();
        for (let column = 0; column < maxSize; column++) {
            const levelDim = {
                ...this.dimensions,
                depth: this.dimensions.depth / maxSize - spaceBetween,
                position: nextPosition,
                parentDimension: this.dimensions,
            };
            if (levelDim.depth + nextPosition.z > this.dimensions.depth) {
                continue;
            }
            const box = this.slotFactory.create(SlotBox, levelDim, this.name + 'column' + column, SlotType.Box, this);
            box.position = nextPosition;
            nextPosition = new Vector3(nextPosition.x, nextPosition.y, nextPosition.z + levelDim.depth + spaceBetween);
        }
    }

}
