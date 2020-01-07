import {TransformNode, Vector3} from '@babylonjs/core';

export abstract class SlotTransformNode extends TransformNode {
    protected dimensions: Dimensions;
    abstract init();
}

export enum SlotType {
    Box,
    Stack,
    Column,
    Random,
}

export interface Dimensions {
    height: number;
    width: number;
    depth: number;
    position: Vector3;
}
