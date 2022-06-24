import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(morgan('tiny'))

app.get('/', (req, res) => {
    console.log(req)
    res.send('hello')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.debug('App listening on :3000')
})
