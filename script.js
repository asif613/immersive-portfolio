// Setup Three.js Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Complex 3D Wireframe Tower Structure
const towerGroup = new THREE.Group();
const levels = 22;
const radius = 2.8;

for (let i = 0; i < levels; i++) {
    const geometry = new THREE.CylinderGeometry(radius, radius, 0.8, 16, 1, true);
    const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00ffff : 0x7b2cbf,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = (i - levels / 2) * 1.1;
    cylinder.rotation.y = i * 0.3;
    towerGroup.add(cylinder);

    if (i % 2 === 0) {
        const boxGeo = new THREE.BoxGeometry(0.8, 0.5, 1.8);
        const boxMat = new THREE.MeshBasicMaterial({
            color: 0x00d2ff,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(radius + 0.5, (i - levels / 2) * 1.1, 0);
        towerGroup.add(box);
    }
}

// Create Larger Rotating Project Cards
const cardGroup = new THREE.Group();
const cardData = [
    { tag: "WEB • DESIGN", title: "Cinematic Portfolio" },
    { tag: "AI • SECURITY", title: "AI Phishing Detection" },
    { tag: "GAME • CSAG", title: "Cyber Security Game" },
    { tag: "CLOUD", title: "Cloud Drive Storage" },
    { tag: "DASHBOARD", title: "Analytics Interface" }
];

const cardRadius = 4.8; // Thoda aur baahar ki taraf

cardData.forEach((data, i) => {
    // Card size bada kiya yahan (Width: 3.6, Height: 2.2)
    const cardGeo = new THREE.PlaneGeometry(3.6, 2.2);
    
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4a0e85');
    gradient.addColorStop(1, '#1b063b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(data.tag, 50, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial';
    ctx.fillText(data.title, 50, 190);

    const texture = new THREE.CanvasTexture(canvas);
    const cardMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
    });

    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    
    const angle = (i / cardData.length) * Math.PI * 2;
    cardMesh.position.x = Math.cos(angle) * cardRadius;
    cardMesh.position.z = Math.sin(angle) * cardRadius;
    cardMesh.position.y = (i - cardData.length / 2) * 2.8;
    
    cardMesh.rotation.y = -angle + Math.PI / 2;
    cardGroup.add(cardMesh);
});

towerGroup.add(cardGroup);
scene.add(towerGroup);

// Create Background Star Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 900;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 40;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 12;

// Scroll & Mouse Interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    towerGroup.rotation.y = elapsedTime * 0.12 + scrollY * 0.0018;
    towerGroup.position.y = scrollY * 0.0025;

    particlesMesh.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});