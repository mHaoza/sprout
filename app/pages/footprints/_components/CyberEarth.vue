<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import gsap from 'gsap'
import { geoContains, geoCentroid } from 'd3-geo'
import type { Footprint } from '../_data/footprints'

const props = defineProps<{
  footprints: Footprint[]
  activeId?: string | null
}>()

const emit = defineEmits<{
  (e: 'click-point', footprint: Footprint): void
  (
    e: 'update-positions',
    positions: Record<string, { x: number; y: number; visible: boolean }>,
  ): void
  (e: 'select-country', countryData: { name: string; sub: string | null } | null): void
}>()

const container = ref<HTMLElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let composer: EffectComposer
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2

const RADIUS = 100
const SEGMENTS = 64
let markersGroup: THREE.Group
let worldMapGroup: THREE.Group
let selectedCountryGroup: THREE.Group
let innerSphereMesh: THREE.Mesh
const markerData = new Map<string, { mesh: THREE.Sprite; raw: Footprint }>()
const animatedComets: {
  mesh: THREE.Points
  curve: THREE.QuadraticBezierCurve3
  progress: number
}[] = []

let worldGeoJson: any = null
let countryGeoJson: any = null
let pointerDownPos = { x: 0, y: 0 }

// Update locations mapping for billboard
const updateScreenPositions = () => {
  if (!camera || !container.value) return

  const widthHalf = container.value.clientWidth / 2
  const heightHalf = container.value.clientHeight / 2
  const positions: Record<string, { x: number; y: number; visible: boolean }> = {}

  const cameraDir = new THREE.Vector3()
  camera.getWorldDirection(cameraDir)

  for (const [id, data] of markerData) {
    const pos = new THREE.Vector3().copy(data.mesh.position)

    // Check if the point is on the front side of the globe
    const dirToPoint = pos.clone().normalize()
    const dot = dirToPoint.dot(cameraDir)

    // if dot > 0 it's on the far side (behind the globe)
    // Actually, we are looking AT the globe, from camera, dot < 0 means facing camera.
    // Wait, a better way: raycast from camera to point, or just check distance to center.
    // Simpler: camera distance is > RADIUS, if angle between camera pos and point pos > 90deg, it's behind.
    const camPos = camera.position.clone().normalize()
    const isVisible = dirToPoint.dot(camPos) > 0.0

    pos.project(camera)

    positions[id] = {
      x: pos.x * widthHalf + widthHalf,
      y: -(pos.y * heightHalf) + heightHalf,
      visible: isVisible,
    }
  }

  emit('update-positions', positions)
}

function lngLatToVector3(lng: number, lat: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

function vector3ToLngLat(position: THREE.Vector3): [number, number] {
  const norm = position.clone().normalize()
  const phi = Math.acos(norm.y)
  const theta = Math.atan2(norm.z, -norm.x)
  const lat = 90 - (phi * 180) / Math.PI
  let lng = (theta * 180) / Math.PI - 180
  if (lng < -180) lng += 360
  if (lng > 180) lng -= 360
  return [lng, lat]
}

const drawGeoJSONLines = (
  feature: any,
  material: THREE.LineBasicMaterial,
  group: THREE.Group,
  zOffset = 0.1,
) => {
  const createRing = (ring: any[]) => {
    const points = ring.map((coords) => lngLatToVector3(coords[0], coords[1], RADIUS + zOffset))
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return new THREE.Line(geometry, material)
  }

  if (feature.geometry.type === 'Polygon') {
    feature.geometry.coordinates.forEach((ring: any[]) => {
      group.add(createRing(ring))
    })
  } else if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach((polygon: any[]) => {
      polygon.forEach((ring: any[]) => {
        group.add(createRing(ring))
      })
    })
  }
}

const loadWorldMap = async () => {
  try {
    // 采用同一个数据源 (Natural Earth 1:50m) 的不同行政级别图层，保证坐标拓扑100%完美重合
    const [countriesRes, provincesRes] = await Promise.all([
      // Admin 0: 国家级轮廓 (用于鼠标交互和高亮整个国家)
      fetch(
        'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_0_countries.geojson',
      ),
      // Admin 1: 省/州级轮廓 (用于作为地球的底图网格)
      fetch(
        'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_1_states_provinces.geojson',
      ),
    ])

    countryGeoJson = await countriesRes.json()
    worldGeoJson = await provincesRes.json()

    // 使用更底层的色彩物理学来分离“背景网格”和“高亮特效”
    const material = new THREE.LineBasicMaterial({
      color: 0x0369a1, // 使用极暗的正蓝色 (sky-700) 作为网格底色
      transparent: true,
      opacity: 0.35,
      // 恢复正常混合，由于本身颜色很暗，多根线叠加再密，上限也只会变成纯暗蓝色，永远达不到发光阈值
      blending: THREE.NormalBlending,
      depthWrite: false,
    })

    // 渲染全球范围内一统的省/州级地图
    worldGeoJson.features.forEach((feature: any) => {
      drawGeoJSONLines(feature, material, worldMapGroup)
    })

    // 填补 Admin-1 (省份数据) 中缺失的国家轮廓 (如日本)
    const missingCountries = ['Japan']
    missingCountries.forEach((name) => {
      if (countryGeoJson) {
        const countryFeature = countryGeoJson.features.find((f: any) => f.properties.NAME === name)
        if (countryFeature) {
          drawGeoJSONLines(countryFeature, material, worldMapGroup)
        }
      }
    })
  } catch (error) {
    console.error('Failed to load unified map GeoJSON arrays', error)
  }
}

