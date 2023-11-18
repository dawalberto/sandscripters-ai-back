// index.js
import express from 'express';
const app = express();
const port = 3001; // You can change this port if needed

// Imports
import dotenv from 'dotenv';
import { BingChat } from 'bing-chat-rnz';
import { oraPromise } from 'ora';
dotenv.config();

// Get
app.get('/', async (req, res) => {
    
    
});

// Post
app.post('/', (req, res) => {

  const api = new BingChat({ cookie: process.env.BING_COOKIE })
  
  const body = req.body;
  const webTheme = "videogames and computers"; // body.theme;
  const webDescription = "Modern, rgb, sharp, mouse, keyboard"; // body.description;
  // const webPages = body.pages;
  const pageColors = "red and blue"; // body.colors;

  const prompt = `Instructions: Only write two very detailed prompts, one negative and one positive, for a GAN model
  to generate images about ${webTheme}. 
  
  DO NOT WRITE ANY OTHER TEXT APART FROM THE PROMPTS IN YOUR RESPONSE.
  SEND THE PROMPTS WITH THE FOLLOWING FORMAT:

  Positive prompt: content (end)

  Negative prompt: content (end)

  Make the prompts as detailed as the example below, including its format, 
  but adding extra fields and changing the content to match the ${webTheme} topic.\n

  Example prompt: [three-quarter close-up::12], [gorgeous face, long blond wavy hair, (pale skin:1. 2), pastel lighting, 
  mysterious smile, ((looking at the camera)), bright and piercing eyes:9], gorgeous ${webTheme}, 
  ((anatomical:0. 7) (cybernated (arms:1. 1) in Deus Ex Mankind Divided style:0. 9)) and (trim and athletic:0. 8), 
  (glossy [with rolled up sleeves] blown jacket in fashion magazine style, clothing jacket, night city), 
  (Dylan Kowalski:1. 3), inside a slum alley with, natural glossy, [stunning high-activity unity render::30]Maximally 
  natural [superdetail, ((professional photography, hyperphotorealistic, cinematic, natural reflection textures, 
  natural materials, high-contrast shadows, cinematic lighting, soft lighting)):20], (neon lighting:0. 8), 150mm, ISO 100\n

  Also take into account the following key words and colors to generate the prompts.\n
  
  Key words: ${webDescription}\n
  Colors: ${pageColors}\n
  `

  oraPromise(api.sendMessage(prompt), {
      text: prompt,
      variant: 'Creative'
  }).then((result)=> {

    console.log("hola", result.text);

  // Regular expression to capture content between "Positive prompt:" and "(end)"
  const positivePromptRegex = /Positive prompt:(.*?)(?=\(end\))/s;
  const positivePromptMatch = result.text.match(positivePromptRegex);

  // Regular expression to capture content between "Negative prompt:" and "(end)"
  const negativePromptRegex = /Negative prompt:(.*?)(?=\(end\))/s;
  const negativePromptMatch = result.text.match(negativePromptRegex);

  if (positivePromptMatch && negativePromptMatch) {
    const positivePromptContent = positivePromptMatch[1].trim();
    const negativePromptContent = negativePromptMatch[1].trim();

    console.log("Positive Prompt Content:", positivePromptContent);
    console.log("\nNegative Prompt Content:", negativePromptContent);

    res.json({positive: positivePromptContent, negative: negativePromptContent});

  } else {
    console.log("Couldn't match prompts.");
  }

  }).catch((error)=>{

    res.json(error);

  });

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});