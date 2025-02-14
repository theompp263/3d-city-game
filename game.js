// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x0000ff);

// OrbitControls to move the camera around (for better navigation in 3D)
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Player properties (represented as a simple cube for now)
let player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),  // Cube geometry for player
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
scene.add(player);

// Ground (simple road for the city)
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide })
);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// Set up lighting
const light = new THREE.AmbientLight(0x404040);  // Ambient light
scene.add(light);

// Camera position
camera.position.z = 5;

// Game variables
let time = 0; // In-game time (hours)
let money = 0; // Player money
let dayEnded = false; // Flag for day end
let jobSpots = []; // Job locations

// Create simple job spots (e.g., a job could be represented as a small red box)
function createJobSpot(x, z) {
  const jobSpot = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  jobSpot.position.set(x, 0.25, z);
  scene.add(jobSpot);
  jobSpots.push(jobSpot);
}

// Create a few job spots around the map
createJobSpot(10, 10);
createJobSpot(-10, 15);
createJobSpot(20, -5);

// Time system: increment time every second
setInterval(() => {
  if (!dayEnded) {
    time += 1;
    if (time >= 7) {
      dayEnded = true;
      alert("It's 7 PM! Go home to sleep.");
    }
  }
}, 1000); // 1 second = 1 hour

// Player movement
let moveSpeed = 0.1;

function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) player.position.x -= moveSpeed;
  if (keyIsDown(RIGHT_ARROW)) player.position.x += moveSpeed;
  if (keyIsDown(UP_ARROW)) player.position.z -= moveSpeed;
  if (keyIsDown(DOWN_ARROW)) player.position.z += moveSpeed;
}

// Basic job interaction (when near a job spot)
function checkJobInteraction() {
  for (const jobSpot of jobSpots) {
    const distance = player.position.distanceTo(jobSpot.position);
    if (distance < 2) {
      alert("You started a job!");
      money += 10;  // Earn money for starting a job
    }
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  movePlayer();  // Move the player
  checkJobInteraction(); // Check if player interacts with job spots

  controls.update(); // Update the camera controls
  renderer.render(scene, camera); // Render the scene
}

animate();

// Resize handler for responsive design
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Key detection for player movement
let keys = {};
function keyIsDown(key) {
  return keys[key] === true;
}

window.addEventListener('keydown', (e) => {
  keys[e.keyCode] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.keyCode] = false;
});
