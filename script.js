document.addEventListener('DOMContentLoaded', function() {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 400);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Load the FBX model
    const loader = new THREE.FBXLoader();
    loader.load('assets/models/test.fbx', function(object) {
        scene.add(object);
        object.position.set(0, 0, 0); // Adjust the position if needed
        object.scale.set(0.1, 0.1, 0.1); // Adjust the scale if needed

        // Log materials and textures
        object.traverse(function(child) {
            if (child.isMesh) {
                console.log(child.material);
            }
        });

    }, undefined, function(error) {
        console.error(error);
    });

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Rotation logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = { x: 0, y: 0 };

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

            rotationSpeed.y = deltaMove.x * 0.01;
            rotationSpeed.x = deltaMove.y * 0.01;

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

    function rotateModel() {
        if (!isDragging) {
            scene.rotation.y += rotationSpeed.y;
            scene.rotation.x += rotationSpeed.x;

            // Slow down the rotation over time (damping)
            rotationSpeed.x *= 0.95;
            rotationSpeed.y *= 0.95;
        }
    }

    // Update loop
    function update() {
        requestAnimationFrame(update);
        rotateModel();
    }
    update();

    // Adjust camera aspect ratio and renderer size on window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / 400;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, 400);
    });
});
