import {ElementRef, Injectable} from '@angular/core';
import '@babylonjs/inspector';
import {BaseScene} from '../base/base-scene';
import {EngineContext} from './engine-context.service';
import {LightService} from './light.service';


@Injectable({
    providedIn: 'root',
})
export class SceneContext {

    scene: BaseScene;

    constructor(private engineCtx: EngineContext, private readonly lightService: LightService) {
    }

    createMyScene(canvas: ElementRef<HTMLCanvasElement>) {
        this.engineCtx.canvas = canvas;
        this.scene = new BaseScene(this.engineCtx.engine, canvas.nativeElement, this.lightService);
        this.scene.debugLayer.show({ overlay: true, embedMode: true });
    }

    startMyScene() {
        this.engineCtx.start(this.scene);
    }
}
