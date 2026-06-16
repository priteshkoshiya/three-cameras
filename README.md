
# Three.js Cameras Visualizer

An interactive 3D camera simulation playground built with Next.js, Three.js, and TypeScript. This application serves as a visual guide to understanding, configuring, and switching between different camera types in a 3D environment in real time.

## 🚀 Live Demo
Explore the live application here: [https://three-cameras.vercel.app/](https://three-cameras.vercel.app/)

## ✨ Features

* **Multiple Camera Types:** Switch seamlessly between:
  * **PerspectiveCamera:** Mimics human eye perspective with natural depth distortion.
  * **OrthographicCamera:** Renders objects without perspective distortion (perfect for isometric views).
  * **CubeCamera:** Renders 6 directions for dynamic environment map reflections.
  * **ArrayCamera:** Manages multiple cameras efficiently for VR or split-screen rendering.
  * **StereoCamera:** Dual-camera setup designed for stereoscopic 3D rendering.
* **Real-Time Property Controllers:** Dynamically tweak configurations via the sidebar:
  * Field of View (FOV)
  * Near and Far clipping planes
  * Zoom factors
  * Exact X, Y, and Z camera positioning coordinates
* **Interactive 3D Legend & Helpers:** Visualizes live **Camera Positions**, **View Directions**, and **Frustum Lines** to explicitly show what falls inside the camera's viewport.
* **Responsive Control Scheme:** Orbit controls allowing users to Left-click + drag to rotate, Right-click + drag to pan, and Scroll to zoom around the scene.

## 🛠️ Tech Stack

* **Framework:** Next.js (v16) & React 19
* **3D Engine:** Three.js
* **Styles & UI:** Tailwind CSS & Radix UI Primitives (Accordion, Slider, Tabs, Dialog)
* **Language:** TypeScript
* **Analytics:** Vercel Analytics

## 💻 Setup and Installation

Follow these steps to spin up the project locally:

1. **Install Dependencies:**
```bash
   npm install

```

2. **Run Local Server:**

```bash
   npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3. **Build for Production:**

```bash
   npm run build

```

4. **Start Production Server:**

```bash
   npm run start

