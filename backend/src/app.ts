import express from 'express'
import cors from 'cors'
import { router } from './routes/index.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { env } from './config/env.js'

const app = express()

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'backend' })
})

app.use('/api', router)
app.use(notFound)
app.use(errorHandler)

export default app
