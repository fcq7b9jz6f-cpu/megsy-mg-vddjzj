'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

// Mock data for product (will be fetched from Supabase later)
const mockProduct = {
  id: '1',
  name: 'تيشيرت ثلاثي الأبعاد رائع',
  description: 'تيشيرت بتصميم فريد ثلاثي الأبعاد مع طباعة بجودة عالية. مثالي للمظهر العصري.',
  price: 29.99,
  image_url: '/images/tshirt_static.png', // Static image fallback
  model_3d_url: '/models/tshirt.glb', // Path to your GLB model
};

// 3D Model Component
function Model({ url, scrollProgress }) {
  const gltf = useLoader(GLTFLoader, url);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      // Rotate based on scrollProgress
      meshRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 2, scrollProgress);
    }
  });

  return <primitive object={gltf.scene} ref={meshRef} scale={[1, 1, 1]} />;
}

// Animated Background Component
function AnimatedBackground() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[15, 15, 15]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color={0x1a2b3c} side={THREE.BackSide} />
    </mesh>
  );
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState(mockProduct);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(documentHeight > 0 ? scrollY / documentHeight : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-gray-900 text-foreground">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedBackground />
        </Canvas>
      </div>

      {/* Product Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 lg:flex-row lg:space-x-8">
        <div className="w-full max-w-lg lg:w-1/2 h-[500px] mb-8 lg:mb-0 relative group rounded-lg overflow-hidden">
          {/* 3D Canvas */}
          <Canvas camera={{ position: [0, 0, 3], fov: 75 }} className="rounded-lg bg-gray-800/20">
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Environment preset="studio" />
            <Model url={product.model_3d_url} scrollProgress={scrollProgress} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate speed={0.5} autoRotateSpeed={2} />
          </Canvas>
          {/* Optional: Add a static image fallback or loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-white text-lg">اسحب للدوران</p>
          </div>
        </div>

        <div className="w-full max-w-md lg:w-1/2 p-6 bg-card-background rounded-lg shadow-xl backdrop-blur-sm bg-black/30">
          <h1 className="text-4xl font-extrabold mb-4 text-primary-foreground">
            {product.name}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-bold text-primary-foreground">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xl text-muted-foreground ml-2">بما في ذلك الضريبة</span>
          </div>

          <div className="grid gap-4 mb-8">
            <div>
              <Label htmlFor="size" className="text-lg text-primary-foreground">المقاس</Label>
              <Input type="text" id="size" defaultValue="L" className="mt-2 bg-input-background border-border text-primary-foreground" />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-lg text-primary-foreground">الكمية</Label>
              <Input type="number" id="quantity" defaultValue={1} min={1} className="mt-2 bg-input-background border-border text-primary-foreground" />
            </div>
          </div>

          <Button className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
            أضف إلى السلة
          </Button>
        </div>
      </div>
    </div>
  );
}
