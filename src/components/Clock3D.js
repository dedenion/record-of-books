import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const Clock3D = () => {
    const rendererRef = useRef(null);
    const clockTextRef = useRef(null);
    const fontRef = useRef(null);
    const scene = new THREE.Scene();

    const addGround = () => {
        const groundGeometry = new THREE.PlaneGeometry(40, 40); // 幅と高さを調整可能
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // カラーを適切に設定
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // 平らな地面を作成するために回転
        ground.position.set(3, -3, 0); // x: 0, y: -2, z: 0 の位置に地面を配置する
        
        //scene.add(ground);
    };

    useEffect(() => {
        let requestId;
        let clockTextMesh;

        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(3, -2, 8);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;
        const canvas = renderer.domElement;
        document.body.appendChild(canvas);

        const loadFont = () => {
            const fontLoader = new FontLoader();
            fontLoader.load('/fonts/Rounded Mplus 1c Medium_Regular.json', (font) => {
                fontRef.current = font;
                updateClock();
                addGround(); 
            });
        };

        const updateClock = () => {
            const date = new Date();
            const timeString = date.toLocaleTimeString();

            if (clockTextMesh) {
                scene.remove(clockTextMesh);
                clockTextMesh.geometry.dispose();
                clockTextMesh.material.dispose();
                clockTextMesh = undefined;
            }

            const clockTextGeometry = new TextGeometry(timeString, {
                font: fontRef.current,
                size: 1,
                height: 0.3,
                curveSegments: 12,
            });
            const clockTextMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            clockTextMesh = new THREE.Mesh(clockTextGeometry, clockTextMaterial);
            clockTextMesh.position.set(0, -2, 0);
            scene.add(clockTextMesh);

            renderer.render(scene, camera);
            requestId = requestAnimationFrame(updateClock);
        };

        loadFont();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(requestId);
            window.removeEventListener('resize', handleResize);
            document.body.removeChild(canvas);

            // Dispose resources
            renderer.dispose();
            // シーン内のすべてのオブジェクトを削除
scene.traverse(obj => {
    if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        obj.material.dispose();
    }
});

            fontRef.current = null;
        };
    }, []);

    return (
        <canvas id="clock"></canvas>
    );
};

export default Clock3D;
