"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Box, Eye, Grid3x3, Layers } from "lucide-react"
import type { CameraType } from "./camera-configurator"

interface CameraSidebarProps {
  selectedCamera: CameraType
  onSelectCamera: (camera: CameraType) => void
}

const cameras: Array<{ type: CameraType; icon: any; description: string }> = [
  {
    type: "PerspectiveCamera",
    icon: Camera,
    description: "Mimics human eye perspective",
  },
  {
    type: "OrthographicCamera",
    icon: Grid3x3,
    description: "No perspective distortion",
  },
  {
    type: "CubeCamera",
    icon: Box,
    description: "Renders 6 directions for reflections",
  },
  {
    type: "ArrayCamera",
    icon: Layers,
    description: "Multiple cameras for VR",
  },
  {
    type: "StereoCamera",
    icon: Eye,
    description: "Stereoscopic 3D rendering",
  },
]

export default function CameraSidebar({ selectedCamera, onSelectCamera }: CameraSidebarProps) {
  return (
    <div className="w-72 border-r border-border bg-card p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Camera Types</h1>
        <p className="text-sm text-muted-foreground">Select a camera to visualize and configure</p>
      </div>

      <div className="space-y-2">
        {cameras.map(({ type, icon: Icon, description }) => (
          <Button
            key={type}
            variant={selectedCamera === type ? "default" : "outline"}
            className="w-full justify-start h-auto p-4"
            onClick={() => onSelectCamera(type)}
          >
            <div className="flex items-start gap-3 w-full">
              <Icon className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm">{type}</div>
                <div className="text-xs opacity-80 font-normal mt-1">{description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      <Card className="mt-6 p-4 bg-muted/50">
        <h3 className="font-semibold text-sm mb-2">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm" />
            <span>Camera Position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-500" />
            <span>View Direction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-yellow-500" />
            <span>Frustum Lines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-red-500 rounded-sm" />
            <span>Target Object</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
