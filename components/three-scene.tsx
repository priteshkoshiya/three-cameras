"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import type { CameraType, CameraConfig } from "./camera-configurator"

interface ThreeSceneProps {
  cameraType: CameraType
  config: CameraConfig
}

export default function ThreeScene({ cameraType, config }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    viewCamera: THREE.PerspectiveCamera
    controls: OrbitControls
    demoCamera?: THREE.Camera
    helpers: THREE.Object3D[]
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)
    scene.fog = new THREE.Fog(0x1a1a1a, 50, 200)

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Create view camera (the camera we use to see the scene)
    const viewCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    viewCamera.position.set(20, 15, 20)
    viewCamera.lookAt(0, 0, 0)

    // Add orbit controls
    const controls = new OrbitControls(viewCamera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Add grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x222222)
    scene.add(gridHelper)

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    // Add target objects (cubes to look at)
    const targetGeometry = new THREE.BoxGeometry(2, 2, 2)
    const targetMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      wireframe: false,
      transparent: true,
      opacity: 0.7,
    })

    const target1 = new THREE.Mesh(targetGeometry, targetMaterial)
    target1.position.set(0, 1, 0)
    scene.add(target1)

    const target2 = new THREE.Mesh(targetGeometry, targetMaterial.clone())
    target2.position.set(-5, 1, -5)
    target2.material.color.setHex(0x51cf66)
    scene.add(target2)

    const target3 = new THREE.Mesh(targetGeometry, targetMaterial.clone())
    target3.position.set(5, 1, -5)
    target3.material.color.setHex(0x339af0)
    scene.add(target3)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    scene.add(directionalLight)

    sceneRef.current = {
      scene,
      renderer,
      viewCamera,
      controls,
      helpers: [],
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()

      // Rotate target objects
      target1.rotation.y += 0.005
      target2.rotation.y += 0.005
      target3.rotation.y += 0.005

      renderer.render(scene, viewCamera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      viewCamera.aspect = width / height
      viewCamera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
      sceneRef.current = null
    }
  }, [])

  // Update camera when config changes
  useEffect(() => {
    if (!sceneRef.current) return

    const { scene, helpers, demoCamera } = sceneRef.current

    // Remove old helpers and camera
    helpers.forEach((helper) => scene.remove(helper))
    if (demoCamera) scene.remove(demoCamera)

    const newHelpers: THREE.Object3D[] = []

    // Create camera marker (blue cube)
    const cameraMarkerGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
    const cameraMarkerMaterial = new THREE.MeshStandardMaterial({ color: 0x4dabf7 })
    const cameraMarker = new THREE.Mesh(cameraMarkerGeometry, cameraMarkerMaterial)
    cameraMarker.position.set(config.positionX || 0, config.positionY || 5, config.positionZ || 10)
    scene.add(cameraMarker)
    newHelpers.push(cameraMarker)

    let newDemoCamera: THREE.Camera | undefined

    // Create and visualize the selected camera type
    if (cameraType === "PerspectiveCamera") {
      const camera = new THREE.PerspectiveCamera(config.fov, config.aspect, config.near, config.far)
      camera.position.set(config.positionX || 0, config.positionY || 5, config.positionZ || 10)
      camera.lookAt(0, 0, 0)
      camera.zoom = config.zoom || 1
      camera.updateProjectionMatrix()

      const helper = new THREE.CameraHelper(camera)
      helper.visible = true
      scene.add(helper)
      newHelpers.push(helper)

      newDemoCamera = camera
      scene.add(camera)
    } else if (cameraType === "OrthographicCamera") {
      const camera = new THREE.OrthographicCamera(
        config.left || -10,
        config.right || 10,
        config.top || 10,
        config.bottom || -10,
        config.near || 0.1,
        config.far || 1000,
      )
      camera.position.set(config.positionX || 0, config.positionY || 5, config.positionZ || 10)
      camera.lookAt(0, 0, 0)
      camera.zoom = config.zoom || 1
      camera.updateProjectionMatrix()

      const helper = new THREE.CameraHelper(camera)
      scene.add(helper)
      newHelpers.push(helper)

      newDemoCamera = camera
      scene.add(camera)
    } else if (cameraType === "CubeCamera") {
      // CubeCamera visualization - show 6 directions
      const cubeCamera = new THREE.Group()
      cubeCamera.position.set(config.positionX || 0, config.positionY || 5, config.positionZ || 10)

      // Create 6 lines showing the 6 directions
      const directions = [
        { dir: new THREE.Vector3(1, 0, 0), color: 0xff0000 }, // +X (right)
        { dir: new THREE.Vector3(-1, 0, 0), color: 0xff4444 }, // -X (left)
        { dir: new THREE.Vector3(0, 1, 0), color: 0x00ff00 }, // +Y (up)
        { dir: new THREE.Vector3(0, -1, 0), color: 0x44ff44 }, // -Y (down)
        { dir: new THREE.Vector3(0, 0, 1), color: 0x0000ff }, // +Z (forward)
        { dir: new THREE.Vector3(0, 0, -1), color: 0x4444ff }, // -Z (back)
      ]

      directions.forEach(({ dir, color }) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          dir.clone().multiplyScalar(5),
        ])
        const material = new THREE.LineBasicMaterial({ color })
        const line = new THREE.Line(geometry, material)
        cubeCamera.add(line)
      })

      scene.add(cubeCamera)
      newHelpers.push(cubeCamera)
    } else if (cameraType === "ArrayCamera") {
      // ArrayCamera visualization - show 4 sub-cameras
      const arrayGroup = new THREE.Group()
      arrayGroup.position.set(config.positionX || 0, config.positionY || 5, config.positionZ || 10)

      const positions = [
        { x: -1, y: 1 },
        { x: 1, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
      ]

      positions.forEach((pos, i) => {
        const subCamera = new THREE.PerspectiveCamera(config.fov, 1, config.near, config.far)
        subCamera.position.set(pos.x, pos.y, 0)
        subCamera.lookAt(0, 0, -5)

        const helper = new THREE.CameraHelper(subCamera)
        helper.visible = true
        arrayGroup.add(helper)
      })

      scene.add(arrayGroup)
      newHelpers.push(arrayGroup)
    } else if (cameraType === "StereoCamera") {
      // StereoCamera visualization - show left and right cameras
      const leftCamera = new THREE.PerspectiveCamera(config.fov, config.aspect, config.near, config.far)
      leftCamera.position.set(
        (config.positionX || 0) - (config.eyeSep || 0.064) / 2,
        config.positionY || 5,
        config.positionZ || 10,
      )
      leftCamera.lookAt(0, 0, 0)
      leftCamera.updateProjectionMatrix()

      const rightCamera = new THREE.PerspectiveCamera(config.fov, config.aspect, config.near, config.far)
      rightCamera.position.set(
        (config.positionX || 0) + (config.eyeSep || 0.064) / 2,
        config.positionY || 5,
        config.positionZ || 10,
      )
      rightCamera.lookAt(0, 0, 0)
      rightCamera.updateProjectionMatrix()

      const leftHelper = new THREE.CameraHelper(leftCamera)
      leftHelper.visible = true
      scene.add(leftHelper)
      newHelpers.push(leftHelper)

      const rightHelper = new THREE.CameraHelper(rightCamera)
      rightHelper.visible = true
      scene.add(rightHelper)
      newHelpers.push(rightHelper)

      scene.add(leftCamera)
      scene.add(rightCamera)
    }

    // Add direction line from camera to origin
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(config.positionX || 0, config.positionY || 5, config.positionZ || 10),
      new THREE.Vector3(0, 0, 0),
    ])
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x51cf66, linewidth: 2 })
    const directionLine = new THREE.Line(lineGeometry, lineMaterial)
    scene.add(directionLine)
    newHelpers.push(directionLine)

    sceneRef.current.helpers = newHelpers
    sceneRef.current.demoCamera = newDemoCamera
  }, [cameraType, config])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* Info overlay */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-md">
        <h3 className="font-semibold text-sm mb-2">{cameraType}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {cameraType === "PerspectiveCamera" &&
            "This camera mimics how the human eye sees. Objects farther away appear smaller (perspective distortion). Adjust FOV to change the field of view angle."}
          {cameraType === "OrthographicCamera" &&
            "Objects maintain their size regardless of distance. Perfect for 2D games, CAD applications, and UI elements. No perspective distortion."}
          {cameraType === "CubeCamera" &&
            "Renders the scene in all 6 directions (cube faces) from a single point. Used for environment maps and real-time reflections."}
          {cameraType === "ArrayCamera" &&
            "Contains multiple sub-cameras rendering to different viewports. Essential for VR rendering and multi-view setups."}
          {cameraType === "StereoCamera" &&
            "Two cameras separated by eye distance. Creates stereoscopic 3D effect for anaglyph or VR displays."}
        </p>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          <strong>Controls:</strong> Left-click + drag to rotate • Right-click + drag to pan • Scroll to zoom
        </p>
      </div>
    </div>
  )
}
