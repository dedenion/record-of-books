import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


const Human = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1, 2);



        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
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

        // プレイヤーの物理的な表現（球体）
        const playerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
        const player = new THREE.Mesh(playerGeometry, playerMaterial);
        player.position.set(0, 1, 0);
        scene.add(player);

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

        const planeGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
        const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
        plane.rotateX(-Math.PI / 2);
        scene.add(plane);

        // 立方体を追加
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(5, 1, 0);
        scene.add(cube);


        




        const gltfLoader = new GLTFLoader();
        let mixer;

        gltfLoader.load("models/human_walk/human_walk.gltf", (gltf) => {
            const bananacat = gltf.scene;
            bananacat.scale.set(1, 1, 1);
            bananacat.position.set(0, 0, 0);
            scene.add(bananacat);
        
            // AnimationMixerを作成
            mixer = new THREE.AnimationMixer(bananacat);
        
            // モデルに含まれるすべてのアニメーションを再生
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        });


        


        const lightPivot = new THREE.Object3D();
        lightPivot.add(light);
        scene.add(lightPivot);

        const jumpHeight = 2.0;
        const GRAVITY = 1.62; // 月の重力加速度（m/s^2）
        const MOVE_SPEED = 50.0;

        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;
        let isJumping = false;

        let prevTime = performance.now();
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();

        // Raycasterの設定
        const raycaster = new THREE.Raycaster();
        const rayDirections = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
        ];

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
                        velocity.y += Math.sqrt(2 * jumpHeight * GRAVITY); // ジャンプの初速度を調整
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

            requestAnimationFrame(animate);

            const time = performance.now();
            const delta = (time - prevTime) / 1000;

            shaderMaterial.uniforms.time.value += 0.005;

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();

                    // mixerを更新
            if (mixer) {
                mixer.update(clock.getDelta());
            }


            if (controls.isLocked) {
                velocity.x -= velocity.x * 5.0 * delta;
                velocity.z -= velocity.z * 5.0 * delta;
                velocity.y -= GRAVITY * delta; // 月の重力を適用
        
                if (moveForward || moveBackward) velocity.z -= direction.z * MOVE_SPEED * delta;
                if (moveLeft || moveRight) velocity.x -= direction.x * MOVE_SPEED * delta;
        
                // 衝突検出
                let canMove = true;
                for (let dir of rayDirections) {
                    raycaster.set(player.position, dir);
                    const intersects = raycaster.intersectObjects([cube, plane]);
                    if (intersects.length > 0 && intersects[0].distance < 0.5) {
                        canMove = false;
                        break;
                    }
                }
        
                if (canMove) {
                    controls.moveRight(-velocity.x * delta);
                    controls.moveForward(-velocity.z * delta);
                    player.position.x = controls.getObject().position.x;
                    player.position.z = controls.getObject().position.z;
                } else {
                    velocity.x = 0;
                    velocity.z = 0;
                }
        
                // Y軸の移動（ジャンプと落下）
                player.position.y += velocity.y * delta;
                controls.getObject().position.y = player.position.y;
        
                // 地面との衝突判定
                if (player.position.y < 1) {
                    velocity.y = 0;
                    player.position.y = 1;
                    controls.getObject().position.y = 1;
                    isJumping = false;
                }
        
                // 立方体との衝突判定（上面）
                if (
                    player.position.x > cube.position.x - 1 &&
                    player.position.x < cube.position.x + 1 &&
                    player.position.z > cube.position.z - 1 &&
                    player.position.z < cube.position.z + 1 &&
                    player.position.y > cube.position.y + 1 &&
                    player.position.y < cube.position.y + 2
                ) {
                    velocity.y = 0;
                    player.position.y = cube.position.y + 2;
                    controls.getObject().position.y = player.position.y;
                    isJumping = false;
                }
            }

            prevTime = time;

            renderer.render(scene, camera);
        }

        animate();

                
        // クロックを作成（Delta時間の計算に使用）
        const clock = new THREE.Clock();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default Human;