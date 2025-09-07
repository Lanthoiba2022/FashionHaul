import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

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
  return {
    inlineData: {
      mimeType,
      data: b64,
    }
  };
}

function buildCutoutPrompt() {
  return 'Extract the person only from this image with transparent background (alpha channel). Preserve original silhouette, fine edges, pose, and proportions. Transform the figure into a more three-dimensional representation by enhancing: depth perception through strategic shadowing, volumetric body contours, realistic lighting gradients, and subtle ambient occlusion effects. Maintain original colors and clothing details while adding dimensional depth that makes the figure appear more like a high-quality 3D rendered model. Output as high-resolution PNG.';
}

function buildDressPrompt(userPrompt) {
  const base = 'Dress the SINGLE model person figure with ALL the provided garment items (tops, bottoms, shoes, earrings, purse, etc.) in a photorealistic manner on ONE person only. Do not create multiple figures or duplicate the person. Clean each clothing item by removing any unwanted elements (hands, legs, background noise, skin, or body parts that do not belong to the garments).Seamlessly fit ALL clothing items onto the SAME person\'s body with natural draping, realistic fabric behavior, and accurate garment physics. Layer all garments appropriately on the single figure - tops over undergarments, accessories like earrings on ears, purse in hand or on shoulder, shoes on feet, etc. Maintain the figure\'s three-dimensional, sculpted appearance with enhanced depth, volumetric shadows, and highlights. Apply consistent lighting and dimensional shading across the person and ALL clothing items for unified integration. Match color temperature and ambient lighting between all elements. Ensure proper garment layering and occlusions where clothing overlaps. Preserve the original pose, proportions, and enhanced 3D model-like quality while ensuring ALL clothing appears naturally worn with smooth, realistic placement on the SINGLE figure. Output with full body visible showing ONE complete dressed person and maintain the sculptural aesthetic with improved depth perception throughout the final composition.';
  return userPrompt ? `${base}\n\n${userPrompt}` : base;
}

app.post('/api/cutout', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Missing image' });
    if (!API_KEY) return res.status(500).json({ error: 'Missing API key on server' });
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = buildCutoutPrompt();
    const contents = [ { text: prompt }, dataUrlToInlineData(image) ];
    const response = await ai.models.generateContent({ model: MODEL, contents });
    const parts = response?.candidates?.[0]?.content?.parts || [];
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
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const composedPrompt = buildDressPrompt(prompt);
    const contents = [ { text: composedPrompt }, dataUrlToInlineData(modelPng), ...garments.map(dataUrlToInlineData) ];
    const response = await ai.models.generateContent({ model: MODEL, contents });
    const parts = response?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart) return res.status(500).json({ error: 'No image returned' });
    const b64 = imagePart.inlineData.data;
    // Note: background preference is expressed in prompt; we return PNG data URL
    return res.json({ png: `data:image/png;base64,${b64}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Generation failed' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Nano Banana server running on http://localhost:${PORT}`);
});


