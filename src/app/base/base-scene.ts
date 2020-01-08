import {Engine, Scene, SceneOptions} from '@babylonjs/core';
import {LightService} from '../services/light.service';

const scaleUnit = 10;

export class BaseScene extends Scene {
    constructor(engine: Engine,
                private canvas: HTMLCanvasElement,
                private readonly lightService: LightService,
                options?: SceneOptions) {
        super(engine, options);
    }
}
