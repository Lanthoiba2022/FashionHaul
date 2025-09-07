I want to build a virtual Fashion Haul where the user can upload their photo and their desire dress and then we give them the realistic looks after generating the dress up using gemini nano banana. I want the layout of the UI to take inspiration from https://fitroom.app/ but not exactly, you can make the UI as much creative as you can. I want the UI to take some inspiration from the attached image too but I want to have a very organized catalog of dress like shirts,jackets, tops , anything that is wear above the waist in one section and then separate section below waist like trousers, bottoms, skirts that everything that is werable below waist in one section and then we can have shoes collection as one section and then accessries section . so altogether we have 4 sections like anything wearale above waist section, anything wearable below waist section , shoes section and then accessories section. We will have a add or drag and drop kind of fucntionality where the user can add their items in the catalog. and then the user can select or drag from the catalog the items they want to virtually try on . The user if they upload their photo it has to go to a model catalog and a user can only be considered to be a model if it has a properly visible face and full length photo from head to toe otherwise give alert to the user to upload another image where the face is properly visible and it has to be a full length to be considered to be  the model. And when the user select the model from the model catalog have a button saying "Make this model" and once the user confirm it , then using nano banana generate a highly define 2D Model of the person using the person realistic body shape and structure and remove any background that comes with the person it has to be the person 2D only and place it in the center of the preview container, where all editing and playaround will be done. and after the model is successfully placed in the preview , the user now can drag and drop the items from the dress catalog and the dress can be shown the preview at the side as floating and once the user clicked the "Dress-up" button we will call the nano banana to make our 2D model to be dress up with the dress items we have in our preview while keeping the 2D model its shape and structure the same posture as before and the dress items in the preview have to be dress up and combine in our 2D model in a realistic manner. All these we have to make a very well structured prompt so that nano banana gets the well defined prompt and we have dress items as placeholder which will filled up in the prompt later as we drag and drop the items in our preview box and when the user clciked "Dress-up", the prompt will be sent and nano banana can generate the final result and show us in the preview itself where we can finally view and playaround such as zooming , scaling up and down the 2D model which should be handle in the frontend only and nano banana should not interfere here. Now make this project complete with stunning UI , asthetic and visually pleasing and creative


## Using Nano Banana with JavaScript

Guide on how to use Nano Banana aka Gemini 2.5 Flash Image in JavaScript with the [Google GenAI JS/TS SDK](https://github.com/googleapis/js-genai).

More resources:

- Get an API key from [Google AI Studio](https://aistudio.google.com/).
- [Nano Banana Gemini API docs](https://ai.google.dev/gemini-api/docs/image-generation)

## Installation

Install the SDK

```bash
npm install @google/genai
```

When using TypeScript also install TypeScript definitions for node

```bash
npm install --save-dev @types/node
```

## Image Generation from Text

```ts
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

  const prompt =
    "Create a photorealistic image of an orange cat with a green eyes, sitting on a couch.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("cat.png", buffer);
    }
  }
}

main();
```

## Image Editing with Text and Image Inputs

```ts
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

  const imageData = fs.readFileSync("cat.png");
  const base64Image = imageData.toString("base64");

  const prompt = [
    { text:   `Using the image of the cat, create a photorealistic,
street-level view of the cat walking along a sidewalk in a
New York City neighborhood, with the blurred legs of pedestrians
and yellow cabs passing by in the background.` },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("cat2.png", buffer);
    }
  }
}

main();
```

## Photo restoration with Nano Banana

```ts
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

  const imageData = fs.readFileSync("lunch.jpg"); // "Lunch atop a Skyscraper, 1932"
  const base64Image = imageData.toString("base64");

  const prompt = [
    { text: "Restore and colorize this image from 1932" },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("lunch-restored.png", buffer);
    }
  }
}

main();
```

## Working with Multiple Input Images

```ts
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

  const imageData1 = fs.readFileSync("girl.png");
  const base64Image1 = imageData1.toString("base64");
  
  const imageData2 = fs.readFileSync("tshirt.png");
  const base64Image2 = imageData2.toString("base64");

  const prompt = [
    { text: "Make the girl wear this t-shirt. Leave the background unchanged." },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image1,
      },
    },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image2,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("girl-with-tshirt.png", buffer);
    }
  }
}

main();
```

## Conversational Image Editing

```ts
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

  const chat = ai.chats.create({model: "gemini-2.5-flash-image-preview"});
  
  const imageData = fs.readFileSync("cat.png");
  const base64Image = imageData.toString("base64");

  const response1 = await chat.sendMessage({
    message: [
      { text: "Change the cat to a bengal cat, leave everything else the same." },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ]
  });
  // display / save image...

  const response2 = await chat.sendMessage({
    message: "The cat should wear a funny party hat"
  });
  // display / save image...

}

main();
```


GIVE A VERY HIGHLY DEFINE PROMPT FOR OUR USE  and also the resulting output try to make the background transparent or white so that it looks professional photo shoot.

I have alredy generated the API key.

Right now the codebase have a basic UI but the drop and drag into the preview and make it float on the side until we click the "Dress-Up Model" is not functioning as expected, fix this too. 

We have to use the Nano banana using the javascrit code to make the dress up generation. 