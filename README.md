# waveform

Draw audio waveforms

## Table of Contents

- [waveform](#waveform)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [API documentation](#api-documentation)
  - [Examples](#examples)
  - [Demos](#demos)

## Installation

To install, you can use [npm](https://npmjs.org/) or [yarn](https://yarnpkg.com):

    $ npm install @zcool/waveform
    $ yarn add @zcool/waveform

## API documentation

| Name              | Type                       | Default         | Description                                                                          |
| ----------------- | -------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| progress          | float                      | `null`          | progress of playback. 0-1                                                            |
| data              | number[]                   | `null`          | waveform data                                                                        |
| height            | number                     | `44`            | waveform height                                                                      |
| theme             | Object                     | `/src/theme.ts` | waveform theme                                                                       |
| onMouseUp         | (progress: number) => void | `null`          | waveform click event                                                                 |
| showGhostProgress | boolean                    | false           | If showGhostProgress is true, the waveform will show a ghostProgress when mouse move |

## Examples

Here is a simple example of waveform being used in an app:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Waveform from '@zcool/waveform'

const getAudioBuffer = async path => {
  const response = await fetch(path)
  const audioData = await response.arrayBuffer()

  const context = getContext()
  return new Promise(resolve => {
    context.decodeAudioData(audioData, buffer => {
      return resolve(buffer)
    })
  })
}

/**
 * Get window audio context
 */
const getContext = () => {
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
    <div>
      <input type="file" onChange={handleChange} style={{ marginBottom: 24 }} />
      {waveform.length > 0 && <Waveform progress={0.5} data={waveform} />}
    </div>
  )
}

ReactDOM.render(<App />, appElement)
```

You can find more examples in the `examples` directory, which you can run in a
local development server using `npm start` or `yarn run start`.

## Demos

There are several demos hosted on [CodeSandbox](https://codesandbox.io/) which
demonstrate various features of @zcool/waveform:

- [Minimal example](https://codesandbox.io/s/vibrant-framework-wy6go)
