import { PointerLockControls } from './js/PointerLockControls.js';

//instantiate global variables

let camera, scene, renderer, controls;

let objects = [];
let raycaster;
let ray;
let cameraDir = new THREE.Vector3();

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let pointer, isShift, raycast = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

let sun, earth, moon;
let cubeGuide, cubePlace, cubePlane;

let wallHeight;
let wallWidth;
let wallMaterial;
let wallTexture;

let cubeGuideMaterial;
let cubePlaceMaterial;
let cubePlaceGeo;
let cubePlaneGeo;

let mirrorSphere, mirrorSphereCamera, mirrorSphereMaterial, cubeRenderTarget;
let mirrorSquare, mirrorSquareCamera, mirrorSquareMaterial, cubeRenderTarget1;
let mirrorTorus, mirrorTorusCamera, mirrorTorusMaterial, cubeRenderTarget2;
let mirrorSquareSpeed = 0.01;
let mirrorTorusSpeed = 0.01;
let mirrorSphereOrbit;
let offset;

let roomWidth;
let roomDepth;
let roomHeight;
let roomMaterials = [];
let texture;
let lightColor = 0xFFFFFF;

let hiddenDoor;

init();
animate();

//initialization of everything to be used in scene
function init() {
    //initialize a new scene and set its background color
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    //initialize new perspective camera
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.y = 10;
    camera.position.z = 0;

    //add controls to camera
    controls = new PointerLockControls(camera, document.body);

    //some HTML visual elements to give instructions
    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");

    //lock controls to mouse
    instructions.addEventListener("click", function() {
        controls.lock();
    });

    //get rid of HTML instruction elements
    controls.addEventListener("lock", function() {
        instructions.style.display = "none";
        blocker.style.display = "none";
    });

    //bring back HTML instruction elements
    controls.addEventListener("unlock", function() {
        blocker.style.display = "block";
        instructions.style.display = "";
    });

    scene.add(controls.getObject());

    //listeners for all inputs
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
                room1Light1.visible = !room1Light1.visible;
                room1Light2.visible = !room1Light2.visible;
                break;
            case 'Digit2':
                room2Light1.visible = !room2Light1.visible;
                room2Light2.visible = !room2Light2.visible;
                break;
            case 'Digit3':
                room3Light1.visible = !room3Light1.visible;
                room3Light2.visible = !room3Light2.visible;
                room3Light3.visible = !room3Light3.visible;
                break;
            case 'PageUp':
                room1Light1.color.set(0xFFFFFF);
                room1Light2.color.set(0xFFFFFF);
                room2Light1.color.set(0xFFFFFF);
                room2Light2.color.set(0xFFFFFF);
                break;
            case 'PageDown':
                room1Light1.color.set(0x00FF00);
                room1Light2.color.set(0x00FF00);
                room2Light1.color.set(0x00FF00);
                room2Light2.color.set(0x00FF00);
                break;
            case 'KeyP':
                raycast = !raycast;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                isShift = true;
                break;
            case 'Equal':
                mirrorSquareSpeed += 0.01;
                mirrorTorusSpeed += 0.01;
                offset += 0.001;
                break;
            case 'Minus':
                mirrorSquareSpeed -= 0.01;
                mirrorTorusSpeed -= 0.01;
                offset -= 0.001;
                break;
            case 'KeyH':
                headlamp.visible = !headlamp.visible;
                break;
        }
    };
    //listeners for all inputs
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
            case 'ShiftLeft':
            case 'ShiftRight':
                isShift = false;
                break;
        }
    };

    //add listeners for inputs
    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );
    
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 100 );

    //create room1
    roomWidth = 70;
    roomDepth = 70;
    roomHeight = 30;
    for(let i=0; i<6; i++) {
        //add materials for appropriate faces on inside of room to roomMaterials
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
                texture = new THREE.TextureLoader().load('./img/ceiling.jpeg');
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

    //add room1 and lights
    const room1 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room1.position.y = 10;
    scene.add(room1);

    const room1Light1 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room1Light1.position.y = 15;
    room1Light1.castShadow = true;
    scene.add(room1Light1);

    const room1Light2 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room1Light2.position.y = 15;
    room1Light2.position.z = -70;
    room1Light2.castShadow = true;
    scene.add(room1Light2);

    //create room2
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        //add materials for appropriate faces on inside of room to roomMaterials
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
                texture = new THREE.TextureLoader().load('./img/ceiling.jpeg');
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

    //add room2 and extra walls
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
        //add materials for appropriate faces on inside of room to roomMaterials
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
                texture = new THREE.TextureLoader().load('./img/ceiling.jpeg');
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

    //add room3, extra walls and lights
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

    const room2Light1 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room2Light1.position.x = 70;
    room2Light1.position.y = 15;
    room2Light1.position.z = -70;
    room2Light1.castShadow = true;
    scene.add(room2Light1);

    const room2Light2 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room2Light2.position.x = 70;
    room2Light2.position.y = 15;
    room2Light2.castShadow = true;
    scene.add(room2Light2);

    //create room4
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        //add materials for appropriate faces on inside of room to roomMaterials
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
                texture = new THREE.TextureLoader().load('./img/ceiling.jpeg');
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

    //add room4 and extra walls
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
        //add materials for appropriate faces on inside of room to roomMaterials
        switch(i) {
            //depth
            case(0):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/35, roomHeight/35);
                break;
            case(1):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/35, roomHeight/35);
                break;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomDepth/35);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomDepth/35);
                break;

            //width
            case(4):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;
            case(5):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomHeight/35);
                break;  
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    //add room5
    const room5 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    roomMaterials = [];
    room5.position.x = 140;
    room5.position.y = 10;
    scene.add(room5);

    //create room6
    roomWidth = 70;
    roomDepth = 70;
    for(let i=0; i<6; i++) {
        //add materials for appropriate faces on inside of room to roomMaterials
        switch(i) {
            //depth
            case(0):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/35, roomHeight/35);
                break;
            case(1):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomDepth/35);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomDepth/35);
                break;

            //width
            case(4):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomHeight/35);
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

    //add room6
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
        //add materials for appropriate faces on inside of room to roomMaterials
        switch(i) {
            //depth
            case(0):
                roomMaterials.push(new THREE.MeshLambertMaterial({
                    opacity: 0,
                    transparent: true
                }));
                continue;
            case(1):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomDepth/35, roomHeight/35);
                break;

            //floor&ceiling
            case(2):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomDepth/35);
                break;
            case(3):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomDepth/35);
                break;

            //width
            case(4):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomHeight/35);
                break;
            case(5):
                texture = new THREE.TextureLoader().load('./img/wallpaper3.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0,0);
                texture.repeat.set(roomWidth/35, roomHeight/35);
                break;
        }
        console.log(i);
        roomMaterials.push(new THREE.MeshLambertMaterial({
            map: (texture), side: THREE.BackSide
        }));
    }

    //add room7 and lights
    const room7 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth), roomMaterials);
    room7.position.x = 70;
    room7.position.y = 10;
    room7.position.z = 70;
    scene.add(room7);

    const room3Light1 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room3Light1.position.x = 140;
    room3Light1.position.y = 15;
    room3Light1.castShadow = true;
    scene.add(room3Light1);

    const room3Light2 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room3Light2.position.x = 70;
    room3Light2.position.y = 15;
    room3Light2.position.z = 70;
    room3Light2.castShadow = true;
    scene.add(room3Light2);

    const room3Light3 = new THREE.PointLight(0xFFFFFF, 3, 100, 2);
    room3Light3.position.x = 140;
    room3Light3.position.y = 15;
    room3Light3.position.z = 70;
    room3Light3.castShadow = true;
    scene.add(room3Light3);

    //create sun
    let sunTexture = new THREE.TextureLoader().load('./img/sun.jpg');
    sunTexture.wrapS = THREE.RepeatWrapping;
    sunTexture.wrapT = THREE.RepeatWrapping;
    sunTexture.offset.set(0,0);

    let sunMaterial = new THREE.MeshLambertMaterial({map:(sunTexture)});

    sun = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 32), sunMaterial);
    sun.position.x = 140;
    sun.position.y = 5;
    sun.position.z = 70;
    sun.castShadow = true;
    scene.add(sun);

    //create earth
    let earthTexture = new THREE.TextureLoader().load('./img/earth.png');
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.RepeatWrapping;
    earthTexture.offset.set(0,0);

    let earthMaterial = new THREE.MeshLambertMaterial({map:(earthTexture)});

    earth = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), earthMaterial);
    earth.position.x = 120;
    earth.position.y = 5;
    earth.position.z = 70;
    earth.castShadow = true;
    scene.add(earth);

    //create moon
    let moonTexture = new THREE.TextureLoader().load('./img/moon.jpg');
    moonTexture.wrapS = THREE.RepeatWrapping;
    moonTexture.wrapT = THREE.RepeatWrapping;
    moonTexture.offset.set(0,0);
    
    let moonMaterial = new THREE.MeshLambertMaterial({map:(moonTexture)});

    moon = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), moonMaterial);
    moon.position.x = 113;
    moon.position.y = 5;
    moon.position.z = 70;
    moon.castShadow = true;
    scene.add(moon);

    //interactive grid builder
    let grid = new THREE.GridHelper(70, 35);
    grid.rotation.y = Math.PI/2;
    grid.rotation.z = Math.PI/2;
    grid.position.x = 70;
    grid.position.z = -105;
    scene.add(grid);

    //red guide block on grid
    cubeGuideMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, opacity: 0.3, transparent: true});
    cubeGuide = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), cubeGuideMaterial);
    cubeGuide.position.x = 70;
    cubeGuide.position.y = 10;
    cubeGuide.position.z = -104;
    scene.add(cubeGuide);

    //block to be placed on grid
    cubePlaceMaterial = new THREE.MeshLambertMaterial({map:(new THREE.TextureLoader().load('./img/box.png'))});
    cubePlaceGeo = new THREE.BoxGeometry(2,2,2);

    //detection plane on grid
    cubePlaneGeo = new THREE.PlaneGeometry(70, 30);
    cubePlane = new THREE.Mesh(cubePlaneGeo, new THREE.MeshBasicMaterial({visible: false}));
    cubePlane.position.x = 70;
    cubePlane.position.y = 10;
    cubePlane.position.z = -105;
    scene.add(cubePlane);
    objects.push(cubePlane);

    //pointer for storing relative mouse position on screen
    pointer = new THREE.Vector2();

    //mouse click listener for building game
    document.addEventListener('pointerdown', onPointerDown);

    //set up reflective sphere
    cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, {
        format: THREE.RGBFormat, 
        generateMipmaps: true, 
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding
    } );
    mirrorSphereCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
    scene.add(mirrorSphereCamera);
    mirrorSphereMaterial = new THREE.MeshBasicMaterial({
        envMap: cubeRenderTarget.texture,
        combine: THREE.MultiplyOperation,
        reflectivity: 1
    });
    mirrorSphere = new THREE.Mesh((new THREE.IcosahedronGeometry(5, 8)), mirrorSphereMaterial);
    mirrorSphere.position.set(0, 20, -90);
    mirrorSphereCamera.position.set(0,10,-90);
    console.log(mirrorSphere);
    scene.add(mirrorSphere);

    //variables for controlling mirror translation
    mirrorSphereOrbit = new THREE.Vector3(0, 10, -90);
    offset = 0.001;

    //set up reflective square
    cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget( 512, {
        format: THREE.RGBFormat, 
        generateMipmaps: true, 
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding
    } );
    mirrorSquareCamera = new THREE.CubeCamera(1,1000,cubeRenderTarget1);
    scene.add(mirrorSquareCamera);
    mirrorSquareMaterial = new THREE.MeshBasicMaterial({
        envMap: cubeRenderTarget1.texture,
        combine: THREE.MultiplyOperation,
        reflectivity: 1
    });
    mirrorSquare = new THREE.Mesh((new THREE.BoxGeometry(20,20,2)), mirrorSquareMaterial);
    mirrorSquare.rotation.y = -Math.PI/2;
    mirrorSquare.position.set(-34, 10, -35);
    mirrorSquareCamera.position.set(-30, 10, -35);
    scene.add(mirrorSquare);

    //set up reflective torus
    cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget( 512, {
        format: THREE.RGBFormat, 
        generateMipmaps: true, 
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding
    } );
    mirrorTorusCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget2);
    scene.add(mirrorTorusCamera);
    mirrorTorusMaterial = new THREE.MeshBasicMaterial({
        envMap: cubeRenderTarget2.texture,
        combine: THREE.MultiplyOperation,
        reflectivity: 1
    });
    mirrorTorus = new THREE.Mesh((new THREE.TorusKnotGeometry(7, 3, 100, 16)), mirrorTorusMaterial);
    mirrorTorus.position.y = 10;
    mirrorTorus.position.z = 25;
    scene.add(mirrorTorus);

    //create light that will be attached to camera (headlamp)
    let headlamp = new THREE.PointLight(0xffffff, 2, 50);
    headlamp.visible = false;
    camera.add(headlamp);
    scene.add(camera);

    //create hidden door
    wallTexture = new THREE.TextureLoader().load('./img/wallpaper2.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.offset.set(0,0);
    wallTexture.repeat.set(3, 3);
    wallMaterial = new THREE.MeshLambertMaterial({map: (wallTexture)})
    
    hiddenDoor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), wallMaterial);
    hiddenDoor.position.x = 105;
    hiddenDoor.position.y = 10;
    hiddenDoor.position.z = 0;
    hiddenDoor.rotation.y = -Math.PI/2;
    scene.add(hiddenDoor);

    //set up renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shandowMapSoft = true;
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

