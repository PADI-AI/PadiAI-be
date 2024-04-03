import express from 'express'
const port = 1234
const app = express()
app.use(express.json());

const API_KEY = "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"

import fs from 'fs'

// Read the content of answer.json
const answerContent = JSON.parse(fs.readFileSync('answer.json', 'utf-8'));

// app.get("/", (req, res) => {
//     res.send("hello");
// })

app.get('/', (req, res) => {

})

app.get('/completions', async(req, res) => {

  const options = {
    method:"POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: "Check if the answer matches the question, if not put a false in the boolean. Return only in JSON" },
      { role: "user", content: JSON.stringify(answerContent) } // Include the content of answer.json here
    ],
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

