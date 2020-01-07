import {TransformNode, Vector3} from '@babylonjs/core';
import {SceneContext} from '../services/scene-context.service';
import {SlotFactory} from '../services/slot-factory.service';

export abstract class SlotTransformNode extends TransformNode {
    protected dimensions: Dimensions;
    protected slotType: SlotType;

    constructor(protected readonly sceneContext: SceneContext,
                protected readonly slotFactory: SlotFactory,
                parent?: TransformNode) {
        super('SlotTransformNode-' + Math.random(), sceneContext.scene);
        this.parent = parent;
    }

    abstract init(dimensions: Dimensions, name: string, type: SlotType);
}


export enum SlotType {
    Box,
    Stack,
    Column,
    Random,
    Ground,
    Bulb,
}

export interface Dimensions {
    height: number;
    width: number;
    depth?: number;
    position?: Vector3;
    parentDimensions?: Dimensions;
}
