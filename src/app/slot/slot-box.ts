import {Injectable, Optional} from '@angular/core';
import {BoxBuilder, Mesh} from '@babylonjs/core';
import {SceneContext} from '../services/scene-context.service';
import {SlotFactory} from '../services/slot-factory.service';
import {Dimensions, SlotTransformNode, SlotType} from './slot-transform';

@Injectable()
export class SlotBox extends SlotTransformNode {

    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly meshes: Mesh[] = [];

    constructor(
        private readonly sceneContext: SceneContext,
        private readonly slotFactory: SlotFactory,
        dimensions: Dimensions,
        name: string,
        private readonly slotType: SlotType,
    ) {
        super(name, sceneContext.scene);
        this.dimensions = dimensions;
    }

    init() {
        console.log('INIT SLOT', this.slotType, SlotType.Box);
        if (this.slotType === SlotType.Box) {
            const box = BoxBuilder.CreateBox(this.name + 'Mesh', { ...this.dimensions }, this.sceneContext.scene);
            box.parent = this;
            this.meshes.push(box);
        }
    }
}
