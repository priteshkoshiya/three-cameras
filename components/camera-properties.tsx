"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { CameraType, CameraConfig } from "./camera-configurator"

interface CameraPropertiesProps {
  cameraType: CameraType
  config: CameraConfig
  onConfigChange: (config: CameraConfig) => void
}

export default function CameraProperties({ cameraType, config, onConfigChange }: CameraPropertiesProps) {
  const updateConfig = (key: keyof CameraConfig, value: number) => {
    onConfigChange({ ...config, [key]: value })
  }

  const renderPerspectiveControls = () => (
    <>
      <PropertyControl
        label="FOV (Field of View)"
        value={config.fov!}
        min={1}
        max={180}
        step={1}
        onChange={(v) => updateConfig("fov", v)}
        description="Vertical field of view in degrees"
      />
      <PropertyControl
        label="Near Plane"
        value={config.near!}
        min={0.1}
        max={10}
        step={0.1}
        onChange={(v) => updateConfig("near", v)}
        description="Nearest visible distance"
      />
      <PropertyControl
        label="Far Plane"
        value={config.far!}
        min={10}
        max={2000}
        step={10}
        onChange={(v) => updateConfig("far", v)}
        description="Farthest visible distance"
      />
      <PropertyControl
        label="Zoom"
        value={config.zoom!}
        min={0.1}
        max={5}
        step={0.1}
        onChange={(v) => updateConfig("zoom", v)}
        description="Camera zoom factor"
      />
    </>
  )

  const renderOrthographicControls = () => (
    <>
      <PropertyControl
        label="Left"
        value={config.left!}
        min={-20}
        max={0}
        step={1}
        onChange={(v) => updateConfig("left", v)}
        description="Left frustum plane"
      />
      <PropertyControl
        label="Right"
        value={config.right!}
        min={0}
        max={20}
        step={1}
        onChange={(v) => updateConfig("right", v)}
        description="Right frustum plane"
      />
      <PropertyControl
        label="Top"
        value={config.top!}
        min={0}
        max={20}
        step={1}
        onChange={(v) => updateConfig("top", v)}
        description="Top frustum plane"
      />
      <PropertyControl
        label="Bottom"
        value={config.bottom!}
        min={-20}
        max={0}
        step={1}
        onChange={(v) => updateConfig("bottom", v)}
        description="Bottom frustum plane"
      />
      <PropertyControl
        label="Near Plane"
        value={config.near!}
        min={0.1}
        max={10}
        step={0.1}
        onChange={(v) => updateConfig("near", v)}
        description="Nearest visible distance"
      />
      <PropertyControl
        label="Far Plane"
        value={config.far!}
        min={10}
        max={2000}
        step={10}
        onChange={(v) => updateConfig("far", v)}
        description="Farthest visible distance"
      />
    </>
  )

  const renderStereoControls = () => (
    <>
      <PropertyControl
        label="Eye Separation"
        value={config.eyeSep!}
        min={0.01}
        max={0.5}
        step={0.01}
        onChange={(v) => updateConfig("eyeSep", v)}
        description="Distance between left and right cameras"
      />
    </>
  )

  const renderPositionControls = () => (
    <>
      <PropertyControl
        label="Position X"
        value={config.positionX!}
        min={-20}
        max={20}
        step={0.5}
        onChange={(v) => updateConfig("positionX", v)}
        description="Horizontal position"
      />
      <PropertyControl
        label="Position Y"
        value={config.positionY!}
        min={-20}
        max={20}
        step={0.5}
        onChange={(v) => updateConfig("positionY", v)}
        description="Vertical position"
      />
      <PropertyControl
        label="Position Z"
        value={config.positionZ!}
        min={-20}
        max={20}
        step={0.5}
        onChange={(v) => updateConfig("positionZ", v)}
        description="Depth position"
      />
    </>
  )

  return (
    <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-foreground mb-4">Properties</h2>

      {/* Camera-specific properties */}
      <Card className="p-4 mb-4">
        <h3 className="font-semibold text-sm mb-4 text-foreground">{cameraType} Settings</h3>
        <div className="space-y-6">
          {cameraType === "PerspectiveCamera" && renderPerspectiveControls()}
          {cameraType === "OrthographicCamera" && renderOrthographicControls()}
          {cameraType === "StereoCamera" && (
            <>
              {renderPerspectiveControls()}
              {renderStereoControls()}
            </>
          )}
          {cameraType === "CubeCamera" && (
            <>
              <PropertyControl
                label="Near Plane"
                value={config.near!}
                min={0.1}
                max={10}
                step={0.1}
                onChange={(v) => updateConfig("near", v)}
                description="Nearest visible distance"
              />
              <PropertyControl
                label="Far Plane"
                value={config.far!}
                min={10}
                max={2000}
                step={10}
                onChange={(v) => updateConfig("far", v)}
                description="Farthest visible distance"
              />
            </>
          )}
          {cameraType === "ArrayCamera" && (
            <p className="text-sm text-muted-foreground">
              ArrayCamera uses multiple PerspectiveCamera instances. Adjust position to see the camera array.
            </p>
          )}
        </div>
      </Card>

      {/* Position controls */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-4 text-foreground">Camera Position</h3>
        <div className="space-y-6">{renderPositionControls()}</div>
      </Card>
    </div>
  )
}

interface PropertyControlProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  description?: string
}

function PropertyControl({ label, value, min, max, step, onChange, description }: PropertyControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Input
          type="number"
          value={value.toFixed(2)}
          onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
          className="w-20 h-8 text-xs"
          step={step}
          min={min}
          max={max}
        />
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} className="w-full" />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
