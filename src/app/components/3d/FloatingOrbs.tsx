"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface OrbProps {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
}

function Orb({ position, color, size, speed }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
      />
    </Sphere>
  );
}

export function FloatingOrbs() {
  const orbs: OrbProps[] = [
    { position: [-4, 2, -5], color: "#6C5CE7", size: 1.5, speed: 0.5 },
    { position: [5, -1, -4], color: "#00D4FF", size: 1.2, speed: 0.7 },
    { position: [-3, -3, -3], color: "#ff6b9d", size: 0.8, speed: 0.4 },
    { position: [4, 3, -6], color: "#6C5CE7", size: 1.0, speed: 0.6 },
  ];

  return (
    <>
      {orbs.map((orb, index) => (
        <Orb key={index} {...orb} />
      ))}
    </>
  );
}
