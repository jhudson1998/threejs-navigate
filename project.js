import { PointerLockControls } from './js/PointerLockControls.js';

let camera, scene, renderer, controls;

let objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

let wallHeight;
let wallWidth;
let wallMaterial;
let wallTexture;
let roomWidth;
let roomDepth;
let roomHeight;
let roomMaterials = [];
let texture;
let lightColor = 0xFFFFFF;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.y = 10;
    camera.position.z = 30;

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");

    instructions.addEventListener("click", function() {
        controls.lock();
    });

    controls.addEventListener("lock", function() {
        instructions.style.display = "none";
        blocker.style.display = "none";
    });

    controls.addEventListener("unlock", function() {
        blocker.style.display = "block";
        instructions.style.display = "";
    });

    scene.add(controls.getObject());

    //movement listeners
    const onKeyDown = function ( event ) {
        switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
            case 'Digit1':
                room1Light.visible = !room1Light.visible;
                break;
            case 'Digit2':
                room2Light.visible = !room2Light.visible;
                break;
            case 'Digit3':
                room3Light.visible = !room3Light.visible;
                room3Light2.visible = !room3Light2.visible;
                break;
            case 'PageUp':
                room1Light.color.set(0xFFFFFF);
                break;
            case 'PageDown':
                room1Light.color.set(0xFF0000);
                break;
        }
    };
    //movement listeners
    const onKeyUp = function ( event ) {
        switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );
    
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    //create room1
    roomWidth = 70;
    roomDepth = 70;
    roomHeight = 30;
    for(let i=0; i<6; i++) {
        switch (i) {
            //depth
            case(0):
            case(1):
                texture = new THREE.TextureLoader().load('./img/wallpaper1.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/10, roomHeight/10);
                break;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/ceiling.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/floor.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;

            //width
            case(4):
                continue;
            case(5):
                texture = new THREE.TextureLoader().load('./img/wallpaper1.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;
        }
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    const room1 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room1.position.y = 10;
    scene.add(room1);

    const room1Light = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room1Light.position.y = 15;
    room1Light.position.z = -35;
    scene.add(room1Light);

    const room1Helper = new THREE.PointLightHelper(room1Light, 1);
    scene.add(room1Helper);

    //create room2
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        switch(i) {
            //depth
            case(0):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                opacity: 0,
                transparent: true
            }));
            continue;
            case(1):
                texture = new THREE.TextureLoader().load('./img/wallpaper1.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/10, roomHeight/10);
                break;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/ceiling.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/floor.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;

            //width
            case(4):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;
            case(5):
                texture = new THREE.TextureLoader().load('./img/wallpaper1.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    wallHeight = 30;
    wallWidth = 20;
    wallTexture = new THREE.TextureLoader().load('./img/wallpaper1.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.offset.set(0,0);
    wallTexture.repeat.set(wallWidth/10, wallHeight/10);
    wallMaterial = new THREE.MeshLambertMaterial({map: (wallTexture)})
    
    const room2Wall = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), wallMaterial);
    room2Wall.position.x = 35;
    room2Wall.position.y = 10;
    room2Wall.position.z = -95;
    room2Wall.rotation.y = -Math.PI/2;

    const room2 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room2.position.y = 10;
    room2.position.z = -70;
    scene.add(room2);
    scene.add(room2Wall);

    //create room3
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        switch(i) {
            //depth
            case(0):
                texture = new THREE.TextureLoader().load('./img/wallpaper2.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/10, roomHeight/10);
                break;
            case(1):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/ceiling.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/floor.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;

            //width
            case(4):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;
            case(5):
                texture = new THREE.TextureLoader().load('./img/wallpaper2.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;  
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    wallHeight = 30;
    wallWidth = 20;
    wallTexture = new THREE.TextureLoader().load('./img/wallpaper2.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.offset.set(0,0);
    wallTexture.repeat.set(wallWidth/10, wallHeight/10);
    wallMaterial = new THREE.MeshLambertMaterial({map: (wallTexture)})
    
    const room3Wall = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), wallMaterial);
    room3Wall.position.x = 35;
    room3Wall.position.y = 10;
    room3Wall.position.z = -95;
    room3Wall.rotation.y = Math.PI/2;

    const room3 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room3.position.x = 70;
    room3.position.y = 10;
    room3.position.z = -70;
    scene.add(room3);
    scene.add(room3Wall);

    const room2Light = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room2Light.position.x = 70;
    room2Light.position.y = 15;
    room2Light.position.z = -35;
    scene.add(room2Light);

    //create room4
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        switch(i) {
            //depth
            case(0):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;
            case(1):
                texture = new THREE.TextureLoader().load('./img/wallpaper2.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/10, roomHeight/10);
                break;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/ceiling.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/floor.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;

            //width
            case(4):
                texture = new THREE.TextureLoader().load('./img/wallpaper2.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;
            case(5):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;  
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    wallHeight = 30;
    wallWidth = 20;
    wallTexture = new THREE.TextureLoader().load('./img/wallpaper2.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.offset.set(0,0);
    wallTexture.repeat.set(wallWidth/10, wallHeight/10);
    wallMaterial = new THREE.MeshLambertMaterial({map: (wallTexture)})
    
    const room4Wall = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), wallMaterial);
    room4Wall.position.x = 105;
    room4Wall.position.y = 10;
    room4Wall.position.z = 25;
    room4Wall.rotation.y = -Math.PI/2;

    const room4Wall2 = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), wallMaterial);
    room4Wall2.position.x = 105;
    room4Wall2.position.y = 10;
    room4Wall2.position.z = -25;
    room4Wall2.rotation.y = -Math.PI/2;

    const room4 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room4.position.x = 70;
    room4.position.y = 10;
    scene.add(room4);
    scene.add(room4Wall);
    scene.add(room4Wall2);

    //create room5
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        switch(i) {
            //depth
            case(0):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/10, roomHeight/10);
                break;
            case(1):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/ceiling.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/floor.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;

            //width
            case(4):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;
            case(5):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;  
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    wallHeight = 30;
    wallWidth = 20;
    wallTexture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.offset.set(0,0);
    wallTexture.repeat.set(wallWidth/10, wallHeight/10);
    wallMaterial = new THREE.MeshLambertMaterial({map: (wallTexture)})
    
    const room5Wall = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), wallMaterial);
    room5Wall.position.x = 105;
    room5Wall.position.y = 10;
    room5Wall.position.z = 25;
    room5Wall.rotation.y = Math.PI/2;

    const room5Wall2 = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), wallMaterial);
    room5Wall2.position.x = 105;
    room5Wall2.position.y = 10;
    room5Wall2.position.z = -25;
    room5Wall2.rotation.y = Math.PI/2;

    const room5 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room5.position.x = 140;
    room5.position.y = 10;
    scene.add(room5);
    scene.add(room5Wall);
    scene.add(room5Wall2);

    const room3Light = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room3Light.position.x = 140;
    room3Light.position.y = 15;
    scene.add(room3Light);

    //create room6
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        switch(i) {
            //depth
            case(0):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/10, roomHeight/10);
                break;
            case(1):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/ceiling.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/floor.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;

            //width
            case(4):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;
            case(5):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;  
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    const room6 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room6.position.x = 140;
    room6.position.y = 10;
    room6.position.z = 70;
    scene.add(room6);

    //create room7
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        switch(i) {
            //depth
            case(0):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;
            case(1):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/10, roomHeight/10);
                break;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/ceiling.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/floor.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomDepth/10);
                break;

            //width
            case(4):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;
            case(5):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.jpg');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/10, roomHeight/10);
                break;
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    const room7 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    room7.position.x = 70;
    room7.position.y = 10;
    room7.position.z = 70;
    scene.add(room7);

    const room3Light2 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room3Light2.position.x = 70;
    room3Light2.position.y = 15;
    room3Light2.position.z = 70;
    scene.add(room3Light2);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();

    if(controls.isLocked === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const delta = (time-prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize();

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
    }
    prevTime = time;

    renderer.render(scene, camera);
}