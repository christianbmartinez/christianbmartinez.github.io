import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)


// Model
const canvas = document.querySelector('#christian')

const renderer = new THREE.WebGLRenderer({canvas})
renderer.outputEncoding = THREE.sRGBEncoding

const fov = 1
const aspect = 2
const near = 1
const far = 10000

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 200
camera.position.x = 0
camera.position.y = 0

const controls = new OrbitControls(camera, canvas)
controls.autoRotate = true
controls.autoRotateSpeed = 0
controls.enableZoom = false

const scene = new THREE.Scene()
scene.background = new THREE.Color('#cc3b73')   

const manager = new THREE.LoadingManager();
let counter = document.getElementById('counter')
const onLoadFinish = gsap.timeline({
  defaults: { duration: 1, ease: 'power4.inOut' }
})

manager.onStart = (url, itemsLoaded, itemsTotal) => {    
  counter.innerHTML = 'Loading...'
  console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
}

manager.onLoad = () => {  
  onLoadFinish
  .to('.splash .logo', { top: '37px', left: '37px' }, '-=1.5')  
  .to('nav .logo', { opacity: 1 }, '-=1.5')
  .to('.splash h1', { opacity: 0, bottom: '37px', right: '37px' }, '-=1.5')
  .to('.splash', { height: 0 }, '-=1')     
  .to(camera.position, { duration: 2.5, z: 60 }, '-=1')  
  .to(controls, { autoRotateSpeed: .5 }, '-=.75') 
  console.log( 'Loading complete!');
}    

manager.onProgress = (url, loaded, total) => {    
  counter.innerHTML = (Math.round(loaded / total * 100)) + '%' 
  console.log( 'Loading file: ' + url + '.\nLoaded ' + loaded + ' of ' + total + ' files.' );   
}
    
manager.onError = url => {    
  console.log( 'There was an error loading ' + url )    
}
    
const gltfLoader = new GLTFLoader(manager)

gltfLoader.load('./assets/06.glb', gltf => {   
  scene.add(gltf.scene)
  })

const light = new THREE.SpotLight(0xffa95c,4)
light.position.set(-60,60,60)
scene.add(light)

const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4)
scene.add(hemiLight)     
    
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

function render() {  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }  
  renderer.render(scene, camera) 
  requestAnimationFrame(render)
  controls.update()
}  

requestAnimationFrame(render)

// Menu
const open = document.querySelector('.menu-bg')
const close = document.querySelector('.close')
const menu = gsap.timeline({
  defaults: { duration: 1, ease: 'power4.inOut', autoAlpha: 1 }
})

// Menu open
open.onclick = () => {
  if (menu.reversed()) {
    menu.play()
  } else {
    menu  
      .to('.menu-bg p', { opacity: 0 }, '-=2.5')
      .to('html, body', { overflowY: 'hidden' }, '-=2.5') 
      .to('.menu-bg', { top: '0px', right: '0px', width: '100vw', backgroundColor: '#111' }, '-=2')   
      .to('.menu-bg', { height: '100vh' }, '-=1.5')
      .to('nav', { height: '100vh' }, '-=1.5')
      .to('nav ul li a', { opacity: 1, pointerEvents: 'all', stagger: 0.25 }, '-=1')
      .to('nav .socials', { bottom: '5%', opacity: 1, pointerEvents: 'all', display: 'flex' }, '-=1')
      .to('.close', { opacity: 1, pointerEvents: 'all' }, '-=2')
      .to('.logo', { color: '#fafafa' }, '-=2')
  }
}
  
close.onclick = () => {
  menu.reverse()
}

// Menu Links
gsap.utils.toArray('.links a').forEach(link => {
  link.addEventListener('click', async e => {
    e.preventDefault()
    await menu.reverse()
    let el = document.querySelector(e.target.getAttribute('href'))
    let left = el.offsetLeft
    gsap.to('html', {
      scrollTo: left,
      duration: 1 
    })
  })
})

// Scroll Trigger
const container = document.querySelector('.container')
const sections = gsap.utils.toArray('.section')

gsap.to(container, {
  x: () => -(container.offsetWidth - innerWidth) + 'px',
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    invalidateOnRefresh: true,
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => '+=' + (container.offsetWidth - innerWidth)
  }
})