const createFlyLine = (startLng: number, startLat: number, endLng: number, endLat: number) => {
  // 必须与目的地点的偏移量保持一致 (RADIUS + 0.5)，否则在 3D 视角下会因为深度和抛物曲率差导致视觉上的“脱节移位”
  const startPos = lngLatToVector3(startLng, startLat, RADIUS + 0.5)
  const endPos = lngLatToVector3(endLng, endLat, RADIUS + 0.5)
  // Calculate distance on sphere
  const dist = startPos.distanceTo(endPos)

  // Control point is midway, but elevated
  const midPos = startPos.clone().lerp(endPos, 0.5)
  midPos.normalize().multiplyScalar(RADIUS + dist * 0.4) // height scales with distance

  const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos)
  const points = curve.getPoints(50)

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Use LineBasicMaterial with gradient/fading or simply solid bright color for cyber feel
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(0x2dd4bf).multiplyScalar(1.2), // 柔和的青色微光
    transparent: true,
    opacity: 0.8,
  })

  return { line: new THREE.Line(geometry, material), curve }
}

const createGlowTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)') // 实心点
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)') // 保持中心完全实心
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)') // 极窄的泛光环（几乎只作为平滑抗锯齿使用）
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)') // 快速衰减透明
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

const createScene = () => {
  if (!container.value) return

  const width = container.value.clientWidth
  const height = container.value.clientHeight

  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)

  // Set default view on China (lng: 104, lat: 35) instead of setting default (0,0) and rotating
  const defaultPos = lngLatToVector3(104, 35, RADIUS * 2.5)
  camera.position.copy(defaultPos)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(0x000000, 0)
  container.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = RADIUS * 1.5
  controls.maxDistance = RADIUS * 5
  controls.enablePan = false
  controls.autoRotate = false // 关掉自转

  // Post processing - Bloom
  const renderScene = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    2.0, // strength
    0.5, // radius
    0.25, // threshold (合理的门槛)
  )

  composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  composer.addPass(bloomPass)

  // Earth base
  const earthGeometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)

  // Create solid dark inner sphere to occlude points on the back
  const innerSphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x030816,
    transparent: true,
    opacity: 0.95,
  })
  innerSphereMesh = new THREE.Mesh(earthGeometry, innerSphereMaterial)
  innerSphereMesh.userData = { type: 'sphere' }
  scene.add(innerSphereMesh)

  worldMapGroup = new THREE.Group()
  scene.add(worldMapGroup)
  loadWorldMap()

  selectedCountryGroup = new THREE.Group()
  scene.add(selectedCountryGroup)

  // Wireframe outer sphere (Optional: keep extremely faint faint grid over countries)
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
  })
  const wireframeSphere = new THREE.LineSegments(
    new THREE.WireframeGeometry(earthGeometry),
    wireframeMaterial,
  )
  scene.add(wireframeSphere)

  // Add markers
  markersGroup = new THREE.Group()
  scene.add(markersGroup)

  const glowTex = createGlowTexture()

  props.footprints.forEach((fp) => {
    const pos = lngLatToVector3(fp.lng, fp.lat, RADIUS + 0.5)

    // 1. Destination Point - Fixed size on screen using PointsMaterial
    const dotGeometry = new THREE.BufferGeometry().setFromPoints([pos])
    const dotMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8, // sky-400
      size: 6,
      sizeAttenuation: false,
      map: glowTex,
      transparent: true,
      opacity: 1,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const dot = new THREE.Points(dotGeometry, dotMaterial)
    dot.renderOrder = 10
    dot.frustumCulled = false
    dot.userData = { id: fp.id, type: 'marker' }

    // We add an invisible larger sprite so it's easier to click
    const hitboxMat = new THREE.SpriteMaterial({ transparent: true, opacity: 0 })
    const hitbox = new THREE.Sprite(hitboxMat)
    hitbox.position.copy(pos)
    hitbox.scale.set(1.5, 1.5, 1.5)
    hitbox.userData = { id: fp.id, type: 'marker' }

    markersGroup.add(dot)
    markersGroup.add(hitbox)

    // Save the hitbox as the reference for positions/clicks
    markerData.set(fp.id, { mesh: hitbox, raw: fp })

    // Add flyline from origin to destination without origin marker
    if (fp.fromLng && fp.fromLat) {
      const { line, curve } = createFlyLine(fp.fromLng, fp.fromLat, fp.lng, fp.lat)
      markersGroup.add(line)

      // Add comet to the flyline animation queue
      const cometGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)])
      const cometMat = new THREE.PointsMaterial({
        color: new THREE.Color(0x38bdf8).multiplyScalar(2.0), // 极客蓝做基础明亮的实体发光
        size: 3,
        sizeAttenuation: false,
        map: glowTex,
        transparent: true,
        opacity: 1.0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const comet = new THREE.Points(cometGeo, cometMat)
      comet.frustumCulled = false
      markersGroup.add(comet)
      animatedComets.push({ mesh: comet, curve, progress: Math.random() }) // Random start offset
    }
  })

  // Raycaster for hover/click
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Events
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointerup', onPointerUp)
  window.addEventListener('resize', onWindowResize)

  // Start loop
  animate()
}

