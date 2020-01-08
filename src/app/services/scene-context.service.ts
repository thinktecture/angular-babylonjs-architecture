import {ElementRef, Injectable} from '@angular/core';
import {Scene} from '@babylonjs/core';
import '@babylonjs/inspector';
import {CameraService} from './camera.service';
import {EngineContext} from './engine-context.service';
import {LightService} from './light.service';


@Injectable({
    providedIn: 'root',
})
export class SceneContext {

    scene: Scene;

    constructor(private engineCtx: EngineContext, private readonly lightService: LightService, private readonly camera: CameraService) {
    }

    createMyScene(canvas: ElementRef<HTMLCanvasElement>) {
        this.engineCtx.canvas = canvas;
        this.scene = new Scene(this.engineCtx.engine);
        this.camera.setup(this.scene, canvas.nativeElement);
        this.lightService.addPointLights(this.scene);
        this.lightService.addHemisphericLight(this.scene);
        this.scene.debugLayer.show({ overlay: true, embedMode: true });
    }

    startMyScene() {
        this.engineCtx.start(this.scene);
    }
}
