import {Injectable} from '@angular/core';
import {Color3, Color4, MeshBuilder, Vector3} from '@babylonjs/core';
import {SCALE} from '../constants';
import {LightContext} from '../services/light.context';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene.context';
import {GameObjectFactory} from '../services/game-object.factory';
import {TransformNodeGameObject} from '../game-objects/transform-node.game-object';
import {Dimensions} from './dimensions.model';
import {GameObjectType} from './game-object-type.model';

@Injectable({
    providedIn: 'root',
})
export class Bulb extends TransformNodeGameObject {

    constructor(
        sceneContext: SceneContext,
        gameObjectFactory: GameObjectFactory,
        private readonly lightService: LightContext,
        private readonly materialService: MaterialService,
        parent?: TransformNodeGameObject,
    ) {
        super(sceneContext, gameObjectFactory);
    }

    init(dimensions: Dimensions, name: string, type: GameObjectType) {
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

        bulb.material = this.materialService.getBulbTexture();
        bulb.parent = this;
        cone.position.y += 0.7;

        const line = MeshBuilder.CreateLines(this.name + 'Line', {
            points: [Vector3.Zero(), Vector3.Up().scale(SCALE * SCALE)],
            colors: [Color4.FromColor3(Color3.Gray()), Color4.FromColor3(Color3.Gray())],
        });
        line.parent = this;
    }
}
