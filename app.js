import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const port = 1234;
const app = express();

app.use(express.json());

// Enable CORS
app.use(cors());

const API_KEY = process.env.API_KEY;

app.post('/test', (req, res) => {
  res.json(req.body);
  console.log(req.body);
});

app.post('/completions', async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 200,
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/quiz', (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
