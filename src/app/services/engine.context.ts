import {ElementRef, Injectable, NgZone} from '@angular/core';
import {Engine, Scene} from '@babylonjs/core';

@Injectable({
    providedIn: 'root',
})
export class EngineContext {

    canvas: ElementRef<HTMLCanvasElement>;

    constructor(private readonly ngZone: NgZone) {
    }

    // tslint:disable-next-line:variable-name
    private _engine: Engine;
    get engine(): Engine {
        if (!this._engine) {
            this._engine = new Engine(this.canvas.nativeElement);
        }
        return this._engine;
    }


    start(scene: Scene) {
        this._engine.stopRenderLoop();
        this.ngZone.runOutsideAngular(() => this._engine.runRenderLoop(() => scene.render()));
        this.ngZone.runOutsideAngular(() => window.addEventListener('resize', () => this._engine.resize()));
    }

    stop() {
        this._engine.stopRenderLoop();
        this._engine.dispose();
        window.removeEventListener('resize', () => {
        });
    }
}
