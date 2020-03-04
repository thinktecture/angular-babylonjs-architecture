import {Vector3} from '@babylonjs/core';
import {BoxGameObject} from './box.game-object';
import {TransformNodeGameObject} from './transform-node.game-object';
import {GameObjectContainerStack, gameObjectContainerBehavior} from '../interfaces/container-strack.interface';
import {GameObjectDecorator} from '../base/game-object.decorator';
import {Dimensions} from '../base/dimensions.model';
import {GameObjectType} from '../base/game-object-type.model';


@GameObjectDecorator()
export class ContainerGameObject extends TransformNodeGameObject implements GameObjectContainerStack {

    init(dimensions: Dimensions, name: string, gameObjectType: GameObjectType) {
        this.dimensions = dimensions;
        this.position = this.dimensions.position;
        this.name = name;
        this.gameObjectType = gameObjectType;

        if (this.gameObjectType === GameObjectType.Random) {
            const typeNum = Math.floor(Math.random() * 2);
            switch (typeNum) {
                case 0:
                    this.gameObjectType = GameObjectType.Box;
                    break;
                case 1:
                    this.gameObjectType = GameObjectType.Stack;
                    break;
            }
        }

        switch (this.gameObjectType) {
            case GameObjectType.Box:
                this.gameObjectFactory.create(
                    BoxGameObject,
                    {...this.dimensions, position: Vector3.Zero()},
                    this.name + 'Box', GameObjectType.Box, this,
                ).addLight();
                break;
            case GameObjectType.Stack:
                this.createStack();
                break;
        }
    }

    createStack() {
        return gameObjectContainerBehavior(this);
    }
}
