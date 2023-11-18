// index.js
import express from 'express';
const app = express();
const port = 3000; // You can change this port if needed

// Imports
import dotenv from 'dotenv';
import { BingChat } from 'bing-chat-rnz';
import { oraPromise } from 'ora';
dotenv.config();

// Define a route
app.get('/', async (req, res) => {
    
    const api = new BingChat({ cookie: process.env.BING_COOKIE })
    
    const prompt = 'Tell me about Jesus.'
    
    let result = await oraPromise(api.sendMessage(prompt), {
        text: prompt
    })
    
    console.log(result.text);
    
    res.send('Hello, this is your Express server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});