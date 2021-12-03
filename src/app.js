import './style.scss'
import * as THREE from 'three'

import { gsap } from 'gsap'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const gtlfLoader = new GLTFLoader()

import vertexShader from './shaders/vertex.glsl'

import fragmentShader from './shaders/frag.glsl'


const waterMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide
})

let geometry = new THREE.PlaneGeometry(13, 13,128,128)


let mesh = new THREE.Mesh(geometry, waterMaterial)
mesh.position.set( 0.5467526912689209,
-1.2203081846237183, -0.7569929957389832)
mesh.rotation.x = Math.PI / 2 
mesh.position.y-=2.8

scene.add(mesh)
// console.log(riverMaterial)
let sceneGroup, mixer, duck, water
const morphMeshes = [];
gtlfLoader.load(
  'duck3.glb',
  (gltf) => {
    console.log(gltf)

    // gltf.scene.scale.set(4.5,4.5,4.5)
    sceneGroup = gltf.scene
    sceneGroup.needsUpdate = true
    sceneGroup.position.y -= 3
    sceneGroup.needsUpdate = true

    sceneGroup.matrixWorldNeedsUpdate = true
    console.log(sceneGroup)
    scene.add(sceneGroup)

  //   duck = gltf.scene.children.find((child) => {
  //   return child.name === 'duck'
  // })
  // duck.matrixWorldNeedsUpdate = true
  // console.log(duck)

  // const helper = new THREE.SkeletonHelper( sceneGroup );
  // scene.add( helper );

  // water = gltf.scene.children.find((child) => {
  //   return child.name === 'water'
  // })
  // console.log(water)
  //
  // water.material = waterMaterial

    sceneGroup.traverse((node) => {
      if (node.isMesh && node.morphTargetInfluences) {
        morphMeshes.push(node);
        console.log(node)
      }
      // console.log(node.material)


        node.matrixWorldNeedsUpdate = true
        node.skinning = true
        node.needsUpdate = true


    })




    var animations = gltf.animations;

    mixer = new THREE.AnimationMixer( gltf.scene );
	var action = mixer.clipAction( gltf.animations[ 1 ] );
	action.play();




  }
)


const light = new THREE.AmbientLight( 0x404040 ) // soft white light
scene.add( light )

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.25 )
scene.add( directionalLight )

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{



  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))

})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = 7
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.maxPolarAngle = Math.PI / 2 - 0.1


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 0 )
const mouse = new THREE.Vector2()




const clock = new THREE.Clock()

const tick = () =>{


  if ( mixer ){
    // console.log(mixer)
    mixer.update( clock.getDelta() )
  // console.log(mixer)
  }

    const elapsedTime = clock.getElapsedTime()


  // Update controls
  controls.update()


  waterMaterial.uniforms.uTime.value = elapsedTime




  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
