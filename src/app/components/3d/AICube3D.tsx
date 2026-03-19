"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { Float, Box, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function AICube3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.4}
    >
      <group ref={groupRef}>
        {/* Main Cube */}
        <Box args={[1.2, 1.2, 1.2]} radius={0.1}>
          <meshStandardMaterial
            color="#8b5cf6"
            roughness={0.2}
            metalness={0.8}
            emissive="#8b5cf6"
            emissiveIntensity={0.1}
            transparent
            opacity={0.9}
          />
        </Box>

        {/* Inner Core */}
        <Sphere args={[0.4, 16, 16]}>
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={1}
          />
        </Sphere>

        {/* Orbiting Particles */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 1;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 0.5) * 0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#6366f1" : "#8b5cf6"}
                emissive={i % 2 === 0 ? "#6366f1" : "#8b5cf6"}
                emissiveIntensity={0.6}
              />
            </mesh>
          );
        })}

        {/* Wireframe Overlay */}
        <Box args={[1.25, 1.25, 1.25]}>
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.1}
          />
        </Box>
      </group>
    </Float>
  );
}
