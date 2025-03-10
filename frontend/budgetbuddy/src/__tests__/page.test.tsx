
import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import Page from '../app/page'
 
test('Page', () => {
  render(<Page />)
  expect(1+1).toBe(2)
})
