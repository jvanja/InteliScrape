<template>
  <div id="section1" ref="section1"></div>
</template>
<script setup>
import * as THREE from 'three'

const section1 = useTemplateRef('section1')

onMounted(() => {
  /*********************
   *  CONFIGURATION
   *********************/
  // Toggle to show the debug grid.
  const SHOW_GRID = true

  // Final grid configuration: 10×10 grid of fixed size 300×300 pixels.
  const GRID_COLS = 10
  const GRID_ROWS = 10
  const GRID_WIDTH = 300 // in pixels
  const GRID_HEIGHT = 300 // in pixels

  // Timing: nodes travel for TRAVEL_TIME seconds, then hold for DESTINATION_HOLD_TIME seconds.
  const TRAVEL_TIME = 2.0 // seconds to travel along the curve
  const DESTINATION_HOLD_TIME = 1.0 // seconds to hold at destination
  const TOTAL_TIME = TRAVEL_TIME + DESTINATION_HOLD_TIME

  // Nodes spawn continuously from the left half.
  const SPAWN_RATE = 30 // nodes per second (on average)

  // Appearance.
  const NODE_RADIUS = 4 // in pixels
  const NODE_COLOR = 0x888888
  const LINE_COLOR = 0x888888

  // Funnel position: at the center of the canvas.
  const funnel = new THREE.Vector3(0, 0, 0)

  /*********************
   *  SCENE SETUP
   *********************/
  const scene = new THREE.Scene()
  // const width = window.innerWidth
  // const height = window.innerHeight
  const width = section1.value.clientWidth
  console.log(section1.value.clientHeight)
  const height = section1.value.clientHeight

  // Use an orthographic camera with (0,0) at the center.
  const camera = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    1,
    1000
  )
  camera.position.z = 500

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(0xffffff, 0) // Transparent background
  // document.body.appendChild(renderer.domElement)
  section1.value.appendChild(renderer.domElement)

  /*********************
   *  GRID CALCULATION (Right Half)
   *********************/
  // The right half spans x from 0 to width/2 and y from -height/2 to height/2.
  // We want a grid of size 300×300 pixels centered in the right half; that is, its center is at (width/4, 0).
  const gridCenter = new THREE.Vector3(width / 4, 0, 0)
  const gridXMin = gridCenter.x - GRID_WIDTH / 2
  const gridXMax = gridCenter.x + GRID_WIDTH / 2
  const gridYMin = -GRID_HEIGHT / 2
  const gridYMax = GRID_HEIGHT / 2
  const spacingX = GRID_WIDTH / (GRID_COLS - 1)
  const spacingY = GRID_HEIGHT / (GRID_ROWS - 1)

  // Precompute final destination positions for grid intersections.
  // We store them in a flat array (index = row * GRID_COLS + col).
  const finalPositions = []
  for (let col = 0; col < GRID_COLS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      const x = gridXMin + col * spacingX
      const y = gridYMin + row * spacingY
      finalPositions.push(new THREE.Vector3(x, y, 0))
    }
  }

  // Helper: choose a random grid intersection.
  // Also return grid coordinates (col, row).
  function getRandomGridIntersection() {
    const col = Math.floor(Math.random() * GRID_COLS)
    const row = Math.floor(Math.random() * GRID_ROWS)
    const index = row * GRID_COLS + col
    return { position: finalPositions[index], col, row }
  }

  /*********************
   *  DEBUG GRID (Optional)
   *********************/
  if (SHOW_GRID) {
    const gridGroup = new THREE.Group()
    const gridLineMaterial = new THREE.LineBasicMaterial({ color: 0xcfcfcf })
    // Vertical grid lines.
    for (let i = 0; i < GRID_COLS; i++) {
      const x = gridXMin + i * spacingX
      const points = [
        new THREE.Vector3(x, gridYMin, 0),
        new THREE.Vector3(x, gridYMax, 0),
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, gridLineMaterial)
      gridGroup.add(line)
    }
    // Horizontal grid lines.
    for (let j = 0; j < GRID_ROWS; j++) {
      const y = gridYMin + j * spacingY
      const points = [
        new THREE.Vector3(gridXMin, y, 0),
        new THREE.Vector3(gridXMax, y, 0),
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, gridLineMaterial)
      gridGroup.add(line)
    }
    scene.add(gridGroup)
  }

  /*********************
   *  MATERIALS & GEOMETRIES FOR NODES AND CONNECTIONS
   *********************/
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: NODE_COLOR })
  const nodeGeometry = new THREE.CircleGeometry(NODE_RADIUS, 16)

  // For connection lines, use one dynamic BufferGeometry.
  const connectionsGeometry = new THREE.BufferGeometry()
  let connectionsArray = new Float32Array(3000) // initial capacity (will be resized if needed)
  connectionsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(connectionsArray, 3)
  )
  const connectionsMaterial = new THREE.LineBasicMaterial({ color: LINE_COLOR })
  const connectionLines = new THREE.LineSegments(
    connectionsGeometry,
    connectionsMaterial
  )
  connectionLines.renderOrder = 0 // Render behind nodes.
  scene.add(connectionLines)

  /*********************
   *  HELPER FUNCTION: Cubic Bézier Interpolation
   *********************/
  // Returns a new THREE.Vector3 representing the point on the cubic Bézier curve at parameter t.
  function cubicBezier(P0, P1, P2, P3, t) {
    const oneMinusT = 1 - t
    const a = oneMinusT * oneMinusT * oneMinusT
    const b = 3 * oneMinusT * oneMinusT * t
    const c = 3 * oneMinusT * t * t
    const d = t * t * t
    return new THREE.Vector3(
      a * P0.x + b * P1.x + c * P2.x + d * P3.x,
      a * P0.y + b * P1.y + c * P2.y + d * P3.y,
      a * P0.z + b * P1.z + c * P2.z + d * P3.z
    )
  }

  /*********************
   *  NODE CLASS (Single Cubic Bézier Through Funnel)
   *********************/
  // Each node follows a single cubic Bézier curve from spawn to destination.
  // We force the curve to pass through the funnel (at (0,0)) at t = 1.
  // We achieve this by setting:
  //    P1 = P2 = (8*funnel - spawn - destination) / 6.
  // The node travels along the curve until it reaches its destination.
  // When a node has traveled for TRAVEL_TIME seconds, it is considered to have reached its destination.
  // It then holds for DESTINATION_HOLD_TIME seconds (during which it becomes “active” for connection lines)
  // and then disappears.
  class Node {
    constructor(birthTime) {
      this.birthTime = birthTime
      // Spawn: random position in left half.
      const spawnX = -width / 2 + Math.random() * (width / 2)
      const spawnY = -height / 2 + Math.random() * height
      this.spawn = new THREE.Vector3(spawnX, spawnY, 0)
      // Destination: random grid intersection in the right half.
      const gridData = getRandomGridIntersection()
      this.destination = gridData.position
      this.col = gridData.col
      this.row = gridData.row
      // Endpoints of the Bézier curve.
      this.P0 = this.spawn
      this.P3 = this.destination
      // Compute control points so that the curve passes through the funnel at t=0.5 ideally.
      // We force the curve to reach the destination exactly when travel is done.
      // Here we choose:
      //    P1 = P2 = (8*funnel - P0 - P3) / 6.
      this.P1 = new THREE.Vector3()
        .subVectors(
          new THREE.Vector3(8 * funnel.x, 8 * funnel.y, 8 * funnel.z),
          new THREE.Vector3().addVectors(this.P0, this.P3)
        )
        .multiplyScalar(1 / 6)
      this.P2 = this.P1.clone()
      // Create mesh.
      this.mesh = new THREE.Mesh(nodeGeometry, nodeMaterial)
      this.mesh.position.copy(this.spawn)
      this.mesh.renderOrder = 1 // Draw nodes on top.
      scene.add(this.mesh)
    }

    update(currentTime) {
      const age = currentTime - this.birthTime
      let u
      if (age < TRAVEL_TIME) {
        // Travel phase: animate along the cubic Bézier curve.
        u = age / TRAVEL_TIME // u goes from 0 to 1 over the travel phase.
      } else {
        // Once the node reaches its destination (after TRAVEL_TIME seconds), hold there.
        u = 1
      }
      const pos = cubicBezier(this.P0, this.P1, this.P2, this.P3, u)
      this.mesh.position.copy(pos)
    }

    isActive(currentTime) {
      // The node is considered active for connections only during the hold phase.
      const age = currentTime - this.birthTime
      return age >= TRAVEL_TIME && age < TOTAL_TIME
    }
  }

  // Array to hold nodes.
  let nodes = []

  /*********************
   *  SPAWN NEW NODES CONTINUOUSLY
   *********************/
  let lastTime = 0
  function trySpawnNodes(currentTime, delta) {
    const expected = SPAWN_RATE * delta
    let count = Math.floor(expected)
    if (Math.random() < expected - count) count++
    for (let i = 0; i < count; i++) {
      nodes.push(new Node(currentTime))
    }
  }

  /*********************
   *  CONNECTION LINES MANAGEMENT
   *********************/
  // Update connection lines based on nodes that are active.
  function updateConnections(currentTime) {
    const activeNodes = {}
    nodes.forEach((node) => {
      if (node.isActive(currentTime)) {
        const key = `${node.col},${node.row}`
        activeNodes[key] = node
      }
    })
    const verts = []
    // For each active node, if an active neighbor exists to the right or below, add a line segment.
    for (const key in activeNodes) {
      const node = activeNodes[key]
      const [colStr, rowStr] = key.split(',')
      const col = parseInt(colStr)
      const row = parseInt(rowStr)
      const rightKey = `${col + 1},${row}`
      if (activeNodes[rightKey]) {
        const neighbor = activeNodes[rightKey]
        verts.push(
          node.mesh.position.x,
          node.mesh.position.y,
          node.mesh.position.z,
          neighbor.mesh.position.x,
          neighbor.mesh.position.y,
          neighbor.mesh.position.z
        )
      }
      const belowKey = `${col},${row + 1}`
      if (activeNodes[belowKey]) {
        const neighbor = activeNodes[belowKey]
        verts.push(
          node.mesh.position.x,
          node.mesh.position.y,
          node.mesh.position.z,
          neighbor.mesh.position.x,
          neighbor.mesh.position.y,
          neighbor.mesh.position.z
        )
      }
    }
    const nVerts = verts.length
    if (nVerts > connectionsArray.length) {
      connectionsArray = new Float32Array(nVerts)
      connectionsGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(connectionsArray, 3)
      )
    }
    connectionsArray.set(verts)
    connectionsGeometry.attributes.position.needsUpdate = true
    connectionsGeometry.setDrawRange(0, nVerts / 3)
  }

  /*********************
   *  MAIN ANIMATION LOOP
   *********************/
  const clock = new THREE.Clock()
  lastTime = clock.getElapsedTime()
  function animate() {
    requestAnimationFrame(animate)
    const currentTime = clock.getElapsedTime()
    const delta = currentTime - lastTime
    lastTime = currentTime

    // Spawn new nodes.
    trySpawnNodes(currentTime, delta)

    // Update nodes; remove those that have exceeded TOTAL_TIME.
    nodes = nodes.filter((node) => {
      const age = currentTime - node.birthTime
      if (age >= TOTAL_TIME) {
        scene.remove(node.mesh)
        return false
      } else {
        node.update(currentTime)
        return true
      }
    })

    // Update connection lines based on active nodes.
    updateConnections(currentTime)

    renderer.render(scene, camera)
  }
  animate()

  /*********************
   *  HANDLE WINDOW RESIZE
   *********************/
  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    const w = section1.value.clientWidth
    const h = section1.value.clientHeight
    camera.left = -w / 2
    camera.right = w / 2
    camera.top = h / 2
    camera.bottom = -h / 2
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
})
</script>
<style >
#section1 {
  aspect-ratio: 16 / 9;
}
</style>
