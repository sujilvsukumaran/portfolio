document.addEventListener('DOMContentLoaded', function() {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 400);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    // Create a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Log to ensure everything is set up correctly
    console.log('Scene:', scene);
    console.log('Camera:', camera);
    console.log('Renderer:', renderer);
    console.log('Cube:', cube);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Rotation logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    renderer.domElement.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            cube.rotation.y += deltaMove.x * 0.01;
            cube.rotation.x += deltaMove.y * 0.01;

            previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        }
    });

    renderer.domElement.addEventListener('mouseup', function() {
        isDragging = false;
    });

    renderer.domElement.addEventListener('mouseleave', function() {
        isDragging = false;
    });
});
