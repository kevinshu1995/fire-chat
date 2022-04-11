import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const fs = require('fs')

import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync(`${__dirname}/src/assets/localhost-key.pem`),
      cert: fs.readFileSync(`${__dirname}/src/assets/localhost.pem`),
    },
  },
})
