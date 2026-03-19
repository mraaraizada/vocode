"use client";

import { Canvas } from "@react-three/fiber";
import { Mic3D } from "./Mic3D";
import { AICube3D } from "./AICube3D";
import { FloatingOrbs } from "./FloatingOrbs";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function FloatingObjects() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6C5CE7" />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#00D4FF" />
        
        {/* Floating 3D Objects */}
        <group position={[-3, 1, 0]}>
          <Mic3D />
        </group>
        
        <group position={[3.5, -0.5, 0]}>
          <AICube3D />
        </group>
        
        <FloatingOrbs />
        
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
