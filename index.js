const fs = require('fs')
const { WebGLRenderingContext } = require('gl')
const THREE = require('three')
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader')
const { createCanvas } = require('./canvasGL')

const width = 512
const height = 512;

global.WebGLRenderingContext = WebGLRenderingContext;

const loader = new GLTFLoader();
loader.load('./647425f9fc8790b92687c20c.glb', (gltf) => {
	const scene = new THREE.Scene();
	// scene.background = new THREE.Color('skyblue');
	scene.add(gltf.scene);

	// scene.add(new THREE.AmbientLight(0xdddddd));

	const camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);
	camera.position.set(0, 0, 10)

	camera.lookAt(gltf.scene.position);

	const canvas = createCanvas(width, height);

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		preserveDrawingBuffer: true,
		canvas: canvas,
	});

	renderer.setSize(width, height);

	renderer.render(scene, camera)

	const out = fs.createWriteStream(__dirname + '/out.png');
	canvas.createPNGStream('image/png').pipe(out);
});
