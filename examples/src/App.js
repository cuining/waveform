import React, { useState } from 'react'
import Waveform from '@zcool/waveform'

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

  function handleChange(e) {
    const files = e.target.files
    const file = window.URL.createObjectURL(files[0])
    getAudioBuffer(file).then(buffer => {
      setWaveform(Array.from(buffer.getChannelData(0)))
    })
  }

  return (
    <div id="waveform-demo">
      <input type="file" onChange={handleChange} style={{ marginBottom: 24 }} />
      {waveform.length > 0 && (
        <Waveform
          progress={0.5}
          data={waveform}
          onGhostProgressChange={p => console.log(p)}
          showGhostProgress
        />
      )}
    </div>
  )
}

export default App
