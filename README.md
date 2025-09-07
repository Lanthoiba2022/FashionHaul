# FashionHaul - AI-Powered Virtual Try-On Studio

<div align="center">

<img src="./public/preview.jpeg" alt="FashionHaul Logo" width="100%" height="auto" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: 20px 0; max-width: 1200px;"/>

<!-- 
For GitHub visibility, use one of these formats:
1. Relative path (works if image is in repo): ./public/preview.jpeg
2. GitHub raw URL: https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/public/preview.jpeg
3. GitHub blob URL: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/blob/main/public/preview.jpeg?raw=true
-->

### *Experience the future of fashion with AI-powered virtual try-on technology*

<br>

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

<br>

</div>

## 🚀 Overview

FashionHaul is a cutting-edge virtual try-on application that leverages Google's Gemini 2.5 Flash AI to create realistic fashion experiences. Upload your photo, select from our curated clothing catalog, and see yourself in stunning AI-generated outfits with professional-quality results.

<div align="center">

### 🎯 **Transform Your Fashion Experience with AI**

*Upload • Select • Try-On • Stylize*

</div>

### ✨ Key Features

<table>
<tr>
<td width="50%">

**🎭 AI-Powered Model Generation**  
Transform your photos into professional 2D models with transparent backgrounds

**👗 Comprehensive Clothing Catalog**  
Organized collections of tops, bottoms, shoes, and accessories

**🎨 Drag & Drop Interface**  
Intuitive preview system with floating garment placement

</td>
<td width="50%">

**🤖 Advanced AI Processing**  
Powered by Google Gemini 2.5 Flash for realistic virtual try-ons

**📱 Responsive Design**  
Seamless experience across all devices

**⚡ Real-time Preview**  
Instant visual feedback with zoom and scale controls

</td>
</tr>
</table>

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Lightning-fast build tool
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Router 6.30.1** - Client-side routing
- **React Query 5.83.0** - Server state management

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.19.2** - Web framework
- **Google Generative AI 0.21.0** - AI integration
- **CORS** - Cross-origin resource sharing

### AI & Image Processing
- **Google Gemini 2.5 Flash** - Image generation and editing
- **Base64 encoding** - Image data handling
- **PNG optimization** - High-quality image output

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Google AI API Key** ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fashionhaul.git
   cd fashionhaul
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Google AI API key to `.env`:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   # Terminal 1: Start frontend
   npm run dev
   
   # Terminal 2: Start backend
   npm run server
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
fashionhaul/
├── public/                     # Static assets
│   ├── Accessories/           # Accessory images
│   ├── Bottoms/              # Bottom wear images
│   ├── Footwear/             # Shoe images
│   ├── Model/                # Sample model images
│   └── Tops_Shirts/          # Top wear images
├── server/                    # Backend server
│   ├── index.js              # Express server
│   └── index.mjs             # ES modules server
├── src/                       # Frontend source
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── ClothingCatalog.tsx
│   │   ├── FashionHaul.tsx
│   │   ├── Header.tsx
│   │   ├── ModelCatalog.tsx
│   │   └── PreviewContainer.tsx
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── genai.ts         # AI integration
│   │   └── utils.ts         # Helper functions
│   ├── pages/                # Page components
│   └── App.tsx              # Main app component
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🎯 Usage Guide

<div align="center">

### **How It Works in 4 Simple Steps**

</div>

<table>
<tr>
<td width="25%" align="center">

### 📸 **1. Upload Your Photo**
Click "Upload Model" in the Model Catalog
- Clear face and full body (head to toe)
- Automatic image quality validation

</td>
<td width="25%" align="center">

### 🎭 **2. Process Your Model**
Click "Make this model" to generate your 2D avatar
- AI extracts your silhouette
- Transparent background creation
- Preview area placement

</td>
<td width="25%" align="center">

### 👗 **3. Select Clothing Items**
Browse the organized catalog:
- **Above Waist**: Tops, shirts, jackets
- **Below Waist**: Pants, skirts, shorts
- **Footwear**: Heels, boots, sandals
- **Accessories**: Bags, jewelry, eyewear

</td>
<td width="25%" align="center">

### ✨ **4. Virtual Try-On**
Drag items to preview area
- Floating garment placement
- Click "Dress-Up Model"
- Zoom and scale controls

</td>
</tr>
</table>

<div align="center">

*🎨 **See the magic happen with AI-powered fashion transformation!***

</div>

## 🔧 API Reference

### Model Processing

#### `POST /api/cutout`
Extract person from image with transparent background.

**Request:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Response:**
```json
{
  "png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

#### `POST /api/generate`
Generate virtual try-on with selected garments.

**Request:**
```json
{
  "modelPng": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "garments": ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."],
  "prompt": "Professional fashion shoot with transparent background",
  "background": "transparent",
  "size": "1024x1024"
}
```

**Response:**
```json
{
  "png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## 🎨 Customization

### Adding New Clothing Items

1. Add images to the appropriate folder in `public/`
2. Update the clothing catalog in `src/components/FashionHaul.tsx`:

```typescript
const newItem: ClothingItem = {
  id: 'unique-id',
  name: 'Item Name',
  category: 'above-waist' | 'below-waist' | 'shoes' | 'accessories',
  image: '/path/to/image.webp'
};
```

### Styling Customization

The app uses Tailwind CSS for styling. Key configuration files:
- `tailwind.config.ts` - Tailwind configuration
- `src/index.css` - Global styles
- Component-specific styles in individual `.tsx` files

### AI Prompt Customization

Modify AI prompts in `server/index.js`:

```javascript
function buildDressPrompt(userPrompt) {
  return 'Your custom prompt here...';
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform

### Backend Deployment (Railway/Heroku)

1. **Set environment variables**
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key
   PORT=8787
   ```

2. **Deploy using your platform's CLI**

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Build verification
npm run build
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## Acknowledgments

- **Google Gemini AI** for powerful image generation capabilities
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Vite** for the excellent development experience
- **React** team for the amazing framework


---

