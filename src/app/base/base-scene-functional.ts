import {
    Engine,
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    PointLight,
    Scene,
    SceneOptions,
    ShadowGenerator,
    StandardMaterial, Texture,
    TransformNode,
    Vector3, Vector4,
} from '@babylonjs/core';

const scaleUnit = 10;
const scale = new Vector3(scaleUnit, scaleUnit, scaleUnit);

export class BaseScene extends Scene {


    private readonly shadowGen: ShadowGenerator[] = [];

    private readonly numberOfPointLights = 5;
    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly pointLights: PointLight[] = [];

    private readonly numberOfBoxes = 10;
    private readonly rowsOfBoxes = 2;
    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly boxes: Mesh[] = [];

    constructor(engine: Engine, private canvas: HTMLCanvasElement, options?: SceneOptions) {
        super(engine, options);
        this.addDefaults();
    }

    private addDefaults() {

        // const camera = new FreeCamera('Camera', Vector3.Zero(), this);
        // camera.cameraDirection = new Vector3(0, 0, -1);
        // this.addPointLights();


        // This creates a basic Babylon Scene object (non-mesh)
        // This creates and positions a free camera (non-mesh)
        const camera = new FreeCamera('camera1', new Vector3(0, 1.5, -10).scale(scaleUnit), this);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this.canvas, true);

        const light = new HemisphericLight('HemisphereLight', new Vector3(1, 2, 1.5).scale(scaleUnit), this);
        light.intensity = 0.6;


        const ground = MeshBuilder.CreateGround('ground', { width: 100 * scaleUnit, height: 100 * scaleUnit }, this);
        ground.receiveShadows = true;

        const mat1 = new StandardMaterial('mat1', this);
        mat1.diffuseTexture = new Texture('https://1.bp.blogspot.com/-fl9N0RokiBE/Vhrm_xLtakI/AAAAAAAAIXo/9RMVb4OVFGw/s640/Conrete%2Bthat%2Bis%2Bcracked%2Btexture%2Bseamless.jpg', this);
        (mat1.diffuseTexture as any).uScale = 50;
        (mat1.diffuseTexture as any).vScale = 50;
        ground.material = mat1;

        this.addPointLights();
        this.addBoxes();
    }

    private addPointLights() {
        for (let i = 0; i < this.numberOfPointLights; i++) {
            const light = new PointLight('PointLight' + i, new Vector3(0, 1, i * 10).scale(scaleUnit), this);
            light.intensity = 0.45;
            light.range = 10 * scaleUnit;
            this.pointLights.push(light);
            const shadowGen = new ShadowGenerator(1024, this.pointLights[0]);
            this.shadowGen.push(shadowGen);
            shadowGen.usePoissonSampling = true;
            shadowGen.useContactHardeningShadow = true;
            shadowGen.filteringQuality = ShadowGenerator.QUALITY_LOW;


        }
    }

    private addBoxes() {

        const mat2 = new StandardMaterial('mat2', this);
        mat2.diffuseTexture = new Texture('https://st.depositphotos.com/1706719/1224/i/950/depositphotos_12245294-stock-photo-cardboard-box-texture.jpg', this);

        for (let j = 0; j < this.rowsOfBoxes; j++) {
            for (let i = 0; i < this.numberOfBoxes; i++) {
                const x = j === 0 ? -2 : 2;

                let box;
                if (Math.random() > 0.8) {
                    box = new TransformNode('TN' + i + j, this);
                    this.addMiniBoxesRow(box);
                    box.position = new Vector3(x, 0, i * 3).scale(scaleUnit);
                } else {
                    box = MeshBuilder.CreateBox('Box' + i + j, {
                        width: 2 * scaleUnit,
                        height: 2 * scaleUnit,
                        depth: 2 * scaleUnit,
                    }, this);
                    this.shadowGen.forEach(s => s.addShadowCaster(box));
                    box.position = new Vector3(x, 1, i * 3).scale(scaleUnit);
                    box.material = mat2;
                }
                this.boxes.push(box);
            }
        }
    }

    private addMiniBoxesRow(parent: TransformNode, sideLength = 2 * scaleUnit) {

        const max = Math.floor(Math.random() * 10 + 1);
        let maxDim = {
            height: sideLength / max - 0.03 * scaleUnit,
            width: sideLength,
            depth: sideLength,
        };
        let nextPos = new Vector3(0, 0, 0);
        for (let i = 0; i < max; i++) {
            console.log(max, '/', i, maxDim);
            let box;
            box = MeshBuilder.CreateBox('MiniBox' + i + parent.name, {
                ...maxDim,
            }, this);
            this.shadowGen.forEach(s => s.addShadowCaster(box));
            this.boxes.push(box);

            box.parent = parent;
            box.position = nextPos;
            nextPos = new Vector3(0, nextPos.y + maxDim.height, 0);
            nextPos.y += 0.03 * scaleUnit;
        }
    }


}
