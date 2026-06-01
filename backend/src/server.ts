import 'dotenv/config'
import { createServer } from 'node:http'
import app from './app.js'
import { env } from './config/env.js'

const server = createServer(app)

server.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`)
})
