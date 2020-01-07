import { ElementRef, Injectable } from '@angular/core';
import { Engine, Scene } from '@babylonjs/core';

@Injectable({
    providedIn: 'root',
})
export class EngineContext {

    canvas: ElementRef<HTMLCanvasElement>;

    // tslint:disable-next-line:variable-name
    private _engine: Engine;
    get engine(): Engine {
        if (!this._engine) {
            this._engine = new Engine(this.canvas.nativeElement, true);
        }
        return this._engine;
    }


    start(scene: Scene) {
        this._engine.stopRenderLoop();
        this._engine.runRenderLoop(() => scene.render());
    }

    stop() {
        this._engine.stopRenderLoop();
        this._engine.dispose();
    }
}