//mouse click logic for building game
function onPointerDown(event) {
    //get array of intersected objects
    const intersects = raycaster.intersectObjects(objects);
    if(intersects.length > 0) {
        //get closest intersected object to player
        const intersect = intersects[0];
        //if shift is held (break block on click)
        if(isShift) {
            if(intersect.object !== cubePlane) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object),1);
            }
        }

        //if shift isn't held (render new block on click)
        else {
            const newCube = new THREE.Mesh(cubePlaceGeo, cubePlaceMaterial);
            newCube.position.copy(intersect.point).add(intersect.face.normal);
            newCube.position.divideScalar(2).floor().multiplyScalar(2).addScalar(2);
            newCube.position.z -= 2;
            scene.add(newCube);
            objects.push(newCube);
            //open hidden door on placement of first block
            if(hiddenDoor.visible) {
                hiddenDoor.visible = false;
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    //get timings for orbit speeds
    const time = performance.now();
    const nowEarth = Date.now() * 0.001;
    const nowMoon = Date.now() * 0.005;
    const nowMirror = Date.now() * offset;

    //earth orbit
    earth.position.set(
        Math.cos(nowEarth) * 20 + sun.position.x,
        sun.position.y,
        Math.sin(nowEarth) * 20 + sun.position.z
    );

    //moon orbit
    moon.position.set(
        Math.cos(nowMoon) * 10 + earth.position.x,
        sun.position.y,
        Math.sin(nowMoon) * 10 + earth.position.z
    );

    //reflective sphere movement
    mirrorSphere.position.set(
        Math.cos(nowMirror) * 10,
        Math.sin(nowMirror) * 10 + 10,
        -90
    );

    //reflective sphere
    mirrorSphere.visible = false;
    mirrorSphereCamera.update(renderer, scene);
    mirrorSphere.visible = true;

    //reflective square movement
    mirrorSquare.rotation.x += mirrorSquareSpeed;
    mirrorSquareCamera.rotation.x -= mirrorSquareSpeed;

    //reflective square
    mirrorSquare.visible = false;
    mirrorSquareCamera.update(renderer, scene);
    mirrorSquare.visible = true;

    //reflective torus movement
    mirrorTorus.rotation.z += mirrorTorusSpeed;

    //reflective torus
    mirrorTorus.visible = false;
    mirrorTorusCamera.update(renderer, scene);
    mirrorTorus.visible = true;

    //logic for keyboard+mouse movement
    if(controls.isLocked === true) {
        let playerPos = controls.getObject().position;
        let playerDirection = controls.getObject().getWorldDirection(cameraDir);
        playerDirection.normalize();

        raycaster.set(playerPos, playerDirection);

        let startOfRay = new THREE.Vector3(playerPos.x, playerPos.y-2, playerPos.z);

        scene.remove(ray);
        //drawing of rays (not used anymore, just for testing purposes)
        if(raycast) {
            let rayDist = 100;
            let endOfRay = new THREE.Vector3();
            endOfRay.addVectors(startOfRay, playerDirection.multiplyScalar(rayDist));
            let rayPoints = [];
            rayPoints.push(startOfRay);
            rayPoints.push(endOfRay);

            let rayGeo = new THREE.BufferGeometry().setFromPoints(rayPoints);
            let rayMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
            ray = new THREE.Line(rayGeo, rayMaterial);
            //scene.add(ray);

            const intersects = raycaster.intersectObjects(objects);
            if(intersects.length > 0) {
                const intersect = intersects[0];
                cubeGuide.position.copy(intersect.point).add(intersect.face.normal);
                cubeGuide.position.divideScalar(2).floor().multiplyScalar(2).addScalar(2);
                cubeGuide.position.z -= 2;
            }
        }

        const delta = (time-prevTime) / 1000;

        //set velocity based on time spent moving
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;

        //set direction based on keys pressed
        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize();

        //set x and z direction velocities
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        //issue movement command
        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
    }
    prevTime = time;

    renderer.render(scene, camera);
}