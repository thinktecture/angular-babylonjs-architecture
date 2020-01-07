import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Vector3 } from '@babylonjs/core';
import { EngineContext } from './services/engine-context.service';
import { SceneContext } from './services/scene-context.service';
import { SlotFactory } from './services/slot-factory.service';
import {SlotContainer} from './slot/slot';
import {SlotType} from './slot/slot-transform';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
    title = 'babylonjs-architecture';

    @ViewChild('rCanvas', { static: true })
    canvasRef: ElementRef<HTMLCanvasElement>;

    private readonly numberOfBoxes = 5;
    private readonly colsOfBoxes = 2;
    private readonly rowsOfBoxes = 3;


    constructor(private engine: EngineContext, private scene: SceneContext, private readonly slotFactory: SlotFactory) {
    }

    ngAfterViewInit(): void {
        this.scene.createMyScene(this.canvasRef);
        this.createBoxes();
        this.scene.startMyScene();
    }

    createBoxes() {
        const dim = { height: 10, width: 10, depth: 10, position: new Vector3(0, 5, 0) };

        for (let r = 0; r < this.rowsOfBoxes; r++) {
            for (let j = 0; j < this.colsOfBoxes; j++) {
                for (let i = 0; i < this.numberOfBoxes; i++) {
                    const x = j === 0 ? -2 : 2;

                    const boxDim = { ...dim, position: new Vector3(x, r * 2.2 + 1, i * 3).scale(5) };
                    let box = this.slotFactory.create(SlotContainer, boxDim, 'Container' + '-' + r + i + j, SlotType.Random)

                        // this.shadowGen.forEach(s => s.addShadowCaster(box));
                        // box.position = new Vector3(x, 1, i * 3).scale(scaleUnit);
                        // box.material = mat2;
                    ;
                }

            }
        }
    }

    ngOnDestroy(): void {
        this.engine.stop();
    }
}
