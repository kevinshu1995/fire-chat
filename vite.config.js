import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const fs = require('fs')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(`${__dirname}/src/assets/localhost-key.pem`),
      cert: fs.readFileSync(`${__dirname}/src/assets/localhost.pem`),
    },
  },
})
