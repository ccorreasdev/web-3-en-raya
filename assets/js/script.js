import * as THREE from "./build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js"
import { OrbitControls } from './jsm/controls/OrbitControls.js';

const canvas = document.querySelector("#canvas");
let cameraMoving = true;
let selectedFichaIndex = -1;
let positionFichaBoard = -1;
let actualPositionFicha = -1;
let selectedFichaIndex2 = -1;
let camera, scene, renderer, controls;
let model1, model2, model3;
let fichasPlayer1 = [];
let fichasPlayer2 = [];
let selectedFichaP1;
let ficha11, ficha12, ficha13;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const question = document.querySelector("#question");
const board = new Array(3).fill(null).map(() => new Array(3).fill(0));

for(let i=0; i< 3; i++){
    for(let j=0; j<3; j++){
        board[i][j] = 0;
    }
}

console.log(board);

const onWindowResize = () => {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

};


const selectionFicha = ()=> {

    fichasPlayer1.forEach((ficha)=> {
        ficha.scale.set(1,1,1);
    });

    fichasPlayer2.forEach((ficha)=> {
        ficha.scale.set(1,1,1);
    })

    if(selectedFichaIndex <3) {
        fichasPlayer1[selectedFichaIndex].scale.set(1.2,1.2,1.2);
    }

    if(selectedFichaIndex>= 3){
        fichasPlayer2[selectedFichaIndex-3].scale.set(1.2,1.2,1.2);
    }
   
}


const updateBoard = ()=>{

    console.log(selectedFichaIndex, positionFichaBoard);



    if(selectedFichaIndex < 3){

        if(actualPositionFicha == 0){
            board[0][0] = 0; 
        }
        if(actualPositionFicha == 1){
            board[0][1] = 0; 
        }

        if(positionFichaBoard == 0){
            board[0][0] = 1; 
        }
        if(positionFichaBoard == 1){
            board[0][1] = 1; 
        }
        if(positionFichaBoard == 2){
            board[0][2] = 1; 
        }
        if(positionFichaBoard == 3){
            board[1][0] = 1; 
        }
        if(positionFichaBoard == 4){
            board[1][1] = 1; 
        }
        if(positionFichaBoard == 5){
            board[1][2] = 1; 
        }
        if(positionFichaBoard == 6){
            board[2][0] = 1; 
        }
        if(positionFichaBoard == 7){
            board[2][1] = 1; 
        }
        if(positionFichaBoard == 8){
            board[2][2] = 1; 
        }
     
    }

    console.log("ACTUAL POSITION: ", actualPositionFicha);
    console.log("BOARD: ", board);

}

