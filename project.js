//setup scene and cameras
const scene = new THREE.Scene();
const cameraP = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000
);

//initialize camera as projection
let camera = cameraP;

//setup WebGL renderer
const renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;

//create light
const light = new THREE.AmbientLight( 0x404040 );
//const light = new THREE.DirectionalLight('white', 8);
//light.position.set(0,0,10);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//create floor and set position/texture
const floorTexture = new THREE.TextureLoader().load('./img/floor.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
const floorMaterial = new THREE.MeshLambertMaterial({map: floorTexture});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(5,5), floorMaterial);
floor.material.side = THREE.DoubleSide;

camera.position.z = 5;

//add all objects/lights to scene
scene.add(camera);
scene.add(light);
scene.add(floor);

//handle window resizing dynamically
function onWindowResize() {
    //change aspect of projection camera
	cameraP.aspect = window.innerWidth / window.innerHeight;
    //update projection camera
	cameraP.updateProjectionMatrix();
    //update WebGL renderer size
	renderer.setSize(window.innerWidth, window.innerHeight);
}

//animation function called during refresh cycle
function animate() {

    requestAnimationFrame(animate);
    //render all updated objects
    renderer.render(scene, camera);
}

//start animation loop
animate();

//add event listener for window resize
window.addEventListener('resize', onWindowResize, false);

