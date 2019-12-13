import React, { useState } from 'react'
import Waveform from '@zcool/waveform'
import defaultTheme from '@zcool/waveform/theme'

export const getAudioBuffer = async path => {
  const response = await fetch(path)
  const audioData = await response.arrayBuffer()

  const context = getContext()
  return new Promise(resolve => {
    context.decodeAudioData(audioData, buffer => {
      return resolve(buffer)
    })
  })
}

export const getContext = () => {
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext
  const context = new AudioContext()
  return context
}

function App() {
  const [waveform, setWaveform] = useState([])

  const [theme, setTheme] = useState(defaultTheme)

  const handleChange = e => {
    const files = e.target.files
    const file = window.URL.createObjectURL(files[0])
    getAudioBuffer(file).then(buffer => {
      setWaveform(Array.from(buffer.getChannelData(0)))
    })
  }

  const handleBarWidthChange = e => {
    const { value } = e.target
    theme.bars.width = parseInt(value, 10)
    setTheme(theme)
  }

  const handleColorChange = e => {
    console.log(e.target.value)
  }

  return (
    <div id="waveform-demo">
      <input type="file" onChange={handleChange} style={{ marginBottom: 24 }} />
      <input
        type="number"
        onChange={handleBarWidthChange}
        step={1}
        min={0}
        max={5}
        placeholder="bar width"
      />
      <input type="color" onChange={handleColorChange} />
      {waveform.length > 0 && (
        <Waveform
          progress={0.5}
          data={waveform}
          renderGhostProgress={x => (
            <span className="ghost-progress-label" style={{ left: x }}>
              {x}
            </span>
          )}
          showGhostProgress
        />
      )}
    </div>
  )
}

export default App
