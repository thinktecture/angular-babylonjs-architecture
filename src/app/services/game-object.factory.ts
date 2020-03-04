import { FactorySansProvider, Inject, Injectable, InjectionToken, Injector, Type, ValueProvider } from '@angular/core';
import { TransformNode } from '@babylonjs/core';
import { TransformNodeGameObject } from '../game-objects/transform-node.game-object';
import { SceneContext } from './scene.context';
import { Dimensions } from '../base/dimensions.model';
import { GameObjectType } from '../base/game-object-type.model';


interface ResolvedFactory<T> {
    ctor: new(...deps: any[]) => T;
    resolvedDependencies: any[];
}

interface FactoryProvider<T = any> extends FactorySansProvider {
    provide: T;
    useFactory: (deps: any[]) => ResolvedFactory<T>;
}


const FACTORY_PROVIDER_TOKEN = new InjectionToken<FactoryProvider>('factory-provider');

export function provideGameObject<T extends TransformNodeGameObject>(gameObject: Type<T>, deps: any[] = []): ValueProvider {
    return {
        provide: FACTORY_PROVIDER_TOKEN,
        multi: true,
        useValue: {
            provide: gameObject,
            useFactory: (...dependencies: any[]): ResolvedFactory<T> => {
                return {
                    ctor: gameObject,
                    resolvedDependencies: dependencies,
                };
            },
            deps: [
                SceneContext,
                GameObjectFactory,
                ...deps,
            ],
        } as FactoryProvider,
    };
}

@Injectable({ providedIn: 'root' })
export class GameObjectFactory {
    readonly injector: Injector;

    constructor(
        injector: Injector,
        @Inject(FACTORY_PROVIDER_TOKEN) factories: FactoryProvider[],
    ) {
        this.injector = Injector.create({
            parent: injector,
            name: 'GameObjectInjector',
            providers: [
                ...factories,
            ],
        });
    }

    create<TGameObject extends TransformNodeGameObject>(
        gameObject: Type<TGameObject>,
        dimensions: Dimensions,
        name: string,
        gameObjectType?: GameObjectType,
        parent?: TransformNode,
    ) {
        return this.resolveAndInitialize(gameObject, dimensions, name, gameObjectType, parent);
    }

    private resolveAndInitialize<T extends TransformNodeGameObject>(type: Type<T>, dim: Dimensions, name: string, gameObjectType?: GameObjectType, parent?: TransformNode): T {

        const resolvedFactory: ResolvedFactory<T> = this.injector.get(type as any);

        const gameObject = new resolvedFactory.ctor(...resolvedFactory.resolvedDependencies, parent);
        gameObject.init(dim, name, gameObjectType);
        return gameObject;

    }

}
