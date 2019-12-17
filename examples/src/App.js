import React, { useState, useRef } from 'react'
import ReactJson from 'react-json-view'
import Waveform from '@zcool/waveform'
import defaultTheme from '@zcool/waveform'
import { getAudioBuffer, normalizedWaveform } from './utils'
import mock from './mock.json'

function App() {
  const [waveform, setWaveform] = useState(normalizedWaveform(mock))
  const [progress, setProgress] = useState(0.2)
  const forceUpdateKey = useRef(0)
  const [, dispatch] = useState()

  const forceUpdate = () => {
    forceUpdateKey.current += 1
    dispatch(forceUpdateKey.current)
  }

  const [theme, setTheme] = useState(defaultTheme)

  const handleChange = e => {
    const files = e.target.files
    if (files.length > 0) {
      const file = window.URL.createObjectURL(files[0])
      getAudioBuffer(file).then(buffer => {
        setWaveform(Array.from(buffer.getChannelData(0)))
        forceUpdate()
      })
    }
  }

  const handleThemeChange = newTheme => {
    setTheme(newTheme.updated_src)
    forceUpdate()
  }

  return (
    <div id="waveform-demo">
      <h4>@zcool/waveform</h4>
      <h6>component demo</h6>
      <div className="waveform-options">
        <div>
          <label htmlFor="audio">upload audio file</label>
          <input name="audio" type="file" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="activeColors">custom theme</label>
          <ReactJson
            src={theme}
            iconStyle="circle"
            theme="ocean"
            enableClipboard={false}
            onEdit={handleThemeChange}
          />
        </div>
      </div>

      <div className="waveform-container">
        {waveform.length > 0 && (
          <Waveform
            key={forceUpdateKey.current}
            progress={progress}
            onMouseUp={setProgress}
            data={waveform}
            renderGhostProgress={x => (
              <span className="ghost-progress-label" style={{ left: x }}>
                {x.toFixed(0)}
              </span>
            )}
            theme={theme}
            showGhostProgress
          />
        )}
      </div>
    </div>
  )
}

export default App
