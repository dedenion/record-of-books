import React, { useEffect } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Book = () => {
    let canvas;

    useEffect(() => {
        if (canvas) return;
        canvas = document.getElementById('canvas');

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1, 2);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas || undefined,
            antialias: true,
            alpha: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 5);
        scene.add(light);

        const controls = new PointerLockControls(camera, renderer.domElement);
        window.addEventListener('click', () => {
            controls.lock();
        });

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;
            uniform float time;
            void main() {
                gl_FragColor = vec4(sin(time), cos(time), abs(sin(time + vUv.x)), 1.0);
            }
        `;

        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            wireframe: true,
            uniforms: { time: { value: 0.0 } }
        });

        const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
        const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
        plane.rotateX(-Math.PI / 2);
        scene.add(plane);

        // ライトの位置に球体を生成してマテリアルとしての役割を果たす
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const sphereMesh = new THREE.Mesh(sphereGeometry, shaderMaterial);
        sphereMesh.scale.set(100, 100, 100);
        sphereMesh.position.copy(light.position);
        scene.add(sphereMesh);

        const lightPivot = new THREE.Object3D();
        lightPivot.add(light);
        scene.add(lightPivot);

        const fontLoader = new FontLoader();
        fontLoader.load('/fonts/Rounded Mplus 1c Medium_Regular.json', (font) => {
            const textGeometry = new TextGeometry("バナナ", {
                font: font,
                size: 100.5,
                height: 10.4,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            textGeometry.center();

            const text = new THREE.Mesh(textGeometry, shaderMaterial);
            text.castShadow = true;
            text.position.x = 2;
            text.position.y = 80;
            text.position.z = -500;

            scene.add(text);
        });

        const gltfLoader = new GLTFLoader();
        gltfLoader.load("./textures/scene.gltf", (gltf) => {
            const bananacat = gltf.scene;
            bananacat.scale.set(300, 300, 300);
            bananacat.position.set(0, 10, -1000);
            //scene.add(bananacat);
        });

        gltfLoader.load('./textures/banana/scene.gltf', (gltf) => {
            const banana = gltf.scene;
            banana.scale.set(10, 10, 10);
            banana.position.set(0, 10, 1000);
            //scene.add(banana);
        });

        const boxGeometry = new THREE.SphereGeometry(1, 1, 1);
        const colorsBox = [];
        for (let i = 0; i < boxGeometry.attributes.position.count; i++) {
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            colorsBox.push(color.r, color.g, color.b);
        }
        boxGeometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colorsBox, 3)
        );

        for (let i = 0; i < 3000; i++) {
            const boxMaterial = new THREE.MeshPhongMaterial({
                specular: 0xffffff,
                flatShading: true,
                vertexColors: true,
            });
            boxMaterial.color.setHSL(
                Math.random() * 0.2 + 0.5,
                0.75,
                Math.random() * 0.25 + 0.75
            );
            const box = new THREE.Mesh(boxGeometry, shaderMaterial);
            box.position.x = Math.random() * 1000 - 500;
            box.position.y = Math.random() * 1000 - 500;
            box.position.z = Math.random() * 1000 - 500;
            scene.add(box);
        }

        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;
        let isJumping = false;
        const jumpHeight = 1000.0;

        const onKeyDown = (e) => {
            switch (e.code) {
                case 'KeyW':
                    moveForward = true;
                    break;
                case 'KeyS':
                    moveBackward = true;
                    break;
                case 'KeyA':
                    moveLeft = true;
                    break;
                case 'KeyD':
                    moveRight = true;
                    break;
                case 'Space':
                    if (!isJumping) {
                        isJumping = true;
                        velocity.y += Math.sqrt(2 * jumpHeight * 9.8);
                    }
                    break;
            }
        }

        const onKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW':
                    moveForward = false;
                    break;
                case 'KeyS':
                    moveBackward = false;
                    break;
                case 'KeyA':
                    moveLeft = false;
                    break;
                case 'KeyD':
                    moveRight = false;
                    break;
            }
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        let prevTime = performance.now();
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();

        function animate() {
            const lighttime = Date.now() * 0.0005;
            const radius = 200;
            const speedY = 1;
            const speedZ = 1;
            const speedX = 1;

            const y = Math.cos(lighttime * speedY) * radius;
            const z = Math.sin(lighttime * speedZ) * radius;
            const x = Math.sin(lighttime * speedX) * radius;

            lightPivot.position.set(x, y, z);
            sphereMesh.position.set(x, y, z);

            requestAnimationFrame(animate);

            const time = performance.now();
            const delta = (time - prevTime) / 1000;

            shaderMaterial.uniforms.time.value += 0.005;

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);

            if (controls.isLocked) {
                velocity.z -= velocity.z * 5.0 * delta;
                velocity.x -= velocity.x * 5.0 * delta;

                if (moveForward || moveBackward) {
                    velocity.z -= direction.z * 200 * delta;
                }

                if (moveRight || moveLeft) {
                    velocity.x -= direction.x * 200 * delta;
                }

                if (isJumping) {
                    velocity.y -= 50.8 * delta;
                    controls.getObject().position.y += velocity.y * delta;

                    if (controls.getObject().position.y <= 1.0) {
                        isJumping = false;
                        velocity.y = 0;
                        controls.getObject().position.y = 1.0;
                    }
                }

                controls.moveForward(-velocity.z * delta);
                controls.moveRight(-velocity.x * delta);
            }

            prevTime = time;

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }, []);

    return (
        <canvas id="canvas"></canvas>
    );
};

export default Book;

