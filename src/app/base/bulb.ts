import {Injectable} from '@angular/core';
import {Color3, Color4, Light, Mesh, MeshBuilder, Vector3} from '@babylonjs/core';
import {SCALE} from '../constants';
import {LightService} from '../services/light.service';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene-context.service';
import {SlotFactory} from '../services/slot-factory.service';
import {Dimensions, SlotTransformNode, SlotType} from '../slot/slot-transform';

@Injectable({
    providedIn: 'root',
})
export class Bulb extends SlotTransformNode {

    constructor(
        sceneContext: SceneContext,
        slotFactory: SlotFactory,
        private readonly lightService: LightService,
        private readonly materialService: MaterialService,
        parent?: SlotTransformNode,
    ) {
        super(sceneContext, slotFactory);
    }

    init(dimensions: Dimensions, name: string, type: SlotType) {
        this.name = name;
        this.position = dimensions.position;

        const cone = MeshBuilder.CreateCylinder('cone', {
            height: dimensions.height,
            diameterBottom: dimensions.width,
            diameterTop: 0,
            tessellation: 10,
        }, this.sceneContext.scene);
        cone.parent = this;

        const bulb = MeshBuilder.CreateSphere('bulb', {
            diameter: .7,
            segments: 5,
        }, this.sceneContext.scene);
        ;
        bulb.material = this.materialService.getBulbTexture();
        bulb.parent = this;
        cone.position.y += 0.7;

        MeshBuilder.CreateLines(this.name + 'Line', {
            points: [this.position, this.position.add(new Vector3(0, 5, 0).scale(SCALE))],
            colors: [Color4.FromColor3(Color3.Gray()), Color4.FromColor3(Color3.Gray())],
        });
    }
}
