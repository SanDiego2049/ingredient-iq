import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['tests/load/**', 'node_modules/**'],
  },
})
