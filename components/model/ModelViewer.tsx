/* eslint-disable @typescript-eslint/no-explicit-any */
// ModelViewer.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useRef, useState } from 'react';

interface ModelProps {
    url: string;
}

function Model({ url }: ModelProps) {
    const { scene } = useGLTF(url);
    const modelRef = useRef<any>();
    const [direction, setDirection] = useState(1); // 1: tăng góc, -1: giảm góc
    const [rotationAngle, setRotationAngle] = useState(0); // Góc quay hiện tại (radian)

    // Sử dụng useFrame để cập nhật góc quay của model
    useFrame((state, delta) => {
        if (modelRef.current) {
            // Tốc độ quay (radian/giây)
            const rotationSpeed = 0.5; // Điều chỉnh tốc độ quay tại đây

            // Cập nhật góc quay
            let newRotation = rotationAngle + direction * rotationSpeed * delta;

            // Logic quay từ 0deg đến 90deg, 90deg đến -90deg, -90deg đến 0deg
            if (direction === 1 && newRotation > Math.PI / 2) {
                // Đạt 90deg, đổi hướng sang giảm góc
                newRotation = Math.PI / 2;
                setDirection(-1);
            } else if (direction === -1 && newRotation < -Math.PI / 2) {
                // Đạt -90deg, đổi hướng sang tăng góc
                newRotation = -Math.PI / 2;
                setDirection(1);
            }

            // Cập nhật góc quay của model
            modelRef.current.rotation.y = newRotation;
            setRotationAngle(newRotation);
        }
    });

    return <primitive ref={modelRef} object={scene} scale={[2, 2, 2]} />;
}

interface ModelViewerProps {
    modelUrl: string;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
    return (
        <Canvas>
            <ambientLight intensity={2.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Model url={modelUrl} />
            <OrbitControls
                enableZoom={false} // Tắt zoom
                minPolarAngle={Math.PI / 4} // Giới hạn góc quay dọc tối thiểu (45 độ)
                maxPolarAngle={Math.PI / 1.5} // Giới hạn góc quay dọc tối đa (120 độ)
                minAzimuthAngle={-Infinity} // Cho phép quay ngang tự do
                maxAzimuthAngle={Infinity} // Cho phép quay ngang tự do
            />
        </Canvas>
    );
}
