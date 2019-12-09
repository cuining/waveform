import React, { FC, useState, useMemo, useRef, useEffect } from 'react'
import drawWaveform, { getWaveformBars } from './draw'
import defaultTheme, { Theme } from './theme'

export interface WaveformProps {
  progress: number // 音轨的播放进度
  data: Array<number> // 波形数据
  onMouseUp?: (progress: number) => void // 音轨点击时触发
  showGhostProgress?: boolean
  onGhostProgressChange?: (ghostProgress: number) => void
  theme: Theme
  height?: number
}

const Waveform: FC<WaveformProps> = ({
  progress,
  data,
  showGhostProgress,
  onGhostProgressChange,
  onMouseUp,
  theme,
  height
}) => {
  const canvasRef = useRef(null)
  const cachedBars = useRef(null)
  const leftRef = useRef(0)

  const [ghostProgress, setGhostProgress] = useState(0)

  let rafId
  let timer

  if (theme) {
    theme = Object.assign(defaultTheme, theme)
  } else {
    theme = defaultTheme
  }

  useEffect(() => {
    draw()
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [progress, ghostProgress, data])

  function draw() {
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        rafId = undefined
        drawWaveform({
          bars: getBars(),
          ghostProgress,
          theme,
          canvas: canvasRef.current,
          playbackProgress: progress
        })
      })
    }
  }

  function getBars() {
    if (!cachedBars.current && data && data.length > 0) {
      cachedBars.current = getWaveformBars(data, canvasRef.current.offsetWidth, defaultTheme)
    }
    return cachedBars.current
  }

  function getMousePosition(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!showGhostProgress) {
      return
    }

    if (timer) clearTimeout(timer)

    const { clientX, currentTarget } = e
    timer = setTimeout(() => {
      const p = calculateProgress(clientX, currentTarget)
      setGhostProgress(p)

      if (onGhostProgressChange) {
        onGhostProgressChange(p)
      }
    }, 0)
  }

  function calculateProgress(x: number, t: EventTarget & HTMLCanvasElement) {
    leftRef.current = x - t.getBoundingClientRect().left

    return leftRef.current / t.offsetWidth
  }

  function clearGhostProgress() {
    if (!showGhostProgress) {
      return
    }

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      setGhostProgress(0)
    }, 0)
  }

  function handleMouseUp() {
    if (showGhostProgress && onMouseUp) {
      onMouseUp(ghostProgress)
    }
  }

  return useMemo(
    () => (
      <canvas
        ref={canvasRef}
        onMouseEnter={getMousePosition}
        onMouseMove={getMousePosition}
        onMouseLeave={clearGhostProgress}
        onMouseUp={handleMouseUp}
        style={{
          height,
          width: '100%',
          imageRendering: 'pixelated',
          display: 'block'
        }}
      />
    ),
    [ghostProgress, progress, data]
  )
}

Waveform.defaultProps = {
  height: 44,
  showGhostProgress: false
}

export default Waveform
