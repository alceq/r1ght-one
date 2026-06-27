/**
 * hero.js — Three.js 3D Particle Network
 * Creates an interactive neural-network-style background
 * in the hero section. Particles connect with lines when
 * close together. Mouse movement creates a parallax effect.
 */

(function () {
  'use strict';

  const container = document.getElementById('heroCanvas');
  if (!container || typeof THREE === 'undefined') return;

  // ── Config ──
  const CONFIG = {
    particleCount: 120,
    connectionDistance: 150,
    particleSize: 2,
    speed: 0.3,
    mouseInfluence: 0.05,
    colors: {
      particle: 0x00d4ff,
      connection: 0x00d4ff,
      particleAlt: 0x7c3aed,
    },
    bounds: {
      x: 800,
      y: 500,
      z: 400,
    },
  };

  // ── Responsive particle count ──
  if (window.innerWidth < 768) {
    CONFIG.particleCount = 50;
    CONFIG.connectionDistance = 120;
  } else if (window.innerWidth < 1024) {
    CONFIG.particleCount = 80;
  }

  // ── Scene setup ──
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ── Particles ──
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(CONFIG.particleCount * 3);
  const velocities = [];
  const colors = new Float32Array(CONFIG.particleCount * 3);

  const cyanColor = new THREE.Color(CONFIG.colors.particle);
  const purpleColor = new THREE.Color(CONFIG.colors.particleAlt);

  for (let i = 0; i < CONFIG.particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * CONFIG.bounds.x * 2;
    positions[i3 + 1] = (Math.random() - 0.5) * CONFIG.bounds.y * 2;
    positions[i3 + 2] = (Math.random() - 0.5) * CONFIG.bounds.z * 2;

    velocities.push({
      x: (Math.random() - 0.5) * CONFIG.speed,
      y: (Math.random() - 0.5) * CONFIG.speed,
      z: (Math.random() - 0.5) * CONFIG.speed * 0.5,
    });

    // Mix cyan and purple
    const t = Math.random();
    const mixedColor = cyanColor.clone().lerp(purpleColor, t);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Create circular particle texture
  const canvas2d = document.createElement('canvas');
  canvas2d.width = 32;
  canvas2d.height = 32;
  const ctx = canvas2d.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const particleTexture = new THREE.CanvasTexture(canvas2d);

  const particleMaterial = new THREE.PointsMaterial({
    size: CONFIG.particleSize,
    map: particleTexture,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ── Connection Lines ──
  const maxConnections = CONFIG.particleCount * 10;
  const linePositions = new Float32Array(maxConnections * 6);
  const lineColors = new Float32Array(maxConnections * 6);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  lineGeometry.setDrawRange(0, 0);

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // ── Mouse tracking ──
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animation loop ──
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);

    // Smooth mouse follow
    mouse.x += (mouse.targetX - mouse.x) * CONFIG.mouseInfluence;
    mouse.y += (mouse.targetY - mouse.y) * CONFIG.mouseInfluence;

    // Camera parallax
    camera.position.x = mouse.x * 50;
    camera.position.y = mouse.y * 30;
    camera.lookAt(scene.position);

    // Update particle positions
    const pos = particleGeometry.attributes.position.array;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      const i3 = i * 3;

      pos[i3] += velocities[i].x;
      pos[i3 + 1] += velocities[i].y;
      pos[i3 + 2] += velocities[i].z;

      // Bounce off bounds
      if (Math.abs(pos[i3]) > CONFIG.bounds.x) velocities[i].x *= -1;
      if (Math.abs(pos[i3 + 1]) > CONFIG.bounds.y) velocities[i].y *= -1;
      if (Math.abs(pos[i3 + 2]) > CONFIG.bounds.z) velocities[i].z *= -1;
    }

    particleGeometry.attributes.position.needsUpdate = true;

    // Update connections
    let lineIndex = 0;
    const lPos = lineGeometry.attributes.position.array;
    const lCol = lineGeometry.attributes.color.array;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      const i3 = i * 3;
      for (let j = i + 1; j < CONFIG.particleCount; j++) {
        const j3 = j * 3;

        const dx = pos[i3] - pos[j3];
        const dy = pos[i3 + 1] - pos[j3 + 1];
        const dz = pos[i3 + 2] - pos[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONFIG.connectionDistance && lineIndex < maxConnections) {
          const li = lineIndex * 6;
          const alpha = 1 - dist / CONFIG.connectionDistance;

          lPos[li] = pos[i3];
          lPos[li + 1] = pos[i3 + 1];
          lPos[li + 2] = pos[i3 + 2];
          lPos[li + 3] = pos[j3];
          lPos[li + 4] = pos[j3 + 1];
          lPos[li + 5] = pos[j3 + 2];

          // Color with alpha fade based on distance
          const r = cyanColor.r * alpha;
          const g = cyanColor.g * alpha;
          const b = cyanColor.b * alpha;

          lCol[li] = r;
          lCol[li + 1] = g;
          lCol[li + 2] = b;
          lCol[li + 3] = r;
          lCol[li + 4] = g;
          lCol[li + 5] = b;

          lineIndex++;
        }
      }
    }

    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIndex * 2);

    // Slow rotation
    particles.rotation.y += 0.0003;
    lines.rotation.y += 0.0003;

    renderer.render(scene, camera);
  }

  // ── Resize handler ──
  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener('resize', onResize);

  // ── Visibility-based pause ──
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  // ── Start ──
  animate();
})();
