import {Injectable} from '@angular/core';
import {HemisphericLight, Mesh, PointLight, Scene, ShadowGenerator, Vector3} from '@babylonjs/core';
import {SCALE} from '../constants';

@Injectable({
    providedIn: 'root',
})
export class LightService {

    // noinspection JSMismatchedCollectionQueryUpdate
    readonly shadowGen: ShadowGenerator[] = [];
    // noinspection JSMismatchedCollectionQueryUpdate
    readonly pointLights: PointLight[] = [];
    private highLight: PointLight;
    private readonly numberOfPointLights = 3;
    private readonly startPositionPointLights = new Vector3(0, 0, -20);

    addHemisphericLight(scene: Scene) {
        const light = new HemisphericLight('HemisphereLight', new Vector3(1, 2, 1.5).scale(SCALE), scene);
        light.intensity = 0.6;
    }

    addPointLights(scene: Scene) {
        for (let i = 0; i < this.numberOfPointLights; i++) {

            const lightPos = this.startPositionPointLights.add(new Vector3(0, 1, i * 3).scale(SCALE));
            const light = new PointLight('PointLight' + i, lightPos, scene);
            light.intensity = 0.45;
            light.range = 6 * SCALE;
            this.pointLights.push(light);
            const shadowGen = new ShadowGenerator(1024, light);
            this.shadowGen.push(shadowGen);
            shadowGen.usePoissonSampling = true;
            shadowGen.useContactHardeningShadow = true;
            shadowGen.filteringQuality = ShadowGenerator.QUALITY_LOW;
        }
    }

    addShadowCaster(mesh: Mesh, descendents?: boolean) {
        this.shadowGen.filter(s => {
            const distance = s.getLight().getAbsolutePosition().subtract(mesh.getAbsolutePosition()).length();
            return distance < s.getLight().range;
        }).forEach(s => s.addShadowCaster(mesh, descendents));
    }

    toggleHighlight(position: Vector3, enable: boolean, scene: Scene) {
        if (enable) {
            if (!this.highLight) {
                this.highLight = new PointLight('highlight', position, scene);
                this.highLight.intensity = 1;
                this.highLight.range = 4 * SCALE;
            }
            this.highLight.position = position;
        } else {
            if (this.highLight) {
                this.highLight.dispose();
                this.highLight = undefined;
            }
        }
    }
}
