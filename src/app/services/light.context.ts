import {Injectable} from '@angular/core';
import {HemisphericLight, Mesh, PointLight, Scene, ShadowGenerator, Vector3} from '@babylonjs/core';
import {SCALE} from '../constants';
import {SceneContext} from './scene.context';

@Injectable({
    providedIn: 'root',
})
export class LightContext {

    // noinspection JSMismatchedCollectionQueryUpdate
    readonly shadowGen: ShadowGenerator[] = [];

    get pointLights(): PointLight[] {
        return this.pointLightsRefs.map(name => this.scene.scene.getLightByName(name)) as PointLight[];
    }

    private pointLightsRefs: string[] = [];
    private readonly PLAYER_LIGHT: string = 'playerLight';
    private readonly numberOfPointLights = 3;
    private readonly startPositionPointLights = new Vector3(0, 0, -20);

    constructor(private readonly scene: SceneContext) {
    }

    addHemisphericLight(scene: Scene) {
        const light = new HemisphericLight('HemisphereLight', new Vector3(1, 2, 1.5).scale(SCALE), scene);
        light.intensity = 0.6;
    }

    addPointLights() {
        for (let i = 0; this.pointLightsRefs.length < this.numberOfPointLights || i < this.numberOfPointLights; i++) {
            const lightPos = this.startPositionPointLights.add(new Vector3(0, 1, i * 3).scale(SCALE));
            const light = new PointLight('PointLight' + i, lightPos, this.scene.scene);
            light.intensity = 0.45;
            light.range = 6 * SCALE;
            this.pointLightsRefs.push(light.name);
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

    updatePlayerLight(position: Vector3, enable: boolean) {
        let light = this.scene.scene.getLightByName(this.PLAYER_LIGHT) as PointLight;
        if (enable) {
            if (!light) {
                light = new PointLight(this.PLAYER_LIGHT, position, this.scene.scene);
                light.intensity = 1;
                light.range = 4 * SCALE;
            }
            light.position = position;
        } else {
            if (light) {
                light.dispose();
                light = undefined;
            }
        }
    }
}