// Removed unused hoveredMesh

const onPointerDown = (e: PointerEvent) => {
  pointerDownPos = { x: e.clientX, y: e.clientY }
}

const onPointerUp = (e: PointerEvent) => {
  const dx = e.clientX - pointerDownPos.x
  const dy = e.clientY - pointerDownPos.y
  // If dragged less than 5 pixels, treat as a click
  if (Math.sqrt(dx * dx + dy * dy) < 5) {
    onClick(e)
  }
}

const onMouseMove = (event: MouseEvent) => {
  if (!container.value) return
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(
    markersGroup.children.filter((c) => c.userData.type === 'marker'),
  )

  if (intersects.length > 0) {
    renderer.domElement.style.cursor = 'pointer'
    // 不再对目标进行 scale 放大了。因为目前目标不再是独立的大型 Sprite 贴图组件，
    // 而是作为 Points 存在，强行对点进行大比例的 Scale 放大有时会导致几何体包围盒失常，
    // 并且我们外层已经配合 Tailwind HTML Billboard 加了 hover 交互了，取消引擎内对 scale 的控制。
  } else {
    renderer.domElement.style.cursor = 'auto'
  }
}

const onClick = (event: MouseEvent) => {
  if (!container.value) return
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(
    markersGroup.children.filter((c) => c.userData.type === 'marker'),
  )
  let clickedMarker: THREE.Object3D | null = null
  if (intersects.length > 0 && intersects[0]) {
    clickedMarker = intersects[0].object
  }

  if (clickedMarker && clickedMarker.userData.id) {
    const data = markerData.get(clickedMarker.userData.id)
    if (data) {
      emit('click-point', data.raw)
      flyTo(data.mesh.position)
      highlightCountry(data.raw.lng, data.raw.lat)
    }
  } else {
    // Check if clicked the earth itself
    const earthIntersects = raycaster.intersectObject(innerSphereMesh)

    if (earthIntersects.length > 0 && earthIntersects[0]) {
      const point = earthIntersects[0].point
      const [lng, lat] = vector3ToLngLat(point)

      const feature = highlightCountry(lng, lat)

      if (feature) {
        emit('click-point', null as any) // Close any open marker billboard
        // Fly to the geographic center of the country instead of the clicked spot
        const centroid = geoCentroid(feature)
        const targetPos = lngLatToVector3(centroid[0], centroid[1], RADIUS)
        flyTo(targetPos)
      } else {
        // Clicked ocean or non-country area: clear highlight
        emit('click-point', null as any)
        clearHighlight()
      }
    } else {
      // Clicked deep space: clear everything
      emit('click-point', null as any)
      clearHighlight()
    }
  }
}

const clearHighlight = () => {
  while (selectedCountryGroup.children.length > 0) {
    const child = selectedCountryGroup.children[0]
    if (child) {
      selectedCountryGroup.remove(child)
    } else {
      break
    }
  }
}

