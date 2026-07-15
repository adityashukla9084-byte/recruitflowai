"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float, Grid } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useRef, Suspense, useMemo, memo } from "react";
import * as THREE from "three";

interface ThreeDScannerSceneProps {
  isScanning?: boolean;
  score?: number;
  role?: string;
}

/* ═══════════════════════════════════════════════════════
   HOLOGRAPHIC RESUME CARD
═══════════════════════════════════════════════════════ */
const HolographicCard = memo(function HolographicCard({ isScanning }: { isScanning: boolean }) {
  const scanRef = useRef<THREE.Mesh>(null!);
  const scanGlowRef = useRef<THREE.Mesh>(null!);
  const scanVolumeRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const dir = useRef(1);
  const scanY = useRef(-1.1);
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
    // Bouncing scan laser
    scanY.current += delta * (isScanning ? 2.35 : 0.85) * dir.current;
    if (scanY.current > 1.1 || scanY.current < -1.1) dir.current *= -1;
    if (scanRef.current) scanRef.current.position.y = scanY.current;
    if (scanGlowRef.current) scanGlowRef.current.position.y = scanY.current;
    if (scanVolumeRef.current) scanVolumeRef.current.position.y = scanY.current;
    // Breathe glow
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(time.current * 2) * 0.04;
    }
  });

  const lines = useMemo(() => [
    { y: 1.02, w: 1.1,  accent: true,  width: 0.048 },
    { y: 0.8,  w: 1.55, accent: false, width: 0.038 },
    { y: 0.62, w: 1.25, accent: false, width: 0.038 },
    { y: 0.44, w: 0.85, accent: true,  width: 0.042 },
    { y: 0.26, w: 1.5,  accent: false, width: 0.038 },
    { y: 0.08, w: 1.3,  accent: false, width: 0.038 },
    { y: -0.1, w: 0.9,  accent: false, width: 0.038 },
    { y:-0.28, w: 1.45, accent: true,  width: 0.042 },
    { y:-0.46, w: 1.2,  accent: false, width: 0.038 },
    { y:-0.64, w: 0.75, accent: false, width: 0.038 },
    { y:-0.82, w: 1.35, accent: false, width: 0.038 },
    { y:-1.0,  w: 1.0,  accent: true,  width: 0.042 },
  ], []);

  return (
    <group>
      {/* ── Card body with emissive glow ── */}
      <mesh castShadow>
        <boxGeometry args={[2.3, 3.1, 0.08]} />
        <meshStandardMaterial
          color="#050d1a"
          emissive="#0a2040"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.7}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── Neon border — layered glow trick ── */}
      {[0.06, 0.1, 0.16].map((opacity, i) => (
        <mesh key={i}>
          <boxGeometry args={[2.3 + i * 0.07, 3.1 + i * 0.07, 0.04]} />
          <meshBasicMaterial
            color="#14b8a6"
            transparent
            opacity={opacity - i * 0.03}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* ── Holographic sheen overlay ── */}
      <mesh ref={glowRef} position={[0, 0, 0.05]}>
        <boxGeometry args={[2.28, 3.08, 0.01]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.08} />
      </mesh>

      {/* ── Teal header stripe ── */}
      <mesh position={[0, 1.32, 0.06]}>
        <boxGeometry args={[2.3, 0.07, 0.01]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={1} />
      </mesh>
      {/* Header glow */}
      <mesh position={[0, 1.32, 0.055]}>
        <boxGeometry args={[2.3, 0.18, 0.005]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.18} />
      </mesh>

      {/* ── Avatar ring ── */}
      <mesh position={[-0.8, 0.92, 0.06]}>
        <torusGeometry args={[0.22, 0.025, 8, 32]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.8, 0.92, 0.06]}>
        <circleGeometry args={[0.19, 24]} />
        <meshBasicMaterial color="#0a2040" transparent opacity={0.9} />
      </mesh>
      {/* Avatar inner dot */}
      <mesh position={[-0.8, 0.92, 0.07]}>
        <circleGeometry args={[0.09, 16]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.7} />
      </mesh>

      {/* ── Text lines ── */}
      {lines.map((l, i) => (
        <group key={i}>
          <mesh position={[0, l.y, 0.055]}>
            <boxGeometry args={[l.w, l.width, 0.005]} />
            <meshBasicMaterial
              color={l.accent ? "#14b8a6" : "#94a3b8"}
              transparent
              opacity={l.accent ? 0.95 : 0.2}
            />
          </mesh>
          {/* Glow on accent lines */}
          {l.accent && (
            <mesh position={[0, l.y, 0.052]}>
              <boxGeometry args={[l.w, l.width * 3, 0.003]} />
              <meshBasicMaterial color="#14b8a6" transparent opacity={0.08} />
            </mesh>
          )}
        </group>
      ))}

      {/* ── Scan laser ── */}
      <mesh ref={scanVolumeRef} position={[0, 0, 0.065]}>
        <planeGeometry args={[2.16, 0.5]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={isScanning ? 0.075 : 0.035} depthWrite={false} />
      </mesh>
      <mesh ref={scanRef} position={[0, 0, 0.08]}>
        <boxGeometry args={[2.2, 0.022, 0.01]} />
        <meshBasicMaterial color="#9fffe8" transparent opacity={isScanning ? 1 : 0.65} />
      </mesh>
      {/* Laser thick glow */}
      <mesh ref={scanGlowRef} position={[0, 0, 0.07]}>
        <boxGeometry args={[2.2, 0.14, 0.005]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={isScanning ? 0.18 : 0.07} depthWrite={false} />
      </mesh>

      {/* ── Score chip ── */}
      <mesh position={[0.65, -1.3, 0.07]}>
        <boxGeometry args={[0.8, 0.27, 0.04]} />
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#14b8a6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.22}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0.65, -1.3, 0.09]}>
        <boxGeometry args={[0.55, 0.04, 0.005]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.85} />
      </mesh>

      {/* ── Corner notches (futuristic) ── */}
      {[[-1.07, 1.43], [1.07, 1.43], [-1.07, -1.43], [1.07, -1.43]].map(([x, y], i) => (
        <mesh key={`corner-${i}`} position={[x, y, 0.07]}>
          <boxGeometry args={[0.15, 0.015, 0.005]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
});

/* ═══════════════════════════════════════════════════════
   GYROSCOPE RINGS  (3 rings at different axes)
═══════════════════════════════════════════════════════ */
const GyroRings = memo(function GyroRings() {
  const r1 = useRef<THREE.Group>(null!);
  const r2 = useRef<THREE.Group>(null!);
  const r3 = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (r1.current) r1.current.rotation.z += delta * 0.4;
    if (r2.current) r2.current.rotation.x += delta * 0.35;
    if (r3.current) r3.current.rotation.y += delta * 0.3;
  });

  return (
    <group>
      {/* Ring 1 — teal */}
      <group ref={r1}>
        <mesh>
          <torusGeometry args={[2.6, 0.015, 8, 100]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.52} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.6, 0.055, 8, 100]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.055} depthWrite={false} />
        </mesh>
      </group>

      {/* Ring 2 — cyan, tilted */}
      <group ref={r2} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.9, 0.012, 8, 100]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Ring 3 — purple, tilted other way */}
      <group ref={r3} rotation={[0, 0, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[3.2, 0.01, 8, 100]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.32} />
        </mesh>
      </group>
    </group>
  );
});

/* ═══════════════════════════════════════════════════════
   DNA HELIX ORBIT
═══════════════════════════════════════════════════════ */
const DNAOrbit = memo(function DNAOrbit() {
  const groupRef = useRef<THREE.Group>(null!);
  const count = 20;

  const orbGeo = useMemo(() => new THREE.SphereGeometry(0.055, 6, 6), []);

  const points = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const t = (i / count) * Math.PI * 2;
      const radius = 2.1;
      return {
        a: { x: Math.cos(t) * radius, y: ((i / count) - 0.5) * 4.5, z: Math.sin(t) * radius },
        b: { x: Math.cos(t + Math.PI) * radius, y: ((i / count) - 0.5) * 4.5, z: Math.sin(t + Math.PI) * radius },
        color: i % 3 === 0 ? "#14b8a6" : i % 3 === 1 ? "#06b6d4" : "#818cf8",
      };
    }), []);

  const matA = useMemo(() => new THREE.MeshBasicMaterial({ color: "#14b8a6", transparent: true, opacity: 0.85 }), []);
  const matB = useMemo(() => new THREE.MeshBasicMaterial({ color: "#818cf8", transparent: true, opacity: 0.85 }), []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.38;
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <group key={i}>
          <mesh geometry={orbGeo} material={matA} position={[p.a.x, p.a.y, p.a.z]} />
          <mesh geometry={orbGeo} material={matB} position={[p.b.x, p.b.y, p.b.z]} />
        </group>
      ))}
    </group>
  );
});

