var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor('#000000');
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

let key;

function keyboardPress(event) {
    key = event.key;
}

function updateCameraPosition() {
    if (key == 'w') {
        camera.position.z += .1;
    } else if (key == 's') {
        camera.position.z -= .1;
    }
}

function line() {
    var points = [];
    for (let i = -10; i < 10; i++) {
        points.push(new THREE.Vector3(i, 0, 0));
    }

    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({color: 0xffffff});
    var line = new THREE.Line(geometry, material);

    scene.add(line);
}

line();

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set(0, 5, 10);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff));

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    updateCameraPosition();
    key = undefined;
}

animate();