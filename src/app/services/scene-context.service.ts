import {ElementRef, Injectable} from '@angular/core';
import {Color3, Color4, Scene, SSAORenderingPipeline} from '@babylonjs/core';
import '@babylonjs/inspector';
import {CameraService} from './camera.service';
import {EngineContext} from './engine-context.service';
import {LightService} from './light.service';


@Injectable({
    providedIn: 'root',
})
export class SceneContext {

    scene: Scene;

    constructor(
        private engineCtx: EngineContext,
        private readonly lightService: LightService,
        private readonly camera: CameraService,
    ) {}

    createMyScene(canvas: ElementRef<HTMLCanvasElement>) {
        this.engineCtx.canvas = canvas;
        this.scene = new Scene(this.engineCtx.engine);


        this.camera.setup(this.scene, canvas.nativeElement);
        const ssao = new SSAORenderingPipeline('ssaoPipeline', this.scene, .75, [this.camera.mainCamera]);

        this.scene.clearColor = Color4.FromColor3(new Color3(0, 0, 0));
        this.lightService.addPointLights(this.scene);

        // this.lightService.addHemisphericLight(this.scene);
        this.scene.debugLayer.show({ overlay: true, embedMode: true });
        this.lightService.toggleHighlight(this.camera.mainCamera.position, true, this.scene);


        // // uncomment to enable VR
        // let vrHelper = this.scene.createDefaultVRExperience({ createDeviceOrientationCamera: false });
        // vrHelper.onAfterEnteringVRObservable.add(() => {
        //     if (this.scene.activeCamera === vrHelper.vrDeviceOrientationCamera) {
        //         FreeCameraDeviceOrientationInput.WaitForOrientationChangeAsync(1000).then(() => {
        //             // Successfully received sensor input
        //         }).catch(() => {
        //             alert('Device orientation camera is being used but no sensor is found, prompt user to enable in safari settings');
        //         });
        //     }
        // });

        // Prevent scrolling when touching the canvas
        document.body.addEventListener('touchstart',
            (e) => this.preventDefault(e, canvas),
            { passive: false });
        document.body.addEventListener('touchend',
            (e) => this.preventDefault(e, canvas),
            { passive: false });
        document.body.addEventListener('touchmove',
            (e) => this.preventDefault(e, canvas),
            { passive: false });
    }

    startMyScene() {
        this.engineCtx.start(this.scene);
    }

    private preventDefault(e: Event, ref: ElementRef) {
        if (e.target === ref.nativeElement) {
            e.preventDefault();
        }
    }
}