/* ═══════════════════════════════════════════════════════
   INSTANCED PARTICLES
═══════════════════════════════════════════════════════ */
const Particles = memo(function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const COUNT = 80;

  const geo = useMemo(() => new THREE.SphereGeometry(1, 4, 4), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#14b8a6", transparent: true, opacity: 0.5,
  }), []);

  const data = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const random = (seed: number) => {
        const value = Math.sin((i + 1) * seed) * 43758.5453;
        return value - Math.floor(value);
      };

      return {
        x: (random(12.9898) - 0.5) * 12,
        y: (random(78.233) - 0.5) * 10,
        z: (random(39.425) - 0.5) * 8 - 1,
        s: 0.018 + random(93.989) * 0.045,
        speed: 0.1 + random(53.539) * 0.2,
        offset: random(17.719) * Math.PI * 2,
      };
    }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    data.forEach((p, i) => {
      dummy.position.set(p.x, p.y + Math.sin(t * p.speed + p.offset) * 0.3, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, COUNT]} />;
});

/* ═══════════════════════════════════════════════════════
   GRID FLOOR
═══════════════════════════════════════════════════════ */
function GridFloor() {
  return (
    <Grid
      position={[0, -2.4, 0]}
      args={[20, 20]}
      cellSize={0.6}
      cellThickness={0.5}
      cellColor="#14b8a6"
      sectionSize={3}
      sectionThickness={1}
      sectionColor="#0d9488"
      fadeDistance={12}
      fadeStrength={1.5}
      followCamera={false}
      infiniteGrid
    />
  );
}

function CameraRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!group.current) return;
    const smoothing = 1 - Math.exp(-delta * 2.2);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.16, smoothing);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.09, smoothing);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.x * 0.16, smoothing);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, pointer.y * 0.08, smoothing);
  });

  return <group ref={group}>{children}</group>;
}

/* ═══════════════════════════════════════════════════════
   CORNER TAGS
═══════════════════════════════════════════════════════ */
function Tag({ label, color, icon }: { label: string; color: string; icon: string }) {
  return (
    <div style={{
      background: "rgba(5,10,22,0.92)",
      border: `1px solid ${color}50`,
      borderLeft: `3px solid ${color}`,
      borderRadius: "7px",
      padding: "4px 11px",
      color,
      fontSize: "9.5px",
      fontWeight: "800",
      fontFamily: "monospace",
      letterSpacing: "0.1em",
      whiteSpace: "nowrap",
      backdropFilter: "blur(12px)",
      boxShadow: `0 0 16px ${color}20, inset 0 0 8px ${color}08`,
      display: "flex",
      alignItems: "center",
      gap: "5px",
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCENE ROOT
═══════════════════════════════════════════════════════ */
function Scene({ score, isScanning }: { score: number; isScanning: boolean }) {
  return (
    <>
      {/* Cinematic lighting */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 3, 4]} intensity={3} color="#14b8a6" distance={10} />
      <pointLight position={[-5, 0, 3]} intensity={1.5} color="#06b6d4" distance={12} />
      <pointLight position={[5, -2, 3]} intensity={1.2} color="#818cf8" distance={12} />
      <pointLight position={[0, -4, 2]} intensity={0.8} color="#0d9488" distance={8} />

      <CameraRig>
        <GridFloor />
        <Particles />
        <GyroRings />
        <DNAOrbit />
        <Float speed={1.25} rotationIntensity={0.12} floatIntensity={0.32}>
          <HolographicCard isScanning={isScanning} />
        </Float>
      </CameraRig>

      {/* Corner data tags */}
      <Html position={[-3.3, 1.8, 0]} center distanceFactor={8}>
        <Tag label={`ATS: ${score}%`} color="#14b8a6" icon="◈" />
      </Html>
      <Html position={[3.3, 1.4, 0]} center distanceFactor={8}>
        <Tag label="KEYWORDS" color="#06b6d4" icon="◎" />
      </Html>
      <Html position={[-3.3, -1.5, 0]} center distanceFactor={8}>
        <Tag label="PARSING ✓" color="#818cf8" icon="◆" />
      </Html>
      <Html position={[3.3, -1.8, 0]} center distanceFactor={8}>
        <Tag label="SCORE: A+" color="#f59e0b" icon="★" />
      </Html>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.75}
        minPolarAngle={Math.PI / 3.2}
        enableDamping
        dampingFactor={0.07}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORTED COMPONENT
═══════════════════════════════════════════════════════ */
export default function ThreeDScannerScene({
  isScanning = false,
  score = 94,
}: ThreeDScannerSceneProps) {
  return (
    <div style={{ width: "100%", height: "520px", position: "relative", borderRadius: "16px", overflow: "hidden" }}>

      {/* Ambient radial glow — pure CSS, free */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,184,166,0.07) 0%, rgba(6,182,212,0.04) 35%, transparent 70%)",
      }} />

      <Canvas
        shadows={false}
        camera={{ position: [0, 0.8, 8], fov: 40 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <Suspense
          fallback={
            <Html center>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, border: "3px solid #14b8a6",
                  borderTopColor: "transparent", borderRadius: "50%",
                  animation: "rfspin 0.8s linear infinite",
                }} />
                <span style={{ color: "#14b8a6", fontSize: 10, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.2em" }}>
                  LOADING ENGINE...
                </span>
              </div>
            </Html>
          }
        >
          <Scene score={score} isScanning={isScanning} />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.72} luminanceThreshold={0.48} luminanceSmoothing={0.45} mipmapBlur />
          <Vignette offset={0.28} darkness={0.72} />
          <Noise opacity={0.018} />
        </EffectComposer>
      </Canvas>

      {/* ── ATS Score overlay ── */}
      <div style={{
        position: "absolute", bottom: 20, right: 20,
        background: "rgba(5,10,22,0.92)",
        border: "1px solid rgba(20,184,166,0.4)",
        borderRadius: "12px", padding: "8px 16px",
        display: "flex", alignItems: "center", gap: 9,
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 24px rgba(20,184,166,0.18), 0 0 1px rgba(20,184,166,0.6)",
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#14b8a6", boxShadow: "0 0 8px #14b8a6, 0 0 16px #14b8a680",
          animation: "rfpulse 1.5s ease-in-out infinite",
        }} />
        <span style={{ color: "#14b8a6", fontSize: 12, fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.12em" }}>
          ATS SCORE: {score}%
        </span>
      </div>

      {/* ── Live scan badge ── */}
      <div style={{
        position: "absolute", top: 20, left: 20,
        background: "rgba(5,10,22,0.92)",
        border: "1px solid rgba(129,140,248,0.35)",
        borderRadius: "8px", padding: "6px 13px",
        display: "flex", alignItems: "center", gap: 7,
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 16px rgba(129,140,248,0.15)",
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#818cf8", boxShadow: "0 0 6px #818cf8, 0 0 12px #818cf880",
          animation: "rfpulse 2s ease-in-out infinite",
        }} />
        <span style={{ color: "#818cf8", fontSize: 10, fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.18em" }}>
          LIVE SCANNING
        </span>
      </div>

      {/* ── Top-right engine badge ── */}
      <div style={{
        position: "absolute", top: 20, right: 20,
        background: "rgba(5,10,22,0.92)",
        border: "1px solid rgba(6,182,212,0.3)",
        borderRadius: "8px", padding: "5px 11px",
        backdropFilter: "blur(14px)",
      }}>
        <span style={{ color: "#06b6d4", fontSize: 9, fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.18em" }}>
          ENGINE v2.1 ◈
        </span>
      </div>

      {/* ── Bottom-left stats ── */}
      <div style={{
        position: "absolute", bottom: 20, left: 20,
        background: "rgba(5,10,22,0.92)",
        border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: "8px", padding: "6px 13px",
        backdropFilter: "blur(14px)",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        <span style={{ color: "#f59e0b", fontSize: 9, fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.12em", opacity: 0.9 }}>
          ★ RECRUITER MATCH
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              width: 14, height: 3, borderRadius: 2,
              background: i <= 4 ? "#f59e0b" : "rgba(245,158,11,0.2)",
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rfpulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes rfspin { to{transform:rotate(360deg);} }
      `}</style>
    </div>
  );
}
