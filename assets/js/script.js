import * as THREE from "./build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js"

const canvas = document.querySelector("#canvas");
let cameraMoving = true;
let camera, scene, renderer, controls;
let model1, model2, model3;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const question = document.querySelector("#question");


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

        if(selectedObject.name === "A") {
            selectedObject.material.color.set(0xff0000);
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
    directionalLight.intensity = 12;
    scene.add(directionalLight);

    const ambientlight = new THREE.AmbientLight(0xffffff, 1);
    ambientlight.position.set(0, 0, 0);
    ambientlight.intensity = 1;
    scene.add(ambientlight);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild(renderer.domElement);

    await loadModelGLTF("A").then((resolve) => {
        model1 = resolve;
        
    }).then((resolve) => {
        model2 = resolve;
    });

    scene.add(model1);
   
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