const onMouseClick = (event)=> {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
   
    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        console.log(selectedObject)

        // Buscar la ficha seleccionada en la matriz de fichas
       
        for (let i = 0; i < fichasPlayer1.length; i++) {
            const group = fichasPlayer1[i];
            if (group.type === "Group" && group.children.includes(selectedObject)) {
                selectedFichaIndex = i;
                console.log(group);
                break;
            }
        }

        for (let i = 0; i < fichasPlayer2.length; i++) {
            const group = fichasPlayer2[i];
            if (group.type === "Group" && group.children.includes(selectedObject)) {
                selectedFichaIndex = i+3;
                console.log(group);
                break;
            }
        }


        console.log("Ficha index: ", selectedFichaIndex);


        if(positionFichaBoard != -1) {
            actualPositionFicha = positionFichaBoard;
        }

        positionFichaBoard = -1;

        // Lograr que la ficha seleccionada se eleve o se mueva
        if (selectedFichaIndex !== -1) {
          

            if(selectedFichaIndex < 3) {
                if(selectedObject.name === "topleft" && board[0][0] == 0) {
                    positionFichaBoard = 0;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: -5.25, y: 5, z: -0.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "topcenter") {
                    positionFichaBoard = 1;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: 0, y: 5.25, z: -0.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "topright") {
                    positionFichaBoard = 2;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: 5.25, y: 5.25, z: -0.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "centerleft") {
                    positionFichaBoard = 3;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: -5.25, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "centercenter") {
                    positionFichaBoard = 4;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: 0, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "centerright") {
                    positionFichaBoard = 5;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: 5.25, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "bottomleft") {
                    positionFichaBoard = 6;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: -5.25, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "bottomcenter") {
                    positionFichaBoard = 7;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: 0, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "bottomright") {
                    positionFichaBoard = 8;
                    gsap.to(fichasPlayer1[selectedFichaIndex].position, { x: 5.25, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
                }
            }

            


            if(selectedFichaIndex >= 3) {
                if(selectedObject.name === "topleft") {
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: -5.25, y: 5, z: -0.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "topcenter") {
        
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: 0, y: 5.25, z: -0.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "topright") {
        
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: 5.25, y: 5.25, z: -0.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "centerleft") {
    
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: -5.25, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "centercenter") {
        
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: 0, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "centerright") {
        
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: 5.25, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "bottomleft") {
        
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: -5.25, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "bottomcenter") {
        
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: 0, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
                }
        
                if(selectedObject.name === "bottomright") {
        
                    gsap.to(fichasPlayer2[selectedFichaIndex-3].position, { x: 5.25, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
                }
            }




       
        }
     



     

        selectionFicha();
        updateBoard();
       
    }
}

const loadModelGLTF = (modelURL, index=0) => {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            `./assets/models/${modelURL}/scene.gltf`,
            function (gltf) {
                const objectGroup = gltf.scene;
                objectGroup.userData.index = index; // Asignar valor personalizado
                resolve(objectGroup);
            },
            function (xhr) {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                // console.log('An error happened', error);
                reject(error);
            }
        );
    });
};


const init = async () => {
    window.addEventListener("resize", onWindowResize);
    window.addEventListener('click', onMouseClick);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 24);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 2000, 1000);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.intensity = 5;
    scene.add(directionalLight);

    const ambientlight = new THREE.AmbientLight(0xffffff, 1);
    ambientlight.position.set(0, 0, 0);
    ambientlight.intensity = 1;
    scene.add(ambientlight);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild(renderer.domElement);

    for(let i=0; i<3; i++){
      
        await loadModelGLTF("ficha1", i).then((resolve) => {
            fichasPlayer1.push(resolve);
        });
        await loadModelGLTF("ficha2", i+3).then((resolve) => {
            fichasPlayer2.push(resolve);
        });

        fichasPlayer1[i].rotation.x = (65 * Math.PI) / 180;
        fichasPlayer2[i].rotation.x = (65 * Math.PI) / 180;

        fichasPlayer1[i].position.set(-14 + (i* 2.2),-10,2);
        scene.add(fichasPlayer1[i]);

        fichasPlayer2[i].position.set(10 + (i* 2.2),-10,2);
        scene.add(fichasPlayer2[i]);
       
    }

   
    //console.log(fichasPlayer1);

    await loadModelGLTF("board").then((resolve) => {
        model1 = resolve;
        return loadModelGLTF("ficha1")
    })



    await loadModelGLTF("board").then((resolve) => {
        model1 = resolve;
        return loadModelGLTF("ficha1")
    }).then((resolve) => {
        ficha11 = resolve;
    });

    model1.rotation.x = (-25 * Math.PI) / 180;
    model1.rotation.y = (-90 * Math.PI) / 180;
    model1.scale.set(1.5,1.5,1.5);
    scene.add(model1);

    // ficha11.position.set(0,0.5,2);
    // ficha11.scale.set(1.5,1.5,1.5);
    //ficha11.rotation.x = (65 * Math.PI) / 180;
    // ficha11.rotation.y = (-90 * Math.PI) / 180;
    // scene.add(ficha11);


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // suaviza el movimiento de la cámara
    controls.dampingFactor = 0.25; // velocidad de suavizado

   
};

const render = () => {
    renderer.render(scene, camera);
};

const animate = () => {
    requestAnimationFrame(animate);    
    render();
};

init();
animate();
