import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:"/ToDo",
  plugins: [react()],
  test: {  
    globals: true, // Allow the use of global variables like describe, it, etc.  
    environment: 'jsdom', // Specify the testing environment 
    setupFiles: './src/test/setupTest.jsx',   
  },  
})
