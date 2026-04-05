import * as THREE from 'three';

export function initThreeBackground() {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050A, 0.05); // Match the dark background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Geometry Generation
    const group = new THREE.Group();
    scene.add(group);

    // Create a variety of abstract floating shapes
    const geometries = [
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.TorusGeometry(1, 0.4, 16, 32),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.TetrahedronGeometry(1.5, 0)
    ];

    const materials = [
        new THREE.MeshStandardMaterial({
            color: 0x00F0FF, // Cyan
            wireframe: true,
            transparent: true,
            opacity: 0.3
        }),
        new THREE.MeshStandardMaterial({
            color: 0x7000FF, // Purple
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.7
        }),
       new THREE.MeshStandardMaterial({
            color: 0x222233, // Dark accent
            roughness: 0.1,
            metalness: 0.9,
        })
    ];

    const meshes = [];

    // Add random floating objects
    for (let i = 0; i < 40; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 40;
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = (Math.random() - 0.5) * 20 - 5;

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        const scale = Math.random() * 0.8 + 0.2;
        mesh.scale.set(scale, scale, scale);

        // Store rotation speed
        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.01,
            rotY: (Math.random() - 0.5) * 0.01
        };

        group.add(mesh);
        meshes.push(mesh);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00F0FF, 50, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7000FF, 50, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Target rotation based on mouse position
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Smoothly interpolate group rotation
        group.rotation.x += 0.05 * (targetY - group.rotation.x);
        group.rotation.y += 0.05 * (targetX - group.rotation.y);

        // Slowly move group up and down
        group.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

        // Rotate individual meshes
        meshes.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotX;
            mesh.rotation.y += mesh.userData.rotY;
        });

        renderer.render(scene, camera);
    }

    animate();
}
