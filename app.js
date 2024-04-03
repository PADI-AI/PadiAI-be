import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";

const port = 1234;
const app = express();

app.use(express.json());

// Enable CORS
app.use(cors());

const API_KEY = "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";

const answerContent = JSON.parse(fs.readFileSync("answer.json", "utf-8"));

app.post("/test", (req, res) => {
    res.json(req.body);
    console.log(req.body);
    fs.writeFileSync("./answer.json", JSON.stringify(req.body));
});

app.post("/chat", async (req, res) => {
    const strapiOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer eeff043642aa20a9f26db842a0d8ee85c9ea63e62c5612f41992e0d1623ba8670f450e3365bfe2e1e398611fc9775c27c58098e429920e66d8a1272c3253f41babad2436bcebb2effa9949a6a260b46159cc1be2e50699357d2ec090c451659f7545eb983acee1b0f00e241af351c7773bbc7cd831a65cd04eb05fc022997b54`,
            "Content-Type": "application/json",
        },
    };

    const strapiResponse = await fetch(
        "http://localhost:1337/api/managers/1",
        strapiOptions
    );

    // console.log(strapiResponse);

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `I want you to only focus on the topic content of this file. ${strapiResponse}. Before starting state that you're only focus on the content given. If possible, when ask about other unrelated topic. Said that you're unable to answer them.`,
                },
                { role: "user", content: req.body.message },
            ],
            max_tokens: 200,
        }),
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            options
        );
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
    }
});

app.get("/completions", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content:
                        "Check if the answer matches the question, if doesn't match put a false in the boolean. Return only in JSON",
                },
                { role: "user", content: JSON.stringify(answerContent) },
                {
                    role: "user",
                    content:
                        'If false, create a 4 week schedule on which topic to cover. One week can cover more than one topic and if more than 1 topic in a week, put it in array. Return only in JSON. Here\'s an example, "week 1": "Variables and Data Types"',
                },
            ],
            max_tokens: 200,
        }),
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            options
        );
        const data = await response.json();

        if (
            data.choices &&
            data.choices[0] &&
            data.choices[0].message &&
            data.choices[0].message.content
        ) {
            const weeklySchedule = JSON.parse(data.choices[0].message.content);
            console.log(weeklySchedule);

            const strapiData = {
                data: {
                    managerName: "ABCD",
                    newHire: [
                        {
                            id: 1,
                            memberName: "Hendrick",
                            quizStatus: true,
                            quizResult: weeklySchedule,
                        },
                    ],
                },
            };

            const strapiOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer eeff043642aa20a9f26db842a0d8ee85c9ea63e62c5612f41992e0d1623ba8670f450e3365bfe2e1e398611fc9775c27c58098e429920e66d8a1272c3253f41babad2436bcebb2effa9949a6a260b46159cc1be2e50699357d2ec090c451659f7545eb983acee1b0f00e241af351c7773bbc7cd831a65cd04eb05fc022997b54`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(strapiData),
            };

            const strapiResponse = await fetch(
                "http://localhost:1337/api/managers/1",
                strapiOptions
            );
            const strapiJson = await strapiResponse.json();

            res.send(strapiJson);
        } else {
            res.status(400).send({ error: "Invalid response from OpenAI API" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

app.get("/quiz", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
