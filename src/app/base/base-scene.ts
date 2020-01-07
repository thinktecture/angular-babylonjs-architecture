import {Engine, FreeCamera, MeshBuilder, Scene, SceneOptions, Vector3} from '@babylonjs/core';
import {LightService} from '../services/light.service';

const scaleUnit = 10;

export class BaseScene extends Scene {
    constructor(engine: Engine,
                private canvas: HTMLCanvasElement,
                private readonly lightService: LightService,
                options?: SceneOptions) {
        super(engine, options);
        this.addDefaults();
    }

    private addDefaults() {
        const camera = new FreeCamera('camera1', new Vector3(0, 1.5, -10).scale(scaleUnit), this);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this.canvas, true);

        this.lightService.addPointLights(this);
        this.lightService.addHemisphericLight(this);
    }
}
