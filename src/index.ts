import { getApp } from './app'

const server = getApp({ logger: true })

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

const start = async () => {
    try {
        await server.listen({ port: PORT })
        console.log(`App starting on port ${PORT}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
