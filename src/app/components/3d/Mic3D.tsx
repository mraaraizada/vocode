"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { Float, MeshDistortMaterial } from "@react-three/drei";

export function Mic3D() {
  const meshRef = useRef<Mesh>(null);

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.5}
    >
      <group>
        {/* Microphone Head - Sphere */}
        <mesh ref={meshRef} position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshDistortMaterial
            color="#6C5CE7"
            emissive="#6C5CE7"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
            distort={0.1}
            speed={2}
          />
        </mesh>

        {/* Microphone Body - Cylinder */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.25, 0.2, 1.2, 32]} />
          <meshStandardMaterial
            color="#2d2d3a"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>

        {/* Microphone Base */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Glow Ring */}
        <mesh position={[0, 0.5, 0]} scale={1.1}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}
