import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const Model = ({ setZoom }) => {
  const meshRef = useRef();
  const gltf = useLoader(GLTFLoader, 'models/human_walk/human_walk.gltf');
  const mixerRef = useRef();
  

  useEffect(() => {
    if (gltf.animations.length) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixerRef.current.clipAction(clip).play();
      });
    }
    console.log(gltf.scene);  // デバッグ用
  }, [gltf]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={[-5.5, 0, 0]}  // 位置を調整
      scale={[4, 4, 4]}  // スケールを調整
      receiveShadow
      castShadow
      onPointerOver={() => setZoom(true)}
      onPointerOut={() => setZoom(false)}
    />
  );
};

const CameraControls = ({ zoom }) => {
  const { camera } = useThree();
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    const newPosition = zoom ? new THREE.Vector3(0, 6, 14) : new THREE.Vector3(0, 7, 16);
    setTargetPosition(newPosition);
    camera.position.lerp(targetPosition, 0.9);
  });

  return null;
};

const HumanWalk = () => {
  const [zoom, setZoom] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Canvas style={{ width: '100%', height: '100%' }} shadows camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          intensity={1.5}
          position={[0, 10, 0]}  // 真上に配置
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <mesh receiveShadow position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.5} />
        </mesh>
        <Model setZoom={setZoom} />
        <CameraControls zoom={zoom} />
      </Canvas>
    </div>
  );
};

export default HumanWalk;
