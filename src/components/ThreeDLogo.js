import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

const RotatingText = () => {
  const meshRef = useRef();

  // アニメーションフレームごとに回転を設定
  useFrame(() => {
    meshRef.current.rotation.y += 0.012;
  });

  return (
    <mesh ref={meshRef}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"  // 使用するフォントのパスを指定
        size={1.4}
        position={[-3.3,-1,0]}
        height={0.4}  // ここで奥行きを設定
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.05}
        bevelOffset={0}
        bevelSegments={5}
        material={new THREE.MeshStandardMaterial({
          color: '#888888',
          metalness: 1,
          roughness: 0.3,
          envMapIntensity: 1,
          anchorX:"center", // X軸方向の中心に配置
        anchorY:"middle" // Y軸方向の中心に配置
        })}
      >
        Record
      </Text3D>
    </mesh>
  );
};

const ThreeDLogo = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} />
      <RotatingText />
    </Canvas>
  );
};

export default ThreeDLogo;
