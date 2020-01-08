import {Injectable} from '@angular/core';
import {Camera, FreeCamera, Scene, Vector3, Viewport} from '@babylonjs/core';
import {SCALE} from '../constants';

@Injectable({
    providedIn: 'root',
})
export class CameraService {

    mainCamera: FreeCamera;
    miniMap: FreeCamera;

    displayMiniMap(scene: Scene, target: Vector3) {
        if (!this.miniMap) {
            this.miniMap = new FreeCamera('minimap', new Vector3(0, 200, 40), scene);
            this.miniMap.mode = Camera.ORTHOGRAPHIC_CAMERA;
            this.miniMap.orthoLeft = -50;
            this.miniMap.orthoRight = 50;
            this.miniMap.orthoTop = 50;
            this.miniMap.orthoBottom = -50;
            this.miniMap.rotation.x = Math.PI / 2;
            this.miniMap.viewport = new Viewport(0, 0, 0.2, 0.2);
            scene.activeCameras.push(this.miniMap);
            scene.cameraToUseForPointers = this.mainCamera;
        }

    }

    hideMiniMap() {
        if (this.miniMap) {
            this.miniMap.dispose();
            delete this.miniMap;
        }
    }

    setup(scene: Scene, canvas: HTMLCanvasElement) {
        const start = new Vector3(0, .55, -5).scale(SCALE);
        this.mainCamera = new FreeCamera('camera1', start, scene);
        this.mainCamera.setTarget(start.add(Vector3.Forward()));
        this.mainCamera.attachControl(canvas, true);
        scene.activeCameras.push(this.mainCamera);

    }
}
