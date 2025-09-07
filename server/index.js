import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const PORT = process.env.PORT || 8787;
const MODEL = 'gemini-2.5-flash-image-preview';
const API_KEY = (process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

if (!API_KEY) {
  console.warn('[Server] No API key found. Set GOOGLE_GENAI_API_KEY in .env');
}

function dataUrlToInlineData(dataUrl) {
  const [meta, b64] = dataUrl.split(',');
  const mimeMatch = /data:(.*?);base64/.exec(meta);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  return { inlineData: { mimeType, data: b64 } };
}

function buildCutoutPrompt() {
  return 'Extract the person only from this image, preserving the original silhouette and fine edges (hair, fingers). Remove the entire background and output a high-resolution PNG with transparent background (alpha). Do not alter pose, proportions, or colors. Keep full body visible.';
}

function buildDressPrompt(userPrompt) {
  const base = 'Produce a photorealistic virtual try-on of the subject wearing the selected garments. Preserve identity, pose, body shape and proportions. Maintain consistent 2D sculpture-like style as the subject cutout. Respect garment layering and occlusions. Output PNG with transparent background (or white if alpha not supported).';
  return userPrompt ? `${base}\n\n${userPrompt}` : base;
}

app.post('/api/cutout', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Missing image' });
    if (!API_KEY) return res.status(500).json({ error: 'Missing API key on server' });

    const ai = new GoogleGenerativeAI(API_KEY);
    const model = ai.getGenerativeModel({ model: MODEL });
    const prompt = buildCutoutPrompt();

    // Official SDK expects generateContent with { contents: [{ role, parts: [...] }] }
    const resp = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            dataUrlToInlineData(image),
          ],
        },
      ],
    });

    const parts = resp?.response?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart) return res.status(500).json({ error: 'No image returned' });
    const b64 = imagePart.inlineData.data;
    return res.json({ png: `data:image/png;base64,${b64}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Cutout failed' });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { modelPng, garments = [], prompt, background = 'transparent' } = req.body;
    if (!modelPng || !garments.length) return res.status(400).json({ error: 'Missing model or garments' });
    if (!API_KEY) return res.status(500).json({ error: 'Missing API key on server' });

    const ai = new GoogleGenerativeAI(API_KEY);
    const model = ai.getGenerativeModel({ model: MODEL });
    const composedPrompt = prompt; // Use the prompt directly from client

    const safeGarments = (Array.isArray(garments) ? garments : [])
      .filter((g) => typeof g === 'string' && g.startsWith('data:image'));

    console.log('Generate API received:', {
      hasModelPng: !!modelPng,
      modelPngLength: modelPng ? modelPng.length : 0,
      garmentsCount: safeGarments.length,
      promptLength: prompt ? prompt.length : 0
    });

    const resp = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: composedPrompt },
            dataUrlToInlineData(modelPng),
            ...safeGarments.map(dataUrlToInlineData),
          ],
        },
      ],
    });

    const parts = resp?.response?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart) return res.status(500).json({ error: 'No image returned' });
    const b64 = imagePart.inlineData.data;
    return res.json({ png: `data:image/png;base64,${b64}` });
  } catch (e) {
    console.error(e);
    const message = e?.message || 'Generation failed';
    return res.status(500).json({ error: 'Generation failed', details: message });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Nano Banana server running on http://localhost:${PORT}`);
});
