import {Vector3} from '@babylonjs/core';

export interface Dimensions {
    height: number;
    width: number;
    depth?: number;
    position?: Vector3;
    parentDimensions?: Dimensions;
}
