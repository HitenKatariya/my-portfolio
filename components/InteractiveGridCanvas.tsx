"use client"

import { useEffect, useRef } from "react"

const CELL_SIZE = 26
const GLOW_RADIUS = 5
const DECAY = 0.92
const BASE_FILL = "rgba(148, 163, 184, 0.028)"
const GRID_LINE = "rgba(148, 163, 184, 0.06)"

const GLOW_COLORS: readonly [number, number, number][] = [
  [39, 203, 203],
  [59, 130, 246],
  [38, 216, 104],
  [168, 85, 247],
  [234, 179, 8],
]

type GridState = {
  cols: number
  rows: number
  intensity: Float32Array
  colorIndex: Uint8Array
}

const createGridState = (cols: number, rows: number): GridState => ({
  cols,
  rows,
  intensity: new Float32Array(cols * rows),
  colorIndex: new Uint8Array(cols * rows),
})

const InteractiveGridCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<GridState | null>(null)
  const activeRef = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      gridRef.current = createGridState(
        Math.ceil(width / CELL_SIZE),
        Math.ceil(height / CELL_SIZE),
      )
    }

    const updateScrollState = () => {
      const hero = document.getElementById("home")
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight
      activeRef.current = window.scrollY >= heroBottom * 0.72
    }

    const drawBaseGrid = (width: number, height: number, cols: number, rows: number) => {
      const pad = 1
      const size = CELL_SIZE - pad * 2

      ctx.fillStyle = BASE_FILL
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          ctx.fillRect(col * CELL_SIZE + pad, row * CELL_SIZE + pad, size, size)
        }
      }

      ctx.strokeStyle = GRID_LINE
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= cols; x++) {
        ctx.moveTo(x * CELL_SIZE + 0.5, 0)
        ctx.lineTo(x * CELL_SIZE + 0.5, height)
      }
      for (let y = 0; y <= rows; y++) {
        ctx.moveTo(0, y * CELL_SIZE + 0.5)
        ctx.lineTo(width, y * CELL_SIZE + 0.5)
      }
      ctx.stroke()
    }

    const drawGlowCell = (col: number, row: number, intensity: number, colorIdx: number) => {
      const pad = 1
      const size = CELL_SIZE - pad * 2
      const [r, g, b] = GLOW_COLORS[colorIdx % GLOW_COLORS.length]
      const alpha = Math.min(intensity * 0.85, 0.95)

      ctx.save()
      ctx.shadowBlur = 16 * intensity
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`
      ctx.fillRect(col * CELL_SIZE + pad, row * CELL_SIZE + pad, size, size)
      ctx.restore()
    }

    const render = () => {
      const grid = gridRef.current
      if (!grid) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      const { cols, rows, intensity, colorIndex } = grid

      ctx.clearRect(0, 0, width, height)
      drawBaseGrid(width, height, cols, rows)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col
          if (intensity[idx] > 0.02) {
            drawGlowCell(col, row, intensity[idx], colorIndex[idx])
            intensity[idx] *= DECAY
          } else {
            intensity[idx] = 0
          }
        }
      }

      rafRef.current = requestAnimationFrame(render)
    }

    const illuminate = (clientX: number, clientY: number) => {
      if (!activeRef.current || reducedMotion) return

      const grid = gridRef.current
      if (!grid) return

      const { cols, rows, intensity, colorIndex } = grid
      const centerCol = Math.floor(clientX / CELL_SIZE)
      const centerRow = Math.floor(clientY / CELL_SIZE)

      for (let dy = -GLOW_RADIUS; dy <= GLOW_RADIUS; dy++) {
        for (let dx = -GLOW_RADIUS; dx <= GLOW_RADIUS; dx++) {
          const col = centerCol + dx
          const row = centerRow + dy
          if (col < 0 || row < 0 || col >= cols || row >= rows) continue

          const dist = Math.hypot(dx, dy)
          if (dist > GLOW_RADIUS) continue

          const falloff = 1 - dist / (GLOW_RADIUS + 0.35)
          const idx = row * cols + col
          const next = falloff * (0.55 + Math.random() * 0.45)

          if (next > intensity[idx]) {
            intensity[idx] = next
            colorIndex[idx] = Math.floor(Math.random() * GLOW_COLORS.length)
          }
        }
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      illuminate(event.clientX, event.clientY)
    }

    resize()
    updateScrollState()
    rafRef.current = requestAnimationFrame(render)

    window.addEventListener("resize", resize)
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 will-change-transform"
    />
  )
}

export default InteractiveGridCanvas
