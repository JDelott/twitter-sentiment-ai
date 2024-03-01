import { useState } from 'react';
import './App.css';

const API_KEY = ""; // secure -> environment variable

function App() {
  const [tweet, setTweet] = useState("");
  const [sentiment, setSentiment] = useState(""); // "Negative" or "Positive"

  async function callOpenAIAPI() {
    console.log("Calling the OpenAI API");

    const APIBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You will be provided with a tweet, and your task is to classify its sentiment as positive, neutral, or negative.",
        },
        {
          "role": "user",
          "content": tweet
        }
      ],
      "temperature": 0.7,
      "max_tokens": 64,
      "top_p": 1
    }
    console.log(APIBody)

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify(APIBody)
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
    console.log(data);
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        setSentiment(data.choices[0].message.content.trim());
      } else {
        console.error('Invalid response from OpenAI API:', data);
      }
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
  }

  console.log(tweet);

  return (
    <div className="App">
      <div>
        <textarea
          onChange={(e) => setTweet(e.target.value)}
          placeholder='Paste your tweet here!'
          cols={50}
          rows={10}
        />
      </div>
      <div>
        <button onClick={callOpenAIAPI}>Get The Tweet Sentiment From OpenAI API</button>
        {sentiment !== "" ?
          <h3>This Tweet Is: {sentiment}</h3>  
          :
          null
        }
      </div>
    </div>
  )
}

export default App;
