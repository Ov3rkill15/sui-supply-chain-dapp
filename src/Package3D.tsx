import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";

// 📦 BENTUK KOTAKNYA
const Box = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animasi Putar-Putar Otomatis
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Putar sumbu Y
      meshRef.current.rotation.x += delta * 0.2; // Putar sumbu X pelan
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        {/* Geometri Kubus (Lebar, Tinggi, Dalam) */}
        <boxGeometry args={[2.8, 2.8, 2.8]} />
        
        {/* Material Warna (Coklat Kardus Elegan) */}
        <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.1} />
        
        {/* Garis Tepi (Wireframe) biar Techy */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.8, 2.8, 2.8)]} />
          <lineBasicMaterial color="#fbbf24" />
        </lineSegments>
      </mesh>
    </Float>
  );
};

// 🎥 PANGGUNG UTAMA (CANVAS)
const Package3D = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <OrbitControls enableZoom={false} autoRotate={false} />
        
        {/* Pencahayaan */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} color="#3b82f6" intensity={2} />

        {/* Tampilkan Kotak */}
        <Box />
      </Canvas>
    </div>
  );
};

export default Package3D;