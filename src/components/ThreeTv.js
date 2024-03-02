import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const geomRef = useRef(null);

  let go = false;
  const LINE_COUNT = 2000;

  useEffect(() => {
    const init = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 200;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * LINE_COUNT), 3));
      geom.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(2 * LINE_COUNT), 1));
      geomRef.current = geom;

      for (let line_index = 0; line_index < LINE_COUNT; line_index++) {
        const x = Math.random() * 400 - 200;
        const y = Math.random() * 200 - 100;
        const z = Math.random() * 500 - 100;
        const xx = x;
        const yy = y;
        const zz = z;

        geom.attributes.position.setXYZ(line_index * 2, x, y, z + 1);
        geom.attributes.position.setXYZ(line_index * 2 + 1, xx, yy, zz);
        geom.attributes.velocity.setX(line_index, 0);
        geom.attributes.velocity.setY(line_index, 0);
      }

      const mat = new THREE.LineBasicMaterial({ color: 0xffffff });

      const lines = new THREE.LineSegments(geom, mat);
      scene.add(lines);

      window.addEventListener("resize", onWindowResize, false);

      animate();
    };

    const onWindowResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    document.body.onclick = () => {
      go = !go;
    };

    const animate = () => {
      for (let line_index = 0; line_index < LINE_COUNT; line_index++) {
        if (go) {
          geomRef.current.attributes.velocity.array[2 * line_index] += 0.003;
          geomRef.current.attributes.velocity.array[2 * line_index + 1] += 0.01;
        } else {
          geomRef.current.attributes.velocity.array[2 * line_index] += 0.001;
          geomRef.current.attributes.velocity.array[2 * line_index + 1] += 0.001;
        }

        geomRef.current.attributes.position.array[6 * line_index + 2] += geomRef.current.attributes.velocity.array[2 * line_index];
        geomRef.current.attributes.position.array[6 * line_index + 5] += geomRef.current.attributes.velocity.array[2 * line_index + 1];

        if (geomRef.current.attributes.position.array[6 * line_index + 2] > 200) {
          const z = Math.random() * 200 - 100;
          geomRef.current.attributes.position.array[6 * line_index + 2] = z;
          geomRef.current.attributes.position.array[6 * line_index + 5] = z + 1;
          geomRef.current.attributes.velocity.array[2 * line_index] = 0;
          geomRef.current.attributes.velocity.array[2 * line_index + 1] = 0;
        }
      }

      geomRef.current.attributes.position.needsUpdate = true;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    init();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      containerRef.current.removeChild(rendererRef.current.domElement);
    };
  }, []);

    return (
        
        <div ref={containerRef} />
    );
};

export default ThreeAnimation;
