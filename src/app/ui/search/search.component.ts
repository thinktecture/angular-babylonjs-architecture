import {Component, OnInit} from '@angular/core';
import {Color4} from '@babylonjs/core';
import {CameraService} from '../../services/camera.service';
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

    constructor(private readonly scene: SceneContext, private readonly materialSerivce: MaterialService, private readonly camera: CameraService) { }

    ngOnInit() {
    }

    clear(all = true) {
        if (this.activeSlot) {
            this.activeSlot.getChildMeshes(true).forEach(mesh => {
                mesh.material = this.materialSerivce.getBoxMaterial();
                mesh.disableEdgesRendering();
            });
        }
        if (all) {
            this.materialSerivce.activeBoxMaterial();
            this.camera.hideMiniMap();
        }
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

        this.materialSerivce.deActiveBoxMaterial();
        this.activeSlot.getChildMeshes(true).forEach(mesh => mesh.material = this.materialSerivce.getBoxActiveMaterial());

        this.camera.displayMiniMap(this.scene.scene, this.activeSlot.position);
    }

}
