import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';

const ThreeScene = () => {
    const canvasRef = useRef(null);
    let scene, camera, renderer, controls, gui;
    const textureLoader = new THREE.TextureLoader();
    let asphaltTexture, bldgTexture;
    const bldgs = [];
    const debris = [];
    const debrisIdealSet = [];
    let ambientLight, hemiLight;

    let speed = 0.5; // 初期値を設定する

    const bldgColor = 0x242424;
    const lightColor = 0x444444;
    const skyColor = 0xaaaaaa;
    const chunkSize = 128;
    const chunksAtATime = 6;
    const debrisPerChunk = 32;
    const debrisMaxChunkAscend = 2;
    const smBldgSize = 10;
    const lgBldgSize = 12;

    class Building {
        constructor(x, y, z, width, height, depth, rotX = 0, rotY = 0, rotZ = 0) {
            this.geo = new THREE.BoxGeometry(width, height, depth);
            this.mat = new THREE.MeshLambertMaterial({
                color: bldgColor,
                map: bldgTexture
            });

            this.mat.map.wrapS = THREE.RepeatWrapping;
            this.mat.map.wrapT = THREE.RepeatWrapping;
            this.mat.map.repeat.set(1, height / width > 2 ? 3 : 2);

            const halfHeight = height / 2;
            const isRotated = rotX !== 0 || rotY !== 0 || rotZ !== 0;

            this.mesh = new THREE.Mesh(this.geo, this.mat);
            this.mesh.position.set(x, isRotated ? y : y + halfHeight, z);

            if (isRotated) {
                this.geo.translate(0, halfHeight, 0);
                this.mesh.rotation.x = rotX * Math.PI / 180;
                this.mesh.rotation.y = rotY * Math.PI / 180;
                this.mesh.rotation.z = rotZ * Math.PI / 180;
            }
            this.mesh.castShadow = true;
            scene.add(this.mesh);
        }
    }

    class Debris {
        constructor(x, y, z, width, height, depth, rotX = 0, rotY = 0, rotZ = 0) {
            this.geo = new THREE.BoxGeometry(width, height, depth);
            this.mat = new THREE.MeshLambertMaterial({
                color: bldgColor
            });
            this.mesh = new THREE.Mesh(this.geo, this.mat);
            this.mesh.position.set(x, y, z);
            this.mesh.rotation.set(
                rotX * Math.PI / 180,
                rotY * Math.PI / 180,
                rotZ * Math.PI / 180
            );
            scene.add(this.mesh);
        }
    }

    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const randomAngle = () => {
        return Math.floor(Math.random() * 360);
    };

    const init = () => {
        // Define speed as a global variable
        window.speed = 0.5;
    
        // load textures
        asphaltTexture = textureLoader.load("https://i.ibb.co/hVK82BH/asphalt-texture.jpg");
        bldgTexture = textureLoader.load("https://i.ibb.co/ZGLhtGv/building-texture.jpg");
    
        // setup scene
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(skyColor));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        // use randomized and fixed configuration of debris particles that can be repeated
        for (let d = 0; d < debrisPerChunk; ++d) {
            const halfChunk = chunkSize / 2;
            const debrisParams = {
                x: randomInt(-halfChunk, halfChunk),
                y: randomInt(0, chunkSize * debrisMaxChunkAscend),
                z: randomInt(-halfChunk, halfChunk)
            };
            debrisParams.size = Math.abs(debrisParams.x / halfChunk) * 6;
            debrisParams.height = debrisParams.size * randomInt(2, 3);

            debrisIdealSet.push({
                x: debrisParams.x,
                y: debrisParams.y,
                z: debrisParams.z,

                width: debrisParams.size,
                height: debrisParams.height,
                depth: debrisParams.size,

                rotX: randomAngle(),
                rotY: randomAngle(),
                rotZ: randomAngle()
            });
        }

        // generate city
        for (let cz = 1; cz > -chunksAtATime; --cz) {
            const zMove = chunkSize * cz;

            // surface
            const groundGeo = new THREE.PlaneGeometry(chunkSize, chunkSize);
            const groundMat = new THREE.MeshLambertMaterial({
                color: 0x969696,
                map: asphaltTexture
            });
            const ground = new THREE.Mesh(groundGeo, groundMat);
            ground.rotation.x = -0.5 * Math.PI;
            ground.position.set(0, 0, zMove);
            ground.receiveShadow = true;
            scene.add(ground);

            // buildings
            bldgs.push(
                // northwest
                new Building(-44, 4, -44 + zMove, lgBldgSize, 40, lgBldgSize, 0, 35, -85),
                new Building(-56, -2, -32 + zMove, smBldgSize, 52, smBldgSize, 15, 0, -12),
                new Building(-36, 0, -16 + zMove, lgBldgSize, 52, lgBldgSize, 0, 0, -10),
                new Building(-24, 0, -36 + zMove, smBldgSize, 52, smBldgSize, 0, 0, -10),
                new Building(-16, 0, -20 + zMove, smBldgSize, 52, smBldgSize, 30, 0, 0),

                // northeast
                new Building(24, -2, -44 + zMove, lgBldgSize, 44, lgBldgSize, -15, 0, 15),
                new Building(40, 0, -36 + zMove, smBldgSize, 48, smBldgSize, 0, 0, 15),
                new Building(48, 0, -36 + zMove, smBldgSize, 38, smBldgSize, 0, 0, 12),
                new Building(20, 0, -24 + zMove, smBldgSize, 40, smBldgSize, 0, 0, 15),
                new Building(32, 0, -24 + zMove, smBldgSize, 48, smBldgSize, 0, 0, 15),
                new Building(42, 0, -24 + zMove, smBldgSize, 38, smBldgSize, 0, 0, 15),
                new Building(48, 2, 1 + zMove, lgBldgSize, 32, lgBldgSize, 0, -25, 80),

                // southwest
                new Building(-48, 0, 16 + zMove, smBldgSize, 44, smBldgSize, 0, 0, -10),
                new Building(-32, 0, 16 + zMove, smBldgSize, 48, smBldgSize, 0, 0, -15),
                new Building(-16, -2, 16 + zMove, smBldgSize, 40, smBldgSize, -10, 0, -12),
                new Building(-32, 0, 32 + zMove, lgBldgSize, 48, lgBldgSize, 0, 0, 15),
                new Building(-48, 0, 48 + zMove, smBldgSize, 20, smBldgSize),
                new Building(-16, 0, 48 + zMove, smBldgSize, 32, smBldgSize, 0, 0, -20),

                // southeast
                new Building(24, 4, 48 + zMove, lgBldgSize, 36, lgBldgSize, 0, 0, 20),
                new Building(32, 0, 48 + zMove, smBldgSize, 32, smBldgSize, 0, 0, 20),
                new Building(16, 0, 32 + zMove, smBldgSize, 48, smBldgSize, 0, 0, -15),
                new Building(32, 0, 32 + zMove, smBldgSize, 52, smBldgSize, 0, 0, 20),
                new Building(16, 0, 16 + zMove, smBldgSize, 40, smBldgSize, 0, 0, -10),
                new Building(32, 2, 0 + zMove, lgBldgSize, 48, lgBldgSize, 0, 0, 15)
            );
        }

        // setup lights
        ambientLight = new THREE.AmbientLight(lightColor, 0.5);
        scene.add(ambientLight);

        hemiLight = new THREE.HemisphereLight(lightColor, skyColor, 0.5);
        scene.add(hemiLight);

        // camera
        camera.position.set(0, 140, -500);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // controls
        controls = new OrbitControls(camera, renderer.domElement);

        // GUI
    gui = new dat.GUI();
    gui.add(window, 'speed', 0.1, 2);

    // render
    renderer.domElement.id = 'canvas';
    canvasRef.current.appendChild(renderer.domElement);
    animate();
};

    const animate = () => {
        requestAnimationFrame(animate);
        debrisIdealSet.forEach(debrisFrame);
        renderer.render(scene, camera);
    };

    function debrisFrame() {
        // removing those, to only leave active ones on the ground, then returning
        for (let i = debris.length - 1; i >= 0; --i) {
            if (debris[i].material.opacity > 0.3) {
                debris[i].material.opacity -= 0.01;
            } else {
                scene.remove(debris[i]);
                debris.splice(i, 1);
            }
        }
        for (let i = 0; i < 2; ++i) {
            const idealLocation = debrisIdealSet[randomInt(0, debrisIdealSet.length)];
            debris.push(new Debris(idealLocation.x, idealLocation.y, idealLocation.z, idealLocation.width, idealLocation.height, idealLocation.depth, idealLocation.rotX, idealLocation.rotY, idealLocation.rotZ));
        }
    }

    useEffect(() => {
        init();

        return () => {
            // cleanup
            gui.destroy();
            controls.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={canvasRef} />
    );
};

export default ThreeScene;
