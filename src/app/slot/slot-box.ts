import {Injectable} from '@angular/core';
import {BoxBuilder, Mesh, MeshBuilder, Vector3} from '@babylonjs/core';
import {LightService} from '../services/light.service';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene-context.service';
import {SlotFactory} from '../services/slot-factory.service';
import {Dimensions, SlotTransformNode, SlotType} from './slot-transform';

@Injectable()
export class SlotBox extends SlotTransformNode {

    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly meshes: Mesh[] = [];
    private decal: Mesh;

    constructor(
        sceneContext: SceneContext,
        slotFactory: SlotFactory,
        private readonly lightService: LightService,
        private readonly materialService: MaterialService,
        parent: SlotTransformNode,
    ) {
        super(sceneContext, slotFactory);
        this.parent = parent;
    }

    init(dimensions: Dimensions, name: string, type: SlotType) {
        this.dimensions = dimensions;
        this.name = name;
        this.slotType = type;

        if (this.slotType === SlotType.Box) {
            const box = BoxBuilder.CreateBox(this.name + 'Mesh', { ...this.dimensions }, this.sceneContext.scene);
            box.parent = this;
            box.material = this.materialService.getBoxMaterial(Math.random() > .5);
            this.lightService.addShadowCaster(box);
            this.meshes.push(box);
        }

        const light = MeshBuilder.CreateBox(this.name + 'Light1', { ...this.dimensions, height: .2, width: .2 });
        light.position.y = this.dimensions.height / 2 - 0.5;
        light.position.x = this.dimensions.width / 2 + 0.5;
        light.material = this.materialService.getBoxLightMaterial();
        light.parent = this;

        const light2 = light.clone(this.name + 'light2');
        light2.position.x = light.position.x * -1;
    }

    addDecal() {
        if (!this.decal) {
            this.decal = Mesh.CreateDecal(
                this.name + 'decal',
                this.meshes[0],
                this.meshes[0].getAbsolutePosition().add(new Vector3(this.dimensions.width / 2 + 0.01, 2.5, 2.5)),
                new Vector3(1, 0, 0),
                new Vector3(3, 3, 3),
                0);
            this.decal.material = this.materialService.getDecalMaterial();
            // this.decal.parent = this;
        }
    }

    removeDecal() {
        if (this.decal) {
            this.decal.dispose();
            this.decal = undefined;
        }
    }
}
