import {Injectable, Type} from '@angular/core';
import {CameraContext} from './camera.context';
import {SceneContext} from './scene.context';
import {LightContext} from './light.context';
import {TransformNodeGameObject} from '../game-objects/transform-node.game-object';
import {isDecalGameObject} from '../interfaces/decal.interface';
import {isActivatable} from '../interfaces/activatable.interface';
import {Material} from '@babylonjs/core';
import {MaterialService} from './material.service';
import {isPickable} from '../interfaces/pickable.interface';

@Injectable({providedIn: 'root'})
export class SearchContext {
    activeGameObject: TransformNodeGameObject;
    showAR = false;

    private inactiveMaterial: Material;

    constructor(
        private readonly camera: CameraContext,
        private readonly scene: SceneContext,
        private readonly light: LightContext,
        private readonly materialService: MaterialService,
    ) {
    }

    clear(all = true) {
        if (this.activeGameObject && isActivatable(this.activeGameObject)) {
            this.activeGameObject.activate(false);
            if (isDecalGameObject(this.activeGameObject)) {
                this.activeGameObject.removeDecal();
            }
            this.activeGameObject = undefined;
        }
        if (all) {
            this.camera.hideMiniMap();
            this.camera.resetMainCamera();
            this.materialService.activateBoxMaterials();
        }

        if (this.activeGameObject && isPickable(this.activeGameObject)) {
            this.activeGameObject.enablePick(false);
        }

        this.light.updatePlayerLight(this.camera.mainCamera.position, true);
        this.showAR = false;
    }

    findGameObject<T extends TransformNodeGameObject>(term: string, searchedType: Type<T>): T {
        this.clear(false);
        /*
        * Find the object that represents our desired object.
        * Get all Nodes / Objects from the scene and filter them by some properties.
        * 1. Type of Node we are looking for
        * 2. Is it activatable at all ?
        * 3. Does it store information ?
        * Inspect each filtered node for the information, and store the found slot for later.
        */
        this.activeGameObject = this.scene.scene.transformNodes
            .filter(node => node instanceof searchedType)
            .find((node: T) => node.information === term) as T;

        if (isActivatable(this.activeGameObject)) {
            this.activeGameObject.activate(true);
        }

        /*
        * check if the Node has custom functionality that could be enabled
        * Is it possible to add a decal to the Node ?
        */
        if (isDecalGameObject(this.activeGameObject)) {
            this.activeGameObject.addDecal(this.activeGameObject);
        }
        if (isPickable(this.activeGameObject)) {
            this.activeGameObject.enablePick(true);
        }

        /*
        * "disable" all other Nodes by modifying the underlying material+
        * and set the material of the active node to "active"
        */
        this.materialService.deactivateBoxMaterials();
        this.activeGameObject.getChildMeshes(true).forEach(mesh => {
            this.inactiveMaterial = mesh.material;
            mesh.material = this.materialService.getBoxActiveMaterial(mesh.material);
        });

        return this.activeGameObject as T;
    }

    goto() {
        if (this.activeGameObject) {
            this.camera.moveCameraAndLookAt(this.activeGameObject.getAbsolutePosition());
            this.light.updatePlayerLight(this.camera.mainCamera.position, true);
            this.showAR = true;
        }
    }
}
