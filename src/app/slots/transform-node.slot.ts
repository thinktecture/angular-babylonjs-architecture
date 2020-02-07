import {TransformNode} from '@babylonjs/core';
import {SceneContext} from '../services/scene.context';
import {SlotFactory} from '../services/slot.factory';
import {Dimensions} from '../base/dimensions.model';
import {SlotType} from '../base/slot-type.model';

export abstract class SlotTransformNode extends TransformNode {
    dimensions: Dimensions;
    public information: string;
    protected slotType: SlotType;

    constructor(readonly sceneContext: SceneContext,
                readonly slotFactory: SlotFactory,
                parent?: TransformNode) {
        super(Math.floor(Math.random() * 10000) + '', sceneContext.scene);
        this.parent = parent;
    }

    abstract init(dimensions: Dimensions, name: string, type: SlotType);
}



