import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const Clock3D = () => {
    const rendererRef = useRef(null);
    const clockTextRef = useRef(null);
    const fontRef = useRef(null);

    useEffect(() => {
        let requestId;
        let clockTextMesh;

        const scene = new THREE.Scene();
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
                height: 0.1,
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

    return null;
};

export default Clock3D;
