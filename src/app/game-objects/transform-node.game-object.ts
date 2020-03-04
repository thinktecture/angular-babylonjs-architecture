import {TransformNode} from '@babylonjs/core';
import {SceneContext} from '../services/scene.context';
import {GameObjectFactory} from '../services/game-object.factory';
import {Dimensions} from '../base/dimensions.model';
import {GameObjectType} from '../base/game-object-type.model';

export abstract class TransformNodeGameObject extends TransformNode {
    dimensions: Dimensions;
    public information: string;
    protected gameObjectType: GameObjectType;

    constructor(readonly sceneContext: SceneContext,
                readonly gameObjectFactory: GameObjectFactory,
                parent?: TransformNode) {
        super(Math.floor(Math.random() * 10000) + '', sceneContext.scene);
        this.parent = parent;
    }

    abstract init(dimensions: Dimensions, name: string, type: GameObjectType);
}



