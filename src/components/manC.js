import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Model_Man = ({ heightScale, showBones }) => {
  const meshRef = useRef();
  const gltf = useLoader(GLTFLoader, 'models/human/man/Slender_Man_lores.glb');
  const mixerRef = useRef();
  const skeletonHelperRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (gltf.animations.length) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixerRef.current.clipAction(clip).play();
      });
    }

    skeletonHelperRef.current = new THREE.SkeletonHelper(gltf.scene);
    skeletonHelperRef.current.visible = showBones;
    scene.add(skeletonHelperRef.current);

    gltf.scene.traverse((object) => {
        if (object.isMesh && object.skeleton) {
          const bones = object.skeleton.bones;
          bones.forEach((bone) => {
            const faceBones = ['face', 'nose', 'nose001', 'nose002', 'nose003', 'nose004', 
                                'lipTL', 'lipTL001', 'lipBL', 'lipBL001', 'jaw', 'chin',
                                'chin001', 'earL', 'earL001', 'earL002', 'earL003', 'earL004',
                                'earR', 'earR001', 'earR002', 'earR003', 'earR004', 'lipTR',
                                'lipTR001', 'lipBR', 'lipBR001', 'browBL', 'browBL001', 'browBL002',
                                'browBL003', 'lidTL', 'lidTL001', 'lidTL002', 'lidTL003', 'lidBL', 
                                'lidBL001', 'lidBL002', 'lidBL003', 'browBR', 'browBR001', 'browBR002', 
                                'browBR003', 'lidTR', 'lidTR001', 'lidTR002', 'lidTR003', 'lidBR', 
                                'lidBR001', 'lidBR002', 'lidBR003', 'foreheadL', 'foreheadL001', 'foreheadL002', 
                                'templeL', 'jawL', 'jawL001', 'chinL', 'cheekBL', 'cheekBL001', 'browTL', 'browTL001', 
                                'browTL002', 'browTL003', 'foreheadR', 'foreheadR001', 'foreheadR002', 'templeR', 
                                'jawR', 'jawR001', 'chinR', 'cheekBR', 'cheekBR001', 'browTR', 'browTR001', 
                                'browTR002', 'browTR003', 'eyeL', 'eyeR', 'cheekTL', 'cheekTL001', 'noseL', 
                                'noseL001', 'cheekTR', 'cheekTR001', 'noseR', 'noseR001'];
            const neckBones = ['spine004', 'spine005','spine003'];
            const bodyBones = ['spine', 'spine001', 'spine002', 'spine004',
                                'thighL', 'shinL', 'footL', 'toeL', 
                                'thighR', 'shinR', 'footR', 'toeR'];
            const waistBones = ['spine', 'spine001', 'spine002', 'spine003', 'spine004', 'spine005', 'spine006', 
                                'pelvisL', 'pelvisR', 'breastL', 'breastR'];
  
            if (faceBones.includes(bone.name)) {
              const faceScaleFactor = 1 + (heightScale - 1) * 0;
              bone.scale.y = faceScaleFactor;
              bone.scale.x = bone.scale.z = 1 + (heightScale - 1) * 0.1;
              bone.scale.z = 1 + (heightScale - 1) * -0.2;
            } else if (bodyBones.includes(bone.name)) {
              bone.scale.y = 1 + (heightScale - 1) * 1.02;
              bone.scale.x = bone.scale.z = 1 + (heightScale - 1) * 0.5;
            } else if (neckBones.includes(bone.name)) {
              bone.scale.y = 1 + (heightScale - 1) * -0.8;
              bone.scale.x = bone.scale.z = 1 + (heightScale - 1) * 0.3;
            } else if (waistBones.includes(bone.name)) {
          // ウエスト部分のボーンを太くする
          const waistScaleFactor = 1 + (heightScale - 1) * 1.8; // この値を調整して太さを変更
          bone.scale.x = bone.scale.z = waistScaleFactor;
          
          
            
              if (bone.name === 'spine') {
                bone.scale.x = 1 + (heightScale - 1) * 1.3;
              }
              if (bone.name === 'thighL' || bone.name === 'thighR' || bone.name === 'shinL' || bone.name === 'shinR') {
                bone.scale.y = 1 + (heightScale - 1) * 1.5;
              }
              if (bone.name === 'spine003' || bone.name === 'spine004' ||
                  bone.name === 'thighL' || bone.name === 'thighR' ||
                  bone.name === 'shinL' || bone.name === 'shinR') {
                bone.scale.x = 1 + (heightScale - 1) * 1.8;
              } else {
                bone.scale.x = bone.scale.z = 1 + (heightScale - 1) * 0.1;
              }
            } else {
              bone.scale.y = 1 + (heightScale - 1) * -0.5;
              bone.scale.x = bone.scale.z = 1 + (heightScale - 1) * 0.4;
            }
          });
        }
    });

    return () => {
      if (skeletonHelperRef.current) {
        scene.remove(skeletonHelperRef.current);
      }
    };
  }, [gltf, scene, heightScale, showBones]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);

    if (skeletonHelperRef.current && meshRef.current) {
      skeletonHelperRef.current.position.copy(meshRef.current.position);
      skeletonHelperRef.current.scale.copy(meshRef.current.scale);
      skeletonHelperRef.current.updateMatrixWorld(true);
      skeletonHelperRef.current.visible = showBones;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={[0, -6, 0]}
      scale={[5, 5, 5]}
      receiveShadow
      castShadow
    />
  );
};

const ManC = () => {
    const [height, setHeight] = useState(170);
    const [showBones, setShowBones] = useState(false);
    const intervalRef = useRef(null);
    const stepSize = 0.1;
  
    const changeHeight = useCallback((change) => {
      setHeight((prevHeight) => {
        const newHeight = Number((prevHeight + change).toFixed(1));
        return newHeight >= 150 && newHeight <= 250 ? newHeight : prevHeight;
      });
    }, []);
  
    const startChanging = useCallback((change) => {
      if (intervalRef.current) return;
      changeHeight(change);
      intervalRef.current = setInterval(() => changeHeight(change), 50);
    }, [changeHeight]);
  
    const stopChanging = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);
  
    useEffect(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, []);
  
    const heightScale = height / 170;

    const toggleBones = () => {
      setShowBones(prev => !prev);
    };
  
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <button
              onMouseDown={() => startChanging(-stepSize)}
              onMouseUp={stopChanging}
              onMouseLeave={stopChanging}
              onTouchStart={() => startChanging(-stepSize)}
              onTouchEnd={stopChanging}
              style={{ fontSize: '1.5em', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
            >
              -
            </button>
            <span style={{ margin: '0 20px', fontSize: '2em', fontWeight: 'bold' }}>{height.toFixed(1)} cm</span>
            <button
              onMouseDown={() => startChanging(stepSize)}
              onMouseUp={stopChanging}
              onMouseLeave={stopChanging}
              onTouchStart={() => startChanging(stepSize)}
              onTouchEnd={stopChanging}
              style={{ fontSize: '1.5em', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
            >
              +
            </button>
          </div>
          <button
            onClick={toggleBones}
            style={{ fontSize: '1em', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
          >
            {showBones ? 'Hide Bones' : 'Show Bones'}
          </button>
        </div>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          shadows
          camera={{ position: [0, 4, 15], fov: 70 }}
        >
        <ambientLight intensity={0.5} />
        <directionalLight
          intensity={1.5}
          position={[0, 10, 0]}
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
        <Model_Man heightScale={heightScale} showBones={showBones} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ManC;