function main() {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas);

  const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const axes = new BABYLON.AxesViewer(scene, 0.5);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      4,
      new BABYLON.Vector3(0, 0, 0)
    );
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0)
    );

    const car = buildCar();
    car.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, Math.PI / 2);

    const animCar = new BABYLON.Animation(
      "carAnimation",
      "position.z",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const carKeys = [];
    carKeys.push({
      frame: 0,
      value: 8,
    });
    carKeys.push({
      frame: 150,
      value: -7,
    });
    carKeys.push({
      frame: 200,
      value: -7,
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);

    const wheelRB = scene.getMeshByName("wheelRB");
    const wheelRF = scene.getMeshByName("wheelRF");
    const wheelLB = scene.getMeshByName("wheelLB");
    const wheelLF = scene.getMeshByName("wheelLF");
    //Begin animation - object to animate, first frame, last frame and loop if true
    // アニメーションを開始する
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);

    return scene;
  };

  const buildCar = () => {
    //base
    const outline = [
      new BABYLON.Vector3(-0.3, 0, -0.1),
      new BABYLON.Vector3(0.2, 0, -0.1),
    ];

    //curved front
    for (let i = 0; i < 20; i++) {
      outline.push(
        new BABYLON.Vector3(
          0.2 * Math.cos((i * Math.PI) / 40),
          0,
          0.2 * Math.sin((i * Math.PI) / 40) - 0.1
        )
      );
    }

    //top
    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    //back formed automatically

    // car uv mapping
    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
    faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

    // car material
    const carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/car.png"
    );

    const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {
      shape: outline,
      depth: 0.2,
      faceUV: faceUV,
      wrap: true,
    });
    car.material = carMat;

    // 車輪用の UV
    const wheelUV = [];
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    // 車輪用のマテリアル
    const wheelMat = new BABYLON.StandardMaterial("wheelMat");
    wheelMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/wheel.png"
    );

    const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {
      diameter: 0.125,
      height: 0.05,
      faceUV: wheelUV,
    });
    wheelRB.material = wheelMat;
    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;

    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;

    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;

    // animation
    const animWheel = new BABYLON.Animation(
      "wheelAnimation",
      "rotation.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const wheelKeys = [];
    // キーフレーム (アニメーションキー) が 0 のとき、
    // rotation.y に 0 を設定
    wheelKeys.push({
      frame: 0,
      value: 0,
    });
    // キーフレームが 30 (30 FPS なので 1 秒後のこと) のとき、
    // rotation.y に 2PI (360度) を設定し一回転を表す
    wheelKeys.push({
      frame: 30,
      value: 2 * Math.PI,
    });

    // キーフレームをセット
    animWheel.setKeys(wheelKeys);

    //Link this animation to the right back wheel
    // このアニメーションを右後ろの車輪にリンクする
    wheelRB.animations = [animWheel];
    wheelRF.animations = [animWheel];
    wheelLB.animations = [animWheel];
    wheelLF.animations = [animWheel];

    return car;
  };

  const scene = createScene();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
}

window.addEventListener("DOMContentLoaded", main);
