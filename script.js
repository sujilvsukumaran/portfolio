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

    const pointLight = new THREE.PointLight(0xffffff, 2); // Increased intensity
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Load the FBX model
    const loader = new THREE.FBXLoader();
    let model;

    loader.load('assets/models/test.fbx', function(object) {
        model = object;
        scene.add(model);
        model.position.set(0, 0, 0); // Adjust the position if needed
        model.scale.set(0.01, 0.01, 0.01); // Adjust the scale if needed

        // Log materials and textures
        model.traverse(function(child) {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide; // Ensure both sides of the geometry are rendered
                console.log(child.material);
            }
        });

        console.log('Model loaded and added to the scene');
    }, function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, function(error) {
        console.error('An error happened', error);
    });

    camera.position.set(0, 1, 5); // Adjust the camera position
    camera.lookAt(0, 0, 0); // Ensure the camera is looking at the center of the scene

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

    // Event listeners for input changes
    document.getElementById('scale').addEventListener('input', function(event) {
        if (model) {
            const scale = parseFloat(event.target.value);
            model.scale.set(scale, scale, scale);
        }
    });

    document.getElementById('position-x').addEventListener('input', function(event) {
        if (model) {
            const positionX = parseFloat(event.target.value);
            model.position.x = positionX;
        }
    });

    document.getElementById('position-y').addEventListener('input', function(event) {
        if (model) {
            const positionY = parseFloat(event.target.value);
            model.position.y = positionY;
        }
    });

    document.getElementById('position-z').addEventListener('input', function(event) {
        if (model) {
            const positionZ = parseFloat(event.target.value);
            model.position.z = positionZ;
        }
    });
});