const highlightCountry = (lng: number, lat: number) => {
  clearHighlight()

  if (!countryGeoJson) return null

  const point: [number, number] = [lng, lat]
  const feature = countryGeoJson.features.find((f: any) => geoContains(f, point))

  if (feature) {
    const highlightMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xf43f5e).multiplyScalar(1.2), // 微调 1.2 倍柔和发光，不再刺眼
      linewidth: 2, // may not work in all WebGL implementations
      transparent: true,
      opacity: 0.9,
      depthWrite: false, // 防止写入深度缓冲遮挡住同高度的目的地节点
    })
    drawGeoJSONLines(feature, highlightMaterial, selectedCountryGroup, 0.5)

    // Find the sub-region (province/state) for more detail
    const subFeature = worldGeoJson?.features.find((f: any) => geoContains(f, point))

    const countryName = feature.properties.NAME_ZH || feature.properties.NAME
    const subName = subFeature ? subFeature.properties.NAME_ZH || subFeature.properties.NAME : null

    emit('select-country', { name: countryName, sub: subName !== countryName ? subName : null })
    return feature
  }

  emit('select-country', null)
  return null
}

const flyTo = (targetPosition: THREE.Vector3) => {
  const targetCamPos = targetPosition
    .clone()
    .normalize()
    .multiplyScalar(RADIUS * 1.8)

  gsap.to(camera.position, {
    x: targetCamPos.x,
    y: targetCamPos.y,
    z: targetCamPos.z,
    duration: 1.5,
    ease: 'power3.inOut',
    onUpdate: () => controls.update(),
  })
}

const onWindowResize = () => {
  if (!container.value || !camera || !renderer) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  composer.setSize(width, height)
}

let animFrame: number
const animate = () => {
  animFrame = requestAnimationFrame(animate)

  // Update animated comets moving along fly lines
  const time = Date.now() * 0.002
  animatedComets.forEach((item, index) => {
    item.progress += 0.002 // 降低速度，原来是 0.01，现在放慢 5 倍，让它有种卫星划过夜空的悠长感
    if (item.progress > 1) {
      item.progress = 0
    }
    const currPos = item.curve.getPoint(item.progress)
    const positionAttribute = item.mesh.geometry.attributes.position
    if (positionAttribute) {
      const positions = positionAttribute.array
      positions[0] = currPos.x
      positions[1] = currPos.y
      positions[2] = currPos.z
      positionAttribute.needsUpdate = true
    }

    // 给移动的小球增加呼吸般忽明忽暗的赛博脉冲感 (Opacity roughly between 0.3 and 1.0)
    const material = item.mesh.material as THREE.PointsMaterial
    // 使用每根飞线不同的相位 (index) 并且叠加一个正弦波
    material.opacity = 0.5 + 0.5 * Math.sin(time + index * 1.5)
  })

  controls.update()
  updateScreenPositions()
  composer.render()
}

watch(
  () => props.activeId,
  (newId) => {
    if (newId) {
      const data = markerData.get(newId)
      if (data) {
        flyTo(data.mesh.position)
        highlightCountry(data.raw.lng, data.raw.lat)
      }
    } else {
      // We intentionally do not resume rotation or clear highlights here automatically.
      // If the user clicks the "X" of a billboard to close it, or toggles off the side menu list,
      // they don't necessarily want the earth to spin away immediately.
      // Instead, they can click "deep space" (or the background) to cleanly reset rotation.
    }
  },
)

onMounted(() => {
  createScene()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrame)

  // 1. Kill any active GSAP animations
  gsap.killTweensOf(camera.position)

  // 2. Remove Event Listeners
  if (renderer) {
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('pointerdown', onPointerDown)
    renderer.domElement.removeEventListener('pointerup', onPointerUp)
    renderer.domElement.removeEventListener('click', onClick)
  }
  window.removeEventListener('resize', onWindowResize)

  // 3. Free WebGL Geometries, Materials and Textures from GPU Memory
  if (scene) {
    scene.traverse((object: any) => {
      if (!object.isMesh && !object.isLine && !object.isPoints && !object.isSprite) return

      if (object.geometry) {
        object.geometry.dispose()
      }

      if (object.material) {
        // Materials can be arrays
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => {
            if (material.map) material.map.dispose()
            material.dispose()
          })
        } else {
          if (object.material.map) object.material.map.dispose()
          object.material.dispose()
        }
      }
    })
  }

  // 4. Dispose High-level Three.js controllers
  if (composer) composer.dispose()
  if (controls) controls.dispose()
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
})
</script>

<template>
  <div
    ref="container"
    class="relative h-full w-full overflow-hidden rounded-xl bg-slate-950 shadow-2xl ring-1 ring-white/10 dark:ring-white/5"
  >
    <!-- Overlay gradient to give depth -->
    <div
      class="bg-radial-gradient pointer-events-none absolute inset-0 z-10 from-transparent via-slate-950/40 to-slate-950/90"
    />
  </div>
</template>

<style scoped>
.bg-radial-gradient {
  background-image: radial-gradient(
    circle at center,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-via) 60%,
    var(--tw-gradient-to) 100%
  );
}
</style>
