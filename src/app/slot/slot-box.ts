import {Injectable} from '@angular/core';
import {BoxBuilder, Mesh, MeshBuilder, Vector3} from '@babylonjs/core';
import {LightService} from '../services/light.service';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene-context.service';
import {SlotFactory} from '../services/slot-factory.service';
import {Dimensions, SlotTransformNode, SlotType} from './slot-transform';


export interface Lightable {
    addLight();
}

export interface DecalSlot {
    decal: Mesh;
    dimensions: Dimensions;
    meshes: Mesh[];
    name: string;
    removeDecal: () => void;
    addDecal(parent: DecalSlot);
}

export function decalSlotBehavior(parent: DecalSlot) {
    if (!parent.decal) {
        parent.decal = Mesh.CreateDecal(
            parent.name + 'decal',
            parent.meshes[0],
            parent.meshes[0].getAbsolutePosition().add(new Vector3(parent.dimensions.width / 2 + 0.01, 0, parent.dimensions.depth / 4)),
            new Vector3(1, 0, 0),
            new Vector3(3, 3, 3),
            0);
        parent.decal.material = this.materialService.getDecalMaterial();
        // this.decal.parent = this;
    }
}
export function removeDecalSlotBehavior(parent: SlotBox) {
  parent.decal.dispose();
  parent.decal = undefined;
}

export interface ContainerSlot {
    fillSlot(meshes: SlotTransformNode);
}

export function fillSlotBehavior(parent: SlotBox) {
    if (parent.meshes.length) {
        parent.meshes.forEach(m => m.dispose());
        parent.meshes.length = 0;
    }

    const box = BoxBuilder.CreateBox(parent.name + 'Mesh', { ...parent.dimensions }, parent.sceneContext.scene);
    box.parent = this;
    box.material = parent.materialService.getBoxMaterial(Math.random() > .5);
    parent.lightService.addShadowCaster(box);
    parent.meshes.push(box);
}



@Injectable()
export class SlotBox extends SlotTransformNode implements DecalSlot, Lightable, ContainerSlot {

    decal: Mesh;
    readonly meshes: Mesh[] = [];

    fillSlot = fillSlotBehavior;
    addDecal = decalSlotBehavior;
    removeDecal = () => removeDecalSlotBehavior(this);


    constructor(
        sceneContext: SceneContext,
        slotFactory: SlotFactory,
        public readonly lightService: LightService,
        public readonly materialService: MaterialService,
        parent: SlotTransformNode,
    ) {
        super(sceneContext, slotFactory);
        this.parent = parent;
    }

    init(dimensions: Dimensions, name: string, type: SlotType) {
        this.dimensions = dimensions;
        this.name = name;
        this.slotType = type;
        this.position = this.dimensions.position;
        this.fillSlot(this);
    }

    addLight() {
        const light = MeshBuilder.CreateBox(this.name + 'Light1', { ...this.dimensions, height: .2, width: .2 });
        light.position.y = this.dimensions.height / 2 - 0.5;
        light.position.x = this.dimensions.width / 2 + 0.5;
        light.material = this.materialService.getBoxLightMaterial();
        light.parent = this;

        const light2 = light.clone(this.name + 'light2');
        light2.position.x = light.position.x * -1;
    }
}
