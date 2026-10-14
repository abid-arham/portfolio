"use client"

import { type CSSProperties, useEffect, useMemo, useRef } from "react"

import "./depth-text.css"

/**
 * Extruded 3D type, adapted from React Bits' DepthText.
 *
 * Two changes from the original:
 *  - Ported to TypeScript, and the colours default to the site's own tokens
 *    (`--ink` / `--accent`) so the extrusion follows light and dark mode.
 *  - The animation loop stops once the rotation settles instead of running
 *    requestAnimationFrame forever. The original keeps a frame scheduled for
 *    the life of the page, which is main-thread work for a stationary word.
 */

const MAX_LAYERS = 64

/** Below this, a frame changes the rendered transform by less than a pixel. */
const SETTLED_DEGREES = 0.01

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const getLayerColor = (
  faceColor: string,
  depthColor: string,
  index: number,
  total: number
) => {
  const progress = total <= 1 ? 1 : index / total
  const eased = progress * progress
  const faceMix = Math.round((1 - eased) * 72 + 4)
  return `color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor})`
}

const getTransform = (rotateX: number, rotateY: number) =>
  `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`

export interface DepthTextProps {
  text: string
  /** Stacked copies forming the extrusion. Each one is a DOM node — keep it modest. */
  layers?: number
  /** Pixels between layers. */
  depth?: number
  faceColor?: string
  depthColor?: string
  /** Maximum pointer-driven rotation, in degrees. */
  tilt?: number
  pointerTracking?: boolean
  smoothing?: number
  perspective?: number
  /** Drifts continuously. Costs a frame forever — off by default here. */
  autoOrbit?: boolean
  orbitSpeed?: number
  fontSize?: string
  fontWeight?: number | string
  shadow?: boolean
  className?: string
  style?: CSSProperties
}

export function DepthText({
  text,
  layers = 20,
  depth = 2,
  faceColor = "var(--ink)",
  depthColor = "var(--accent)",
  tilt = 7.5,
  pointerTracking = true,
  smoothing = 0.14,
  perspective = 900,
  autoOrbit = false,
  orbitSpeed = 0.35,
  fontSize = "clamp(2.5rem, 8vw, 5rem)",
  fontWeight = 400,
  shadow = true,
  className = "",
  style = {},
}: DepthTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const stageRef = useRef<HTMLSpanElement>(null)

  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS)
  const safeDepth = clamp(Number(depth) || 0, 0, 12)
  const safeTilt = clamp(Number(tilt) || 0, 0, 12)
  const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35)
  const safePerspective = clamp(Number(perspective) || 900, 300, 2000)
  const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2)

  const baseRotation = useMemo(
    () => ({ x: -safeTilt * 0.32, y: safeTilt * 0.42 }),
    [safeTilt]
  )

  const depthLayers = useMemo(
    () =>
      Array.from({ length: safeLayers }, (_, layerIndex) => {
        const index = safeLayers - layerIndex
        return {
          index,
          color: getLayerColor(faceColor, depthColor, index, safeLayers),
          transform: `translateZ(${-index * safeDepth}px)`,
        }
      }),
    [safeLayers, safeDepth, faceColor, depthColor]
  )

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const canTrackPointer = pointerTracking && finePointer && !reducedMotion

    const current = { ...baseRotation }
    const target = { ...baseRotation }

    const applyTransform = () => {
      stage.style.transform = getTransform(current.x, current.y)
    }

    applyTransform()

    // Reduced motion, or nothing that could ever move it: render the resting
    // pose once and never schedule a frame.
    if (reducedMotion || (!canTrackPointer && !autoOrbit)) return

    let frameId = 0
    let running = false
    let activePointer = false
    const startTime = performance.now()

    const settled = () =>
      Math.abs(target.x - current.x) < SETTLED_DEGREES &&
      Math.abs(target.y - current.y) < SETTLED_DEGREES

    const tick = (now: number) => {
      if (autoOrbit && (!canTrackPointer || !activePointer)) {
        const elapsed = (now - startTime) / 1000
        const orbit = elapsed * safeOrbitSpeed * Math.PI * 2
        const fallbackAmount = canTrackPointer ? 0.18 : 0.55
        target.x = baseRotation.x + Math.sin(orbit) * safeTilt * fallbackAmount
        target.y = baseRotation.y + Math.cos(orbit * 0.85) * safeTilt * fallbackAmount
      }

      current.x += (target.x - current.x) * safeSmoothing
      current.y += (target.y - current.y) * safeSmoothing
      applyTransform()

      // With autoOrbit the target keeps moving, so this never settles and the
      // loop runs on. Without it, the word comes to rest and we stand down.
      if (!autoOrbit && settled()) {
        running = false
        return
      }
      frameId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      frameId = requestAnimationFrame(tick)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      activePointer = true
      const x = clamp(
        (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8),
        -1,
        1
      )
      const y = clamp(
        (event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8),
        -1,
        1
      )

      target.x = baseRotation.x - y * safeTilt
      target.y = baseRotation.y + x * safeTilt
      start()
    }

    const handlePointerLeave = () => {
      activePointer = false
      target.x = baseRotation.x
      target.y = baseRotation.y
      start()
    }

    if (canTrackPointer) {
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerleave", handlePointerLeave)
      window.addEventListener("blur", handlePointerLeave)
    }

    if (autoOrbit) start()

    return () => {
      if (canTrackPointer) {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerleave", handlePointerLeave)
        window.removeEventListener("blur", handlePointerLeave)
      }
      cancelAnimationFrame(frameId)
    }
  }, [
    autoOrbit,
    baseRotation,
    pointerTracking,
    safeOrbitSpeed,
    safeSmoothing,
    safeTilt,
  ])

  const rootStyle = {
    ...style,
    "--depth-text-perspective": `${safePerspective}px`,
    "--depth-text-font-size": fontSize,
    "--depth-text-font-weight": fontWeight,
    "--depth-text-face-color": faceColor,
    "--depth-text-shadow": shadow
      ? `0 18px 30px color-mix(in srgb, ${depthColor} 22%, transparent)`
      : "none",
  } as CSSProperties

  return (
    <span ref={rootRef} className={`depth-text ${className}`.trim()} style={rootStyle}>
      <span ref={stageRef} className="depth-text__stage">
        {depthLayers.map((layer) => (
          <span
            aria-hidden="true"
            className="depth-text__layer"
            key={layer.index}
            style={{ color: layer.color, transform: layer.transform }}
          >
            {text}
          </span>
        ))}
        <span className="depth-text__face">{text}</span>
      </span>
    </span>
  )
}
