import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Basic setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer();

    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(-1, 1.75, 1).multiplyScalar(30);
    scene.add(dirLight);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(10000, 10000);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    groundMat.color.setHSL( 0.095, 1, 0.75 );
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -33;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gltfLoader = new GLTFLoader();
    let mixer1, mixer2; // 複数のAnimationMixerを保持する変数

    // 最初のモデルを読み込む
    gltfLoader.load("models/human_walk/human_walk.gltf", (gltf) => {
    const bananacat = gltf.scene;
    bananacat.scale.set(40, 40, 40);
    bananacat.position.set(-50, -33, 300);
    scene.add(bananacat);

    // 最初のモデルのAnimationMixerを作成
    mixer1 = new THREE.AnimationMixer(bananacat);

    // 最初のモデルに含まれるすべてのアニメーションを再生
    gltf.animations.forEach((clip) => {
        mixer1.clipAction(clip).play();
    });
    });

    // もう一つのモデルを読み込む
    gltfLoader.load("models/cat/scene.gltf", (gltf) => {
    const anotherModel = gltf.scene;
    anotherModel.scale.set(200, 200, 200);
    anotherModel.position.set(0, -33, 200); // 別の位置に配置
    scene.add(anotherModel);

    // もう一つのモデルのAnimationMixerを作成
    mixer2 = new THREE.AnimationMixer(anotherModel);

    // もう一つのモデルに含まれるすべてのアニメーションを再生
    gltf.animations.forEach((clip) => {
        mixer2.clipAction(clip).play();
    });
    });




    // Skydome
    const vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
    `;

    const uniforms = {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    };

    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // Camera position
    camera.position.set(0, 0, 500);

    // Clock for animations
    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
    requestAnimationFrame(animate);

    // 時間経過を取得して、両方のアニメーションを更新
    const deltaTime = clock.getDelta();
    if (mixer1) mixer1.update(deltaTime);
    if (mixer2) mixer2.update(deltaTime);

    // Render the scene
    renderer.render(scene, camera);
    };
    animate();
    // Handle window resize
    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
        mountRef.current.removeChild(renderer.domElement);
        window.removeEventListener('resize', handleResize);
    };
    }, []);

    return <div ref={mountRef} />;
};

export default ThreeScene;
