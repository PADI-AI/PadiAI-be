import express from 'express'

const app = express()
const port = 3000

app.get('/quiz', (req, res) => {
    res.send('')
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
