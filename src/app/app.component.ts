import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Vector3} from '@babylonjs/core';
import {Bulb} from './base/bulb';
import {Ground} from './base/ground';
import {SCALE} from './constants';
import {EngineContext} from './services/engine.context';
import {LightContext} from './services/light.context';
import {SceneContext} from './services/scene.context';
import {SlotFactory} from './services/slot.factory';
import {ContainerSlot} from './slots/container.slot';
import {CameraContext} from './services/camera.context';
import {SlotType} from './base/slot-type.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    title = 'Angular & BabylonJs Architecture example';

    @ViewChild('rCanvas', {static: true})
    canvasRef: ElementRef<HTMLCanvasElement>;
    /*
    * Inject a reference to the HTML-Cavnas
    * */


    started = false;
    orientationCam: boolean;
    private readonly numberOfBoxes = 5;
    private readonly colsOfBoxes = 6;
    private readonly rowsOfBoxes = 4;

    constructor(
        private readonly engine: EngineContext,
        private readonly scene: SceneContext,
        private readonly camera: CameraContext,
        private readonly slotFactory: SlotFactory,
        private readonly lightService: LightContext,
    ) {
    }

    start() {
        this.started = true;

        if (!this['canvasRef']) {
            return;
        }

        const scene = this.scene.createMyScene(this['canvasRef']);
        this.lightService.addPointLights();

        // link a light to the players position
        this.lightService.updatePlayerLight(
            this.camera.mainCamera.position,
            true,
        );

        // create floor
        this.slotFactory.create(
            Ground,
            {width: 100 * SCALE, height: 50 * SCALE},
            'Ground',
            SlotType.Ground,
        );

        // create boxes
        this.createBoxes();

        // add some mesh to represent lights
        this.lightService.pointLights.forEach(light =>
            this.slotFactory.create(
                Bulb,
                {
                    height: 1.5,
                    width: 3,
                    position: light.position,
                },
                'bulb' + light.name,
            ),
        );

        // start
        this.scene.startMyScene();
    }

    private createBoxes() {
        const dim = {
            height: 10,
            width: 10,
            depth: 10,
            position: new Vector3(0, 5, 0),
        };

        for (let r = 0; r < this.rowsOfBoxes; r++) {
            for (let c = 0; c < this.colsOfBoxes; c++) {
                for (let n = 0; n < this.numberOfBoxes; n++) {
                    let x = c % 2 === 0 ? -2 : 2;
                    x *= x < 0 ? c + 1 : c;

                    const boxDim = {
                        ...dim,
                        position: new Vector3(x, r * 2.2 + 1, n * 3).scale(5),
                    };
                    let box = this.slotFactory.create(
                        ContainerSlot,
                        boxDim,
                        'Container' + '-' + r + c + n,
                        SlotType.Random,
                    );
                }
            }
        }
    }

    debug() {
        this.scene.displayDebugLayer();
    }

    ngOnDestroy(): void {
        this.scene.dispose();
        this.engine.stop();
    }

    requestTouch() {
        this.orientationCam = !this.scene.enableOrientationCamera(false, this.canvasRef);
    }

    // checks must be as "near" as possible at the event source
    requestOrientation() {
        if (this.orientationCam) {
            return this.requestTouch();
        }
        // @ts-ignore
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            // @ts-ignore
            DeviceMotionEvent.requestPermission().then(() => alert('motion granted'))
                .catch(console.error);
        }

        // @ts-ignore
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // @ts-ignore
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        alert('orientation granted');
                        this.orientationCam = this.scene.enableOrientationCamera(true, this.canvasRef);
                    }
                })
                .catch(console.error);
        } else {
            alert('Device does not support motion input');
        }
    }
}
