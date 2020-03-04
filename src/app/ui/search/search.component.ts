import {AfterContentChecked, Component, OnDestroy} from '@angular/core';
import {Material} from '@babylonjs/core';
import {CameraContext} from '../../services/camera.context';
import {MaterialService} from '../../services/material.service';
import {SearchContext} from '../../services/search.context';
import {SceneContext} from '../../services/scene.context';
import {BoxGameObject} from '../../game-objects/box.game-object';
import {filter, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterContentChecked, OnDestroy {

    options$ = new BehaviorSubject<string[]>([]);
    private destroy = new Subject<boolean>();

    constructor(private readonly scene: SceneContext,
                private readonly materialService: MaterialService,
                private readonly camera: CameraContext,
                public readonly searchContext: SearchContext,
    ) {
    }

    ngAfterContentChecked() {
        this.scene.sceneCreated$.pipe(takeUntil(this.destroy), filter(x => !!x))
            .subscribe(scene => scene.onNewTransformNodeAddedObservable.add(() => {
                this.options$.next(this.scene.scene.transformNodes.filter(node => node instanceof BoxGameObject).map((box: BoxGameObject) => box.information));
            }));
    }

    ngOnDestroy() {
        this.destroy.next(true);
    }

    clear(all = true) {
        if (all) {
            this.materialService.activateBoxMaterials();
        }
        this.searchContext.clear(all);
    }

    goto() {
        this.searchContext.goto();
    }

    search(term: string) {
        if (!term || !term.length) {
            return;
        }
        this.clear(false);
        const gameObject = this.searchContext.findGameObject(term, BoxGameObject);
        this.camera.displayMiniMap(this.scene.scene, gameObject.position);
    }

}
