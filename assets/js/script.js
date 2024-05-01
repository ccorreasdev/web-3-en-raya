import * as THREE from "./build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js"
import { OrbitControls } from './jsm/controls/OrbitControls.js';

const canvas = document.querySelector("#canvas");
let cameraMoving = true;
let camera, scene, renderer, controls;
let model1, model2, model3;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const question = document.querySelector("#question");
const board = new Array(3).fill(null).map(() => new Array(3).fill(false));

for(let i=0; i< 3; i++){
    for(let j=0; j<3; j++){
        board[i][j] = false;
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



const onMouseClick = (event)=> {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
   
    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        if(selectedObject.name === "topleft") {
            gsap.to(model2.position, { x: -5.25, y: 5, z: -0.5 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "topcenter") {

            gsap.to(model2.position, { x: 0, y: 5.25, z: -0.5 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "topright") {

            gsap.to(model2.position, { x: 5.25, y: 5.25, z: -0.5 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "centerleft") {

            gsap.to(model2.position, { x: -5.25, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "centercenter") {

            gsap.to(model2.position, { x: 0, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "centerright") {

            gsap.to(model2.position, { x: 5.25, y: 0.5, z: 2 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "bottomleft") {

            gsap.to(model2.position, { x: -5.25, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "bottomcenter") {

            gsap.to(model2.position, { x: 0, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
        }

        if(selectedObject.name === "bottomright") {

            gsap.to(model2.position, { x: 5.25, y: -4, z: 4.5 , duration: 1, ease: "power2.out" });
        }


        
        console.log(selectedObject);
    }
}

const loadModelGLTF = (modelURL) => {
    const loader = new GLTFLoader();
    let objectGroup = new THREE.Group();

    return new Promise((resolve, reject) => {
        loader.load(
            `../assets/models/${modelURL}/scene.gltf`,
            function (gltf) {
                const container = new THREE.Group();
                container.add(gltf.scene);
                objectGroup = container;
                resolve(objectGroup);
            },
            function (xhr) {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                //console.log('An error happened', error);
            }
        );
    })
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

    await loadModelGLTF("board").then((resolve) => {
        model1 = resolve;
        return loadModelGLTF("ficha1")
    }).then((resolve) => {
        model2 = resolve;
    });

    model1.rotation.x = (-25 * Math.PI) / 180;
    model1.rotation.y = (-90 * Math.PI) / 180;
    model1.scale.set(1.5,1.5,1.5);
    scene.add(model1);

    model2.position.set(0,0.5,2);
    model2.scale.set(1.5,1.5,1.5);
    model2.rotation.x = (65 * Math.PI) / 180;
    model2.rotation.y = (-90 * Math.PI) / 180;
    scene.add(model2);


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
