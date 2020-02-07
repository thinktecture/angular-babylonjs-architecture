import {Injectable} from '@angular/core';
import {Camera, FreeCamera, Scene, Vector3, Viewport} from '@babylonjs/core';
import {SCALE} from '../constants';

@Injectable({
    providedIn: 'root',
})
export class CameraContext {
    // tslint:disable-next-line:variable-name
    private _mainCamera: FreeCamera;
    get mainCamera(): FreeCamera {
        return this._mainCamera;
    }

    private miniMap: FreeCamera;
    readonly startPosition = new Vector3(0, 0.55, -5).scale(SCALE);

    displayMiniMap(scene: Scene, target: Vector3) {
        if (!this.miniMap) {
            this.miniMap = new FreeCamera(
                'minimap',
                new Vector3(0, 200, 40),
                scene,
            );
            this.miniMap.mode = Camera.ORTHOGRAPHIC_CAMERA;
            this.miniMap.orthoLeft = -50;
            this.miniMap.orthoRight = 50;
            this.miniMap.orthoTop = 50;
            this.miniMap.orthoBottom = -50;
            this.miniMap.rotation.x = Math.PI / 2;
            this.miniMap.viewport = new Viewport(0.01, 0.01, 0.2, 0.2);
            scene.activeCameras.push(this.miniMap);
            scene.cameraToUseForPointers = this._mainCamera;
        }
    }

    hideMiniMap() {
        if (this.miniMap) {
            this.miniMap.dispose();
            delete this.miniMap;
        }
    }

    moveCameraAndLookAt(pos: Vector3) {
        this._mainCamera.position = pos.add(Vector3.Right().scale(SCALE * 1.8));
        this._mainCamera.setTarget(pos);
    }

    resetActiveCamera(scene: Scene, canvas: HTMLCanvasElement) {
        this.mainCamera.dispose();
        this.setup(scene, canvas);
        scene.setActiveCameraByName(this.mainCamera.name);
    }

    useOrientationCamera() {
        this._mainCamera.inputs.addDeviceOrientation();
    }

    resetMainCamera() {
        this._mainCamera.position = this.startPosition;
        this._mainCamera.setTarget(this.startPosition.add(Vector3.Forward()));
    }

    setup(scene: Scene, canvas: HTMLCanvasElement) {
        this._mainCamera = new FreeCamera('camera1', this.startPosition, scene);
        this.resetMainCamera();
        this._mainCamera.attachControl(canvas, false);
        // this._mainCamera.inputs.addDeviceOrientation();
        scene.activeCameras.push(this._mainCamera);
    }
}
