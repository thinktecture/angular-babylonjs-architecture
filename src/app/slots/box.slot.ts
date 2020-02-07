import {ActionManager, ExecuteCodeAction, Mesh, MeshBuilder} from '@babylonjs/core';
import {LightContext} from '../services/light.context';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene.context';
import {SlotFactory} from '../services/slot.factory';
import {SlotTransformNode} from './transform-node.slot';
import {SearchContext} from '../services/search.context';
import {DecalSlot, decalSlotBehavior, removeDecalSlotBehavior} from '../interfaces/decal.interface';
import {Fillable, fillSlotBehavior} from '../interfaces/fill-slot.interface';
import {Pickable} from '../interfaces/pickable.interface';
import {SlotableDecorator} from '../base/slotable.decorator';
import {Activatable, activateSlotBehavior} from '../interfaces/activatable.interface';
import {Lightable} from '../interfaces/lightable.interface';
import {Dimensions} from '../base/dimensions.model';
import {SlotType} from '../base/slot-type.model';

@SlotableDecorator()
export class BoxSlot extends SlotTransformNode
    implements DecalSlot, Lightable, Fillable, Pickable, Activatable {
    decal: Mesh;
    readonly meshes: Mesh[] = [];

    fillSlot = fillSlotBehavior;
    addDecal = decalSlotBehavior;
    active = false;

    removeDecal = () => removeDecalSlotBehavior(this);
    activate = (activateSlot: boolean) => activateSlotBehavior(this, activateSlot);

    constructor(
        sceneContext: SceneContext,
        slotFactory: SlotFactory,
        public readonly lightService: LightContext,
        public readonly materialService: MaterialService,
        public readonly searchContext: SearchContext,
        parent: SlotTransformNode,
    ) {
        super(sceneContext, slotFactory);
        this.parent = parent;
        this.information = this.id;
    }

    init(dimensions: Dimensions, name: string, type: SlotType) {
        this.dimensions = dimensions;
        this.name = name;
        this.slotType = type;
        this.position = this.dimensions.position;
        this.fillSlot(this);
        this.registerAction();
        this.enablePick(false);
    }

    // this could be an interface + behavior too (composition)
    private registerAction() {
        /*
        * We want to interact from BabylonJS with Angular. All we have to do: call a function, like always.
        * In this case, we
        * 1. add an ActionManager (event handler) to this Node
        * 2. register the action call back (think of document.registerEvent....
        * 3. call the function **inside** the Angular context
        */
        this.meshes[0].actionManager = new ActionManager(this.sceneContext.scene);
        this.meshes[0].actionManager.registerAction(
            new ExecuteCodeAction({
                trigger: ActionManager.OnPickTrigger,
            }, () => {
                if (this.searchContext.activeSlot === this) {
                    this.searchContext.goto();
                }
            }));
    }

    addLight() {
        const light = MeshBuilder.CreateBox(this.name + 'Light1', {...this.dimensions, height: .2, width: .2});
        light.position.y = this.dimensions.height / 2 - 0.5;
        light.position.x = this.dimensions.width / 2 + 0.5;
        light.material = this.materialService.getBoxLightMaterial();
        light.parent = this;

        const light2 = light.clone(this.name + 'light2');
        light2.position.x = light.position.x * -1;
    }

    enablePick(pickable: boolean) {
        this.meshes[0].isPickable = pickable;
    }
}
