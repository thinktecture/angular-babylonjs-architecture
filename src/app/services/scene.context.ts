import {ElementRef, Injectable} from '@angular/core';
import {Color3, Color4, Scene, SSAORenderingPipeline} from '@babylonjs/core';
import '@babylonjs/inspector';
import {CameraContext} from './camera.context';
import {EngineContext} from './engine.context';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SceneContext {
    scene: Scene;
    sceneCreated$ = new BehaviorSubject<Scene>(null);

    constructor(
        private engineCtx: EngineContext,
        private readonly camera: CameraContext,
    ) {
    }

    createMyScene(canvas: ElementRef<HTMLCanvasElement>): Scene {
        this.engineCtx.canvas = canvas;
        this.scene = new Scene(this.engineCtx.engine);
        this.sceneCreated$.next(this.scene);

        this.camera.setup(this.scene, canvas.nativeElement);
        const ssao = new SSAORenderingPipeline(
            'ssaoPipeline',
            this.scene,
            0.75,
            [this.camera.mainCamera],
        );

        this.scene.clearColor = Color4.FromColor3(new Color3(0, 0, 0));

        // Prevent scrolling when touching the canvas
        this.disableCanvasEvents(canvas);

        return this.scene;
    }

    startMyScene() {
        this.engineCtx.start(this.scene);
    }

    enableOrientationCamera(enable: boolean, canvas: ElementRef<HTMLCanvasElement>) {
        if (!enable) {
            this.camera.resetActiveCamera(this.scene, canvas.nativeElement);
        } else {
            this.camera.useOrientationCamera();
        }

        return true;
    }

    displayDebugLayer() {
        if (!this.scene.debugLayer.isVisible()) {
            this.scene.debugLayer.show({overlay: true, embedMode: true});
        } else {
            this.scene.debugLayer.hide();
        }
    }

    dispose() {
        this.scene.dispose();
        this.scene = null;
    }

    private disableCanvasEvents(canvas: ElementRef<HTMLCanvasElement>) {
        document.body.addEventListener('touchstart', e => this.preventDefault(e, canvas), {passive: false});
        document.body.addEventListener('touchend', e => this.preventDefault(e, canvas), {passive: false});
        document.body.addEventListener('touchmove', e => this.preventDefault(e, canvas), {passive: false});
    }

    private preventDefault(e: Event, ref: ElementRef) {
        if (e.target === ref.nativeElement) {
            e.preventDefault();
        }
    }
}
