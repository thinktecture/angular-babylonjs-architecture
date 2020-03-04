import {Fillable} from './fill-slot.interface';
import {Color4} from '@babylonjs/core';


export interface Activatable {
    active: boolean;
    activate: (active: boolean) => {};
}

export function isActivatable(toTest: any): toTest is Activatable {
    return !!toTest.activate;
}

export function activateBehavior(gameObject: Fillable & Activatable, active: boolean) {
    if (!gameObject.meshes) {
        return;
    }

    if (active) {
        gameObject.meshes.forEach(m => {
            if (m.edgesRenderer) {
                m.edgesRenderer.dispose();
            }
            m.edgesColor = new Color4(0, 0, 1, 1);
            m.edgesWidth = 10;
            m.enableEdgesRendering(.9999);
        });
        gameObject.active = true;
    } else {
        gameObject.meshes.forEach(m => m.disableEdgesRendering());
        gameObject.active = false;
    }
}
