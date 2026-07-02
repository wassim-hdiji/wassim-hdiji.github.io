const scene = new THREE.Scene();

// soft depth fog (very subtle Apple style)
scene.fog = new THREE.Fog(0x05060a, 40, 140);

// CAMERA (static, no drama)
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 30);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// =====================
// LIGHT (bare minimum influence)
// =====================
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// =====================
// FULL BACKGROUND PARTICLES (COVER ENTIRE SPACE)
// =====================
const count = 4000;
const positions = [];

for (let i = 0; i < count; i++) {
  positions.push(
    (Math.random() - 0.5) * 120, // wide X spread
    (Math.random() - 0.5) * 80,  // Y spread
    (Math.random() - 0.5) * 120  // Z depth
  );
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0x9aa4b2,
  size: 0.07,
  transparent: true,
  opacity: 0.65
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// =====================
// INPUT STATE
// =====================
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

document.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

// =====================
// ANIMATION LOOP
// =====================
function animate() {
  requestAnimationFrame(animate);

  const t = performance.now() * 0.001;
  const scrollFactor = scrollY * 0.0004;

  // gentle global drift
  particles.rotation.y += 0.0002;
  particles.rotation.x = scrollFactor * 0.2;

  // subtle depth movement (feels like moving through space)
  particles.position.z = -scrollFactor * 25;

  // soft parallax (VERY light)
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

// =====================
// RESIZE
// =====================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});