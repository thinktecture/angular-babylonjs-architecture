import {Injectable} from '@angular/core';
import {Color3, Material, StandardMaterial, Texture} from '@babylonjs/core';
import {SceneContext} from './scene-context.service';

@Injectable({
    providedIn: 'root',
})
export class MaterialService {

    private readonly materials: { [key: string]: Material } = {};

    constructor(private readonly sceneContext: SceneContext) { }

    getBoxMaterial(): Material {
        if (!this.materials.box) {
            const mat = new StandardMaterial('matBox' + Math.random(), this.sceneContext.scene);
            // mat.diffuseTexture = new Texture('https://images.pexels.com/photos/168442/pexels-photo-168442.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
            //     this.sceneContext.scene);

            mat.diffuseTexture = new Texture('/assets/textures/wood1/Wood_020_basecolor.jpg',
                this.sceneContext.scene);
            mat.bumpTexture = new Texture('/assets/textures/wood1/Wood_020_normal.jpg',
                this.sceneContext.scene);
            mat.ambientTexture = new Texture('/assets/textures/wood1/Wood_020_ambientOcclusion.jpg',
                this.sceneContext.scene);
            mat.specularTexture = new Texture('/assets/textures/wood1/Wood_020_height.png',
                this.sceneContext.scene);
            mat.specularColor = new Color3(0.2, 0.2, 0.2);
            this.materials.box = mat;
        }

        return this.materials.box;
    }

    getGroundMaterial(): Material {
        if (!this.materials.ground) {
            const mat = new StandardMaterial('matGround', this.sceneContext.scene);
            // tslint:disable-next-line:max-line-length
            mat.diffuseTexture = new Texture('https://1.bp.blogspot.com/-fl9N0RokiBE/Vhrm_xLtakI/AAAAAAAAIXo/9RMVb4OVFGw/s640/Conrete%2Bthat%2Bis%2Bcracked%2Btexture%2Bseamless.jpg', this.sceneContext.scene);
            (mat.diffuseTexture as any).uScale = 50;
            (mat.diffuseTexture as any).vScale = 50;
            this.materials.ground = mat;
        }

        return this.materials.ground;
    }
}
