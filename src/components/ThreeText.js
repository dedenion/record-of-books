import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ThreeText() {
    const mountRef = useRef(null);
    const [text, setText] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [camera, setCamera] = useState(null);
    const [renderer, setRenderer] = useState(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        setCamera(camera);
        setRenderer(renderer);

        const fontLoader = new FontLoader();
        fontLoader.load('fonts/Rounded Mplus 1c Medium_Regular.json', function (font) {
            setFontLoaded(true);

            const vertexShader = `
    varying vec2 vUv;
    uniform float time;
    void main() {
        vUv = uv;
        vec3 pos = position;
        // 形状の変化: sin 関数を使って変化させる
        pos.z += sin(pos.x * 0.5 + time * 2.0) * 1.0;
        pos.x += sin(pos.y * 0.5 + time * 1.5) * 1.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform float time;
    void main() {
        // 色の変化: sin 関数を使って時間に応じて色を変化させる
        vec3 color = vec3(sin(time), cos(time), abs(sin(time + vUv.x)));
        gl_FragColor = vec4(color, 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: true,
    uniforms: { time: { value: 0.0 } }
});



            const geometry = new TextGeometry(displayText, {
                font: font,
                size: 40,
                height: 5,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 2,
                bevelSize: 2,
                bevelSegments: 2
            });

            // テキストの中央に基準点を設定
            geometry.computeBoundingBox();
            const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            geometry.translate(-textWidth / 2, 0, 0);

            const textMesh = new THREE.Mesh(geometry, shaderMaterial);
            scene.add(textMesh);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.update();

            camera.position.z = 500;
            camera.position.y = 50;

            const animate = function () {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
                shaderMaterial.uniforms.time.value += 0.01;
            };

            animate();
        });

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [displayText]);

    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    const handleButtonClick = () => {
        setDisplayText(text);
    };

    return (
        <div>
            <input type="text" value={text} onChange={handleInputChange} />
            <button onClick={handleButtonClick}>Display Text</button>
            <div ref={mountRef} />
        </div>
    );
}

export default ThreeText;
