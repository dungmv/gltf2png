import express from 'express'
import { WebGLRenderingContext } from 'gl'
import { Scene, AmbientLight, PerspectiveCamera, WebGLRenderer, Texture, TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { createCanvas } from './canvasGL/index.js'
import { JSDOM } from 'jsdom'
import { Blob } from 'node:buffer'
import multer from 'multer'
import { readFile, readFileSync } from 'node:fs'

const width = 512
const height = 512;

const { window: JSDOMWindow } = new JSDOM(
	'<!DOCTYPE html><html><body></body></html>',
	{
	  resources: 'usable',
	//   needed for `requestAnimationFrame`
	//   pretendToBeVisual: true,
	}
);

global.WebGLRenderingContext = WebGLRenderingContext;
global.document = JSDOMWindow.document;
global.self = JSDOMWindow.self;
global.self.URL = URL;
global.Blob = Blob;

global.self.URL.createObjectURL = (blob) => {
    return new Promise(resolve => {
        blob.arrayBuffer().then(buffer => {
            const base64 = new Buffer.from(buffer).toString('base64');
            const completedURI = `data:image/png;base64,` + base64;
            resolve(completedURI);
        });
    })
};

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/', upload.single('file'),  async(req, res) => {
	const gltfLoader = new GLTFLoader();
	const gltf = await gltfLoader.parseAsync(req.file.buffer.buffer, '');

	const scene = new Scene();

	const d = readFileSync('./asset/rectangle_10657.png')
	const base64 = new Buffer.from(d.buffer).toString('base64');
	const completedURI = `data:image/png;base64,` + base64;
	scene.background = await new TextureLoader().loadAsync(completedURI);
	
	scene.add(new AmbientLight(0xFFFFFF));
	gltf.scene.position.set(0, 0, 0)
	scene.add(gltf.scene)
	
	const camera = new PerspectiveCamera(35, width / height, 1, 1000);
	camera.position.set(5, 5, 10)
	
	camera.lookAt(0, 0, 0);
	
	const canvas = createCanvas(width, height);
	
	const renderer = new WebGLRenderer({
		antialias: true,
		preserveDrawingBuffer: true,
		canvas: canvas,
	});
	
	// renderer.setSize(width, height);
	
	renderer.render(scene, camera)
	
	canvas.createPNGStream('image/png').pipe(res);
});

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
