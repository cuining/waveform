import React from 'react'
import { cleanup, render } from '@testing-library/react'
import Waveform from '../src/index'

afterEach(() => {
  cleanup()
})

it('should render waveform with correct DOM structure', () => {
  const result = render(<Waveform data={[]} progress={0.6} />)

  // TODO
})
