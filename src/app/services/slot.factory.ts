import {FactorySansProvider, Inject, Injectable, InjectionToken, Injector, Type, ValueProvider} from '@angular/core';
import {TransformNode} from '@babylonjs/core';
import {SlotTransformNode} from '../slots/transform-node.slot';
import {SceneContext} from './scene.context';
import {Dimensions} from "../base/dimensions.model";
import {SlotType} from "../base/slot-type.model";


interface ResolvedFactory<T> {
    ctor: new(...deps: any[]) => T;
    resolvedDependencies: any[];
}

interface FactoryProvider<T = any> extends FactorySansProvider {
    provide: T;
    useFactory: (deps: any[]) => ResolvedFactory<T>;
}


const FACTORY_PROVIDER_TOKEN = new InjectionToken<FactoryProvider>('factory-provider');

export function provideSlot<T extends SlotTransformNode>(slotNode: Type<T>, deps: any[] = []): ValueProvider {
    return {
        provide: FACTORY_PROVIDER_TOKEN,
        multi: true,
        useValue: {
            provide: slotNode,
            useFactory: (...dependencies: any[]): ResolvedFactory<T> => {
                return {
                    ctor: slotNode,
                    resolvedDependencies: dependencies,
                };
            },
            deps: [
                SceneContext,
                SlotFactory,
                ...deps,
            ],
        } as FactoryProvider,
    };
}

@Injectable({providedIn: 'root'})
export class SlotFactory {
    readonly injector: Injector;

    constructor(
        injector: Injector,
        @Inject(FACTORY_PROVIDER_TOKEN) factories: FactoryProvider[],
    ) {
        this.injector = Injector.create({
            parent: injector,
            name: 'SlotInjector',
            providers: [
                ...factories,
            ],
        });
    }

    create<TSlot extends SlotTransformNode>(
        slot: Type<TSlot>,
        dimensions: Dimensions,
        name: string,
        slotType?: SlotType,
        parent?: TransformNode,
    ) {
        return this.resolveAndInitialize(slot, dimensions, name, slotType, parent);
    }

    private resolveAndInitialize<T extends SlotTransformNode>(type: Type<T>, dim: Dimensions, name: string, slotType?: SlotType, parent?: TransformNode): T {

        const resolvedFactory: ResolvedFactory<T> = this.injector.get(type as any);

        const slot = new resolvedFactory.ctor(...resolvedFactory.resolvedDependencies, parent);
        slot.init(dim, name, slotType);
        return slot;

    }

}
