import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

const ShaderScene = () => {
  // References to the shader material and mesh
  const shaderRef = useRef();
  const meshRef = useRef();

  // Window dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Textures
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('ai.jpg');
  const normalMap = textureLoader.load('normal3.png');

  // Handle Uniforms
  const uniforms = {
    time: { value: 0 },
    uMouseOverPos: { value: new THREE.Vector2(0.5, 0.5) },
    uTexture: { value: texture },
    uDisp: { value: normalMap },
    resolution: { value: new THREE.Vector2(width, height) },
    imageSize: { value: new THREE.Vector2(0, 0) },
  };

  // Mesh setup
  useEffect(() => {
    if (texture.image) {
      uniforms.imageSize.value.set(texture.image.width, texture.image.height);
    }
  }, [texture, uniforms]);

  // Animation frame updates
  useFrame(({ clock, mouse }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uMouseOverPos.value.set(mouse.x, mouse.y);
    }
  });

  return (
    <mesh ref={meshRef} scale={[width / 2, height / 2, 1]} position={[0, -100, 0]}>
      <planeGeometry args={[1, 1, 40, 40]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function ShaderCanvas() {
  return (
    <Canvas
      camera={{
        fov: 70,
        position: [0, 0, 600],
        aspect: window.innerWidth / window.innerHeight,
        near: 100,
        far: 2000,
      }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        gl.setSize(window.innerWidth, window.innerHeight);
      }}
    >
      <ShaderScene />
    </Canvas>
  );
}
