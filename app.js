import express from 'express'
const port = 6666
const app = express()

const API_KEY = process.env.API_KEY

app.post('/completions', async(req, res) => {

  const options = {
    method:"POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model : "gpt-3.5-turbo",
      messages : [{ role: "user", content: req.body.message}],
      max_tokens: 200,
    })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options)
    const data = await response.json()
    res.send(data)
  } catch (error) {
    console.error(error)
  }
})

app.get('/quiz', (req, res) => {
    res.send('hello')
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

