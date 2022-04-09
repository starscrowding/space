import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {formatImageData} from './utils';

const RADIUS = 1;
const SEGMENTS = 128;
const THICKNESS = RADIUS / 9;

export class TokenController {
  container: Element;
  imageData: ImageData;
  renderer: THREE.WebGLRenderer | null;
  scene?: THREE.Scene | THREE.Object3D<Event>;
  material?: THREE.MeshStandardMaterial;
  camera!: THREE.PerspectiveCamera;
  cameraCtrl!: OrbitControls;
  reqID?: number;

  constructor(props: {
    container: Element;
    imageData: ImageData;
    material?: THREE.MeshStandardMaterialParameters;
  }) {
    this.container = props.container;
    this.imageData = props.imageData;
    this.renderer = null;

    this.initRenderer();
    this.initScene();
    this.initMaterial(props.material);
    this.initTokenRing();
    this.initTokenPattern();
    this.initLight();
    this.initCamera();
    this.resize = this.resize.bind(this);

    window.addEventListener('resize', this.resize, false);

    this.resize();
    this.zoom();
  }

  zoom() {
    if (this.camera && this.container.clientWidth < this.imageData.width * 1.5) {
      this.camera.zoom = this.container.clientWidth / this.imageData.width / 1.5;
      this.camera.updateProjectionMatrix();
    }
  }

  resize() {
    if (this.camera) {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    this.renderer?.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: true,
    });
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0xffffff, 0);
    this.play();
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initMaterial(
    materialProps: THREE.MeshStandardMaterialParameters | undefined = {
      roughness: 0.7,
      metalness: 1,
      color: 16761685,
    }
  ) {
    this.material = new THREE.MeshStandardMaterial(materialProps);
  }

  initTokenRing() {
    const scene = this.scene;

    const ringGeometry = new THREE.RingBufferGeometry(RADIUS, RADIUS + THICKNESS / 2, SEGMENTS, 1);

    const frontRing = new THREE.Mesh(ringGeometry, this.material);
    frontRing.position.z = THICKNESS / 2 + 0.0033;
    scene?.add(frontRing);

    const backRing = frontRing.clone();
    backRing.position.z = -THICKNESS / 2 - 0.0033;
    backRing.rotateY(Math.PI);
    scene?.add(backRing);

    const cylinderGeometry = new THREE.CylinderBufferGeometry(
      RADIUS + THICKNESS / 2,
      RADIUS + THICKNESS / 2,
      THICKNESS,
      SEGMENTS,
      1,
      false
    );

    const cylinder = new THREE.Mesh(cylinderGeometry, this.material);
    cylinder.rotateX(Math.PI / 2);
    scene?.add(cylinder);
  }

  initTokenPattern() {
    const scene = this.scene;

    const texture = new THREE.DataTexture(
      formatImageData(this.imageData),
      this.imageData.width,
      this.imageData.height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType
    );
    texture.needsUpdate = true;
    texture.flipY = true;

    const circleGeometry = new THREE.CircleBufferGeometry(RADIUS + THICKNESS / 4, SEGMENTS);

    const circleMaterial = this.material?.clone();
    Object.assign(circleMaterial, {
      bumpMap: texture,
      bumpScale: 0.05,
    });

    const front0 = new THREE.Mesh(circleGeometry, circleMaterial);
    front0.position.z = THICKNESS / 4 + 0.03;
    scene?.add(front0);

    const back0 = front0.clone();
    back0.position.z = -THICKNESS / 4 - 0.03;
    back0.rotateY(Math.PI);
    scene?.add(back0);

    const geometry = new THREE.PlaneBufferGeometry(
      RADIUS * 2 + THICKNESS / 2,
      RADIUS * 2 + THICKNESS / 2,
      this.imageData.width,
      this.imageData.height
    );

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      blending: THREE.NormalBlending,
      transparent: true,
    });

    const front = new THREE.Mesh(geometry, material);
    front.position.z = THICKNESS / 4 + 0.031;
    scene?.add(front);

    const back = front.clone();
    back.position.z = -(THICKNESS / 4) - 0.031;
    back.rotateY(Math.PI);
    scene?.add(back);
  }

  initLight() {
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.25);
    frontLight.position.set(0, 0.5, 2);
    this.scene?.add(frontLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 1.25);
    bottomLight.position.set(0, -7, 0.5);
    this.scene?.add(bottomLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.25);
    backLight.position.set(0, 0.5, -2);
    this.scene?.add(backLight);
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.z = RADIUS * 5;

    const controls = new OrbitControls(camera, this.renderer?.domElement);
    controls.autoRotate = true;
    controls.minDistance = RADIUS * 1.3;

    this.camera = camera;
    this.cameraCtrl = controls;
  }

  render() {
    this.cameraCtrl?.update();
    if (this.scene && this.camera) {
      this.renderer?.render(this.scene, this.camera);
    }
    this.play();
  }

  destroy() {
    window.removeEventListener('resize', this.resize, false);
    this.pause();
    this.renderer?.dispose();
  }

  play() {
    this.reqID = requestAnimationFrame(this.render.bind(this));
  }

  pause() {
    if (this.reqID) {
      cancelAnimationFrame(this.reqID);
    }
  }

  resize4Save() {
    if (this.camera) {
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();
    }
    this.renderer?.setSize(this.imageData.width, this.imageData.height);
  }

  getPngBlob(blobCb?: (blob: Blob | null) => void) {
    this.resize4Save();
    this.pause();
    this.cameraCtrl.saveState();
    this.cameraCtrl.enabled = false;
    this.camera.position.set(0, 0, RADIUS * 3.2);
    this.camera.lookAt(this.cameraCtrl.target);
    if (this.scene && this.camera) {
      this.renderer?.render(this.scene, this.camera);
    }
    setTimeout(() => {
      this.renderer?.domElement.toBlob((blob: Blob | null) => {
        blobCb?.(blob);
        this.cameraCtrl.reset();
        this.cameraCtrl.enabled = true;
        this.resize();
        this.play();
      });
    });
    return this.renderer?.domElement.toDataURL();
  }
}
