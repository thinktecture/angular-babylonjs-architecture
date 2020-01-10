import {Component, OnInit} from '@angular/core';
import {Color4, Material} from '@babylonjs/core';
import {CameraService} from '../../services/camera.service';
import {LightService} from '../../services/light.service';
import {MaterialService} from '../../services/material.service';
import {SceneContext} from '../../services/scene-context.service';
import {SlotBox} from '../../slot/slot-box';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

    activeSlot: SlotBox;
    showVR = false;
    private inactiveMaterial: Material;

    constructor(private readonly scene: SceneContext,
                private readonly materialService: MaterialService,
                private readonly camera: CameraService,
                private readonly light: LightService,
    ) { }

    ngOnInit() {
    }

    clear(all = true) {
        if (this.activeSlot) {
            this.activeSlot.getChildMeshes(true).forEach(mesh => {
                mesh.material = this.materialService.getBoxStandartMaterial(mesh.material);
                mesh.disableEdgesRendering();
            });
            this.activeSlot.removeDecal();
            this.activeSlot = undefined;
        }
        if (all) {
            this.materialService.activateBoxMaterials();
            this.camera.hideMiniMap();
            this.camera.resetMainCamera();
        }
        this.light.toggleHighlight(this.camera.mainCamera.position, true, this.scene.scene);
        this.showVR = false;
    }

    goto() {
        this.camera.moveCameraAndLookAt(this.activeSlot.getAbsolutePosition());
        this.light.toggleHighlight(this.camera.mainCamera.position, true, this.scene.scene);
        this.showVR = true;
    }

    search(term: string) {

        this.clear(false);
        console.log('SEARCH', term);
        const slots = this.scene.scene.transformNodes.filter(node => node instanceof SlotBox);
        const foundIdx = Math.floor(Math.random() * slots.length);
        this.activeSlot = slots[foundIdx] as SlotBox;
        this.activeSlot.getChildMeshes()[0].edgesColor = new Color4(0, 0, 1, 1);
        this.activeSlot.getChildMeshes()[0].edgesWidth = 10;
        this.activeSlot.getChildMeshes()[0].enableEdgesRendering(.9999);

        this.materialService.deactivateBoxMaterials();
        this.activeSlot.getChildMeshes(true).forEach(mesh => {
            this.inactiveMaterial = mesh.material;
            mesh.material = this.materialService.getBoxActiveMaterial(mesh.material);
        });
        this.camera.displayMiniMap(this.scene.scene, this.activeSlot.position);
        this.activeSlot.addDecal();
    }

}
