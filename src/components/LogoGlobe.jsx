import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const randomSphereCoords = (radius, count) => {
  const coords = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    coords.push([x, y, z]);
  }
  return coords;
};

const Logo = ({ position, texture }) => (
  <Float>
    <mesh position={position}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  </Float>
);

const LogoGlobe = ({ logos }) => {
  const positions = randomSphereCoords(8, logos.length);
  const textures = logos.map((logo) =>
    new THREE.TextureLoader().load(logo.imagen)
  );

  return (
    <Canvas camera={{ position: [0, 0, 15] }}>
      <ambientLight />
      <Suspense fallback={null}>
        {textures.map((texture, i) => (
          <Logo key={i} position={positions[i]} texture={texture} />
        ))}
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default LogoGlobe;
