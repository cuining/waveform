import { Theme } from './theme'

export interface DrawProps {
  bars: {
    width: number
    gap: number
    max: number[]
    min: number[]
  }
  theme: Theme
  canvas: HTMLCanvasElement
  playbackProgress: number
  ghostProgress: number
}

export function backingScale() {
  return (
    window.devicePixelRatio ||
    (window as any).webkitDevicePixelRatio ||
    (window as any).mozDevicePixelRatio ||
    1
  )
}

export function getWaveformBars(waveform: Array<number>, width: number, theme: Theme) {
  const bars = {
    width: theme.bars.width / width,
    gap: theme.bars.gap / width,
    max: [],
    min: []
  }

  const step = Math.floor(Math.max(0, (1 - bars.gap) / (bars.width + bars.gap)))
  const count = waveform.length / step

  for (let i = 0; i < step; i++) {
    let start = Math.floor(i * count)
    let end = start + Math.max(1, Math.round(count))

    if (end > waveform.length) {
      start = Math.max(0, start - (end - waveform.length))
      end = waveform.length
    }

    const bounds = waveform.slice(start, end)
    const l = Math.max.apply(Math, [0].concat(bounds.map(n => Math.abs(n))))
    bars.max.push(l)
    bars.min.push(-l)
  }

  return bars
}

export default function drawWaveform({
  bars,
  theme,
  canvas,
  playbackProgress = 0,
  ghostProgress
}: DrawProps) {
  const ratio = backingScale()

  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio

  const ctx = canvas.getContext('2d')
  ctx.scale(canvas.width, canvas.height)

  const progressAspect = (theme.progressBar.width * ratio) / canvas.width

  function drawBackground(color: string | Array<string>, x0: number, x1: number) {
    if ('string' === typeof color) {
      ctx.fillStyle = color
    } else {
      const gradient = ctx.createLinearGradient(x0, 0, x1, 0)
      color.forEach((c, index) => gradient.addColorStop(index, c))
      ctx.fillStyle = gradient
    }
  }

  function drawBars(bounds: Array<number>, x0: number, x1: number, color: string | Array<string>) {
    drawBackground(color, x0, x1)
    bounds.forEach((bound, index) => {
      const boundX0 = bars.gap + index * (bars.width + bars.gap)
      if (boundX0 + bars.width >= boundX0 && boundX0 <= x1) {
        const barHeight = 0.5 * bound * theme.bars.maxAmplitude * 1
        if (Math.abs(barHeight) > 0.01) {
          ctx.fillRect(boundX0, 0.5, bars.width, barHeight)
        }
      }
    })
  }

  function draw(
    x0: number = 0,
    x1: number,
    colors: {
      topBars: string | Array<string>
      bottomBars: string | Array<string>
    },
    alpha: number = 1
  ) {
    if (x0 > x1) {
      // 交换
      ;[x0, x1] = [x1, x0]
    }

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.rect(x0, 0, x1 - x0, 1)
    ctx.clip()

    if (bars) {
      drawBars(bars.min, x0, x1, colors.topBars)
      drawBars(bars.max, x0, x1, colors.bottomBars)
    }

    ctx.restore()
  }

  function drawProgressBar(progress: number, alpha: number = 1) {
    if (progressAspect && progress) {
      ctx.globalAlpha = alpha
      ctx.fillStyle = theme.progressBar.color
      const x0 = Math.round(progress * canvas.width) / canvas.width
      ctx.fillRect(x0, 0, -progressAspect, 1)
      ctx.globalAlpha = 1
    }
  }

  draw(playbackProgress, 1, theme.offColors)

  if (playbackProgress) {
    draw(0, playbackProgress, theme.activeColors)
  }

  if (ghostProgress) {
    let colors = ghostProgress > playbackProgress ? theme.activeColors : theme.offColors
    draw(playbackProgress, ghostProgress, colors, theme.ghostOpacity)
    drawProgressBar(ghostProgress, theme.progressBar.ghostOpacity)
  }

  drawProgressBar(playbackProgress)
}
