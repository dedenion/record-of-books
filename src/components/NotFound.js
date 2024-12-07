import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

export const Page404 = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Basic scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Position the camera
    camera.position.z = 5;

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resizing
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white" }}>
        <h1>404 NOT FOUND</h1>
        <p>お探しのページが見つかりませんでした。</p>
        <Link to="/home" style={{ color: "#ff6347" }}>Topに戻る</Link>
      </div>
    </>
  );
};
