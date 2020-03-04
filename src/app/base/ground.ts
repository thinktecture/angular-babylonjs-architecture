import {Mesh, MeshBuilder, Vector3} from '@babylonjs/core';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene.context';
import {GameObjectFactory} from '../services/game-object.factory';
import {TransformNodeGameObject} from '../game-objects/transform-node.game-object';
import {SCALE} from '../constants';
import {DecalGameObject, removeDecalBehavior} from '../interfaces/decal.interface';
import {GameObjectDecorator} from './game-object.decorator';
import {Dimensions} from './dimensions.model';
import {GameObjectType} from './game-object-type.model';

@GameObjectDecorator()
export class Ground extends TransformNodeGameObject implements DecalGameObject {
    decal: Mesh;
    mesh: Mesh;

    constructor(
        scene: SceneContext,
        factory: GameObjectFactory,
        private readonly materialService: MaterialService,
    ) {
        super(scene, factory);
    }

    init(dimensions: Dimensions, name: string, type: GameObjectType) {
        this.mesh = MeshBuilder.CreateGround(
            'ground',
            {width: dimensions.width, height: dimensions.height},
            this.sceneContext.scene,
        );
        this.mesh.receiveShadows = true;
        this.mesh.material = this.materialService.getGroundMaterial();
        this.addDecal();
    }

    removeDecal = () => removeDecalBehavior(this);

    addDecal() {
        if (!this.decal) {
            this.decal = Mesh.CreateDecal(
                this.name + 'decal',
                this.mesh,
                this.mesh
                    .getAbsolutePosition()
                    .add(Vector3.Backward().scale(3 * SCALE)),
                new Vector3(0, 1, 0),
                new Vector3(10, 10, 10),
                0,
            );
            this.decal.rotate(new Vector3(0, 0, 1), -1.57);
            this.decal.material = this.materialService.getGroundDecal();
            this.decal.parent = this;
        }
    }
}
