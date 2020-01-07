import {Injectable} from '@angular/core';
import {BoxBuilder, Mesh} from '@babylonjs/core';
import {LightService} from '../services/light.service';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene-context.service';
import {SlotFactory} from '../services/slot-factory.service';
import {Dimensions, SlotTransformNode, SlotType} from './slot-transform';

@Injectable()
export class SlotBox extends SlotTransformNode {

    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly meshes: Mesh[] = [];

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
            box.material = this.materialService.getBoxMaterial();
            this.lightService.addShadowCaster(box);
            this.meshes.push(box);
        }
    }
}
