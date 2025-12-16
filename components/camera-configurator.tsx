"use client"

import { useState } from "react"
import CameraSidebar from "./camera-sidebar"
import CameraProperties from "./camera-properties"
import ThreeScene from "./three-scene"

export type CameraType = "PerspectiveCamera" | "OrthographicCamera" | "CubeCamera" | "ArrayCamera" | "StereoCamera"

export interface CameraConfig {
  // Perspective Camera
  fov?: number
  aspect?: number
  near?: number
  far?: number
  zoom?: number
  // Orthographic Camera
  left?: number
  right?: number
  top?: number
  bottom?: number
  // Stereo Camera
  eyeSep?: number
  // Position
  positionX?: number
  positionY?: number
  positionZ?: number
  // Rotation
  rotationX?: number
  rotationY?: number
  rotationZ?: number
}

export default function CameraConfigurator() {
  const [selectedCamera, setSelectedCamera] = useState<CameraType>("PerspectiveCamera")
  const [config, setConfig] = useState<CameraConfig>({
    fov: 75,
    aspect: 1,
    near: 0.1,
    far: 1000,
    zoom: 1,
    left: -10,
    right: 10,
    top: 10,
    bottom: -10,
    eyeSep: 0.064,
    positionX: 0,
    positionY: 5,
    positionZ: 10,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
  })

  return (
    <div className="flex h-full w-full bg-background">
      {/* Sidebar */}
      <CameraSidebar selectedCamera={selectedCamera} onSelectCamera={setSelectedCamera} />

      {/* Main 3D Scene */}
      <div className="flex-1 relative">
        <ThreeScene cameraType={selectedCamera} config={config} />
      </div>

      {/* Properties Panel */}
      <CameraProperties cameraType={selectedCamera} config={config} onConfigChange={setConfig} />
    </div>
  )
}
