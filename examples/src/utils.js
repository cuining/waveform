export async function getAudioBuffer(path) {
  const response = await fetch(path)
  const audioData = await response.arrayBuffer()

  const context = getContext()
  return new Promise(resolve => {
    context.decodeAudioData(audioData, buffer => {
      return resolve(buffer)
    })
  })
}

export function getContext() {
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext
  const context = new AudioContext()
  return context
}

export function normalizedWaveform(data) {
  const maxValue = Math.max(...data.map(i => Math.abs(i)))
  return data.map(i => i / maxValue)
}
