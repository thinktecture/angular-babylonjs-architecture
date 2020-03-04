import {Vector3} from '@babylonjs/core';
import {BoxGameObject} from '../game-objects/box.game-object';
import {GameObjectFactory} from '../services/game-object.factory';
import {ContainerGameObject} from '../game-objects/container.game-object';
import {Dimensions} from '../base/dimensions.model';
import {GameObjectType} from '../base/game-object-type.model';

export interface GameObjectContainerStack {
    dimensions: Dimensions;
    gameObjectFactory: GameObjectFactory;
    name: string;

    createStack();
}

export function gameObjectContainerBehavior(parent: ContainerGameObject) {
    const stackDim = {
        ...parent.dimensions,
        height: parent.dimensions.height / 2 - 0.35,
        position: new Vector3(0, -parent.dimensions.height / 2 / 2, 0),
    };
    parent.gameObjectFactory.create(BoxGameObject, stackDim, parent.name + 'stack', GameObjectType.Box, parent);

    parent.gameObjectFactory.create(BoxGameObject, {
        ...parent.dimensions,
        height: parent.dimensions.height / 2,
        position: new Vector3(0, +parent.dimensions.height / 2 / 2, 0),
    }, parent.name + 'stack', GameObjectType.Box, parent).addLight();
}
