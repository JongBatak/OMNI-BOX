"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Loader2 } from 'lucide-react';

export function ThreeDViewer({ url, extension }: { url: string, extension: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Ambient light - slightly warmer to simulate outdoors
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.5);
    scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    // Fill light from the other side
    const fillLight = new THREE.DirectionalLight(0xa5c2f3, 0.6);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);
    
    // Bottom light for bounce
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    let mixer: THREE.AnimationMixer;
    const clock = new THREE.Clock();

    const handleLoad = (object: any) => {
      scene.add(object);
      
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      
      // Look at the center of the object
      controls.target.copy(center);
      // Move camera back to view entire object
      camera.position.set(center.x, center.y + (maxDim * 0.2), center.z + cameraZ * 1.3);
      camera.updateProjectionMatrix();

      setLoading(false);
    };

    const ext = extension.toLowerCase();
    if (ext === 'glb' || ext === 'gltf') {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        }
        handleLoad(gltf.scene);
      }, undefined, (e) => { console.error('Error loading GLTF', e); setLoading(false); });
    } else if (ext === 'fbx') {
      const loader = new FBXLoader();
      loader.load(url, (fbx) => {
        if (fbx.animations && fbx.animations.length) {
          mixer = new THREE.AnimationMixer(fbx);
          fbx.animations.forEach((clip) => mixer.clipAction(clip).play());
        }
        handleLoad(fbx);
      }, undefined, (e) => { console.error('Error loading FBX', e); setLoading(false); });
    } else if (ext === 'obj') {
      const loader = new OBJLoader();
      loader.load(url, (obj) => {
        handleLoad(obj);
      }, undefined, (e) => { console.error('Error loading OBJ', e); setLoading(false); });
    } else {
      setLoading(false);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (mixer) mixer.update(clock.getDelta());
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement === mountRef.current.firstChild) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [url, extension]);

  return (
    <div className="relative w-full h-full bg-[#111]">
      {loading && (
        <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-[#111] z-10">
          <Loader2 className="w-10 h-10 text-omni-cyan animate-spin" />
          <p className="font-mono text-omni-cyan text-sm">Loading 3D Engine...</p>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full cursor-move" />
    </div>
  );
}
