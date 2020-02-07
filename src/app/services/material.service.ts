import {Injectable} from '@angular/core';
import {Color3, Material, StandardMaterial, Texture} from '@babylonjs/core';
import {ACTIVE_MATERIAL_PREFIX, MATERIAL_POSTFIX} from '../constants';
import {SceneContext} from './scene.context';

@Injectable({
    providedIn: 'root',
})
export class MaterialService {
    private readonly materials: { [key: string]: StandardMaterial } = {};
    private readonly boxMaterials: { [key: string]: StandardMaterial } = {};
    private readonly boxActiveMaterials: { [key: string]: StandardMaterial } = {};

    constructor(private readonly sceneContext: SceneContext) {
    }

    getBoxMaterial(alternative?: boolean): StandardMaterial {
        if (!alternative) {
            return this.getBaseBox();
        }
        return this.getAlternativeBoxOne();
    }

    deactivateBoxMaterials(): void {
        Object.keys(this.boxMaterials).forEach(
            key => (this.boxMaterials[key].alpha = 0.5),
        );
    }

    activateBoxMaterials(): void {
        Object.keys(this.boxMaterials).forEach(
            key => (this.boxMaterials[key].alpha = 1),
        );
    }

    getBoxActiveMaterial(material: Material): Material {
        const activeName = material.name;
        if (!this.boxActiveMaterials[activeName]) {
            const mat = material.clone(activeName + ACTIVE_MATERIAL_PREFIX);
            mat.alpha = 1;
            this.boxActiveMaterials[activeName] = mat as StandardMaterial;
        }

        return this.boxActiveMaterials[activeName];
    }

    getBoxStandartMaterial(activeMaterial: Material): Material {
        return this.boxMaterials[
            activeMaterial.name.substr(
                0,
                activeMaterial.name.indexOf(
                    MATERIAL_POSTFIX + ACTIVE_MATERIAL_PREFIX,
                ),
            )
            ];
    }

    getGroundMaterial(): Material {
        if (!this.materials.ground) {
            const mat = new StandardMaterial(
                'matGround',
                this.sceneContext.scene,
            );
            // tslint:disable-next-line:max-line-length
            mat.diffuseTexture = new Texture(
                '/assets/textures/floor/Concrete_panels_001_SD/Concrete_Panels_001_COLOR.jpg',
                this.sceneContext.scene,
            );
            mat.ambientTexture = new Texture(
                '/assets/textures/floor/Concrete_panels_001_SD/Concrete_Panels_001_OCC.jpg',
                this.sceneContext.scene,
            );
            mat.specularTexture = new Texture(
                '/assets/textures/floor/Concrete_panels_001_SD/Concrete_Panels_001_ROUGH.jpg',
                this.sceneContext.scene,
            );
            (mat.diffuseTexture as any).uScale = 100;
            (mat.diffuseTexture as any).vScale = 100;
            this.materials.ground = mat;
        }

        return this.materials.ground;
    }

    getGroundDecal(): Material {
        if (!this.materials.groundDecal) {
            const decalMaterial = new StandardMaterial(
                'decalGround' + MATERIAL_POSTFIX,
                this.sceneContext.scene,
            );
            decalMaterial.diffuseTexture = new Texture(
                '/assets/tt_logo.png',
                this.sceneContext.scene,
            );
            decalMaterial.diffuseTexture.hasAlpha = true;
            decalMaterial.zOffset = -2;
            this.materials.goundDecal = decalMaterial;
        }
        return this.materials.goundDecal;
    }

    getBoxLightMaterial(): Material {
        if (!this.boxMaterials.boxLight) {
            const material = new StandardMaterial(
                'boxLight' + MATERIAL_POSTFIX,
                this.sceneContext.scene,
            );
            material.emissiveColor = new Color3(0.6, 0.7, 0.6);
            this.boxMaterials.boxLight = material;
        }
        return this.boxMaterials.boxLight;
    }

    getBulbTexture(): Material {
        if (!this.materials.bulb) {
            const mat = new StandardMaterial(
                'bulb' + MATERIAL_POSTFIX,
                this.sceneContext.scene,
            );
            // tslint:disable-next-line:max-line-length
            mat.emissiveColor = new Color3(255, 255, 150);
            this.materials.bulb = mat;
        }
        return this.materials.bulb;
    }

    getDecalMaterial() {
        if (!this.materials.decal) {
            const decalMaterial = new StandardMaterial(
                'decal' + MATERIAL_POSTFIX,
                this.sceneContext.scene,
            );
            decalMaterial.diffuseTexture = new Texture(
                '/assets/textures/qr.png',
                this.sceneContext.scene,
            );
            decalMaterial.diffuseTexture.hasAlpha = false;
            decalMaterial.zOffset = -3;
            this.materials.decal = decalMaterial;
        }
        return this.materials.decal;
    }

    private getBaseBox(): StandardMaterial {
        if (!this.boxMaterials.box) {
            const mat = new StandardMaterial(
                'box' + MATERIAL_POSTFIX,
                this.sceneContext.scene,
            );
            mat.diffuseTexture = new Texture(
                '/assets/textures/pexels/pexels-photo-168442.jpg',
                this.sceneContext.scene,
            );
            mat.bumpTexture = new Texture(
                '/assets/textures/wood1/Wood_020_normal.jpg',
                this.sceneContext.scene,
            );
            mat.ambientTexture = new Texture(
                '/assets/textures/wood1/Wood_020_ambientOcclusion.jpg',
                this.sceneContext.scene,
            );
            mat.specularTexture = new Texture(
                '/assets/textures/wood1/Wood_020_height.png',
                this.sceneContext.scene,
            );
            mat.specularColor = new Color3(0.2, 0.2, 0.2);
            this.boxMaterials.box = mat;
        }
        return this.boxMaterials.box;
    }

    private getAlternativeBoxOne() {
        if (!this.boxMaterials.boxAlternative) {
            const mat = this.getBaseBox().clone(
                'boxAlternative' + MATERIAL_POSTFIX,
            );
            mat.diffuseTexture = new Texture(
                '/assets/textures/pexels/wood-timber-brown-lumber-139306.jpg',
                this.sceneContext.scene,
            );
            this.boxMaterials.boxAlternative = mat;
        }
        return this.boxMaterials.boxAlternative;
    }
}
