import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Practice() {
  const mountRef = useRef(null);

  useEffect(() => {
    // シーンの作成
    const scene = new THREE.Scene();

    // カメラの作成
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);

    // レンダラーの作成
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // パーティクルのジオメトリ作成
    const particleCount = 10000; // パーティクルの数
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // ランダムにパーティクルを配置
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      sizes[i] = Math.random() * 2 + 1; // パーティクルのサイズをランダムに設定
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 頂点シェーダーとフラグメントシェーダー
    const vertexShader = `
      attribute float size;
      varying float vOpacity;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        
        // 深さに応じた透明度
        vOpacity = smoothstep(0.0, 100.0, -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying float vOpacity;

      void main() {
        // 中心からの距離を計算
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // 水滴の色
        vec3 color = vec3(0.2, 0.4, 0.8); // 青系の水滴の色
        gl_FragColor = vec4(color, vOpacity * 0.7); // 透明度を適用
      }
    `;

    // シェーダーマテリアルの作成
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });

    // パーティクルシステムを作成
    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    // ライト（必須ではないが、パーティクルに影響しないため削除可能）
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // アニメーションループ
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      
      // パーティクルシステム自体を回転
      particleSystem.rotation.y += 0.002;
      particleSystem.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // クリーンアップ
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
}

export default Practice;
