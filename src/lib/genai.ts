export async function makeModelCutout(dataUrl: string): Promise<string> {
  const res = await fetch('/api/cutout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl })
  });
  if (!res.ok) throw new Error('Cutout failed');
  const data = await res.json();
  return data.png as string;
}

export async function generateDressUp(params: {
  modelPng: string;
  garments: string[];
  prompt: string;
  background?: 'transparent' | 'white';
  size?: string;
}): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Generation failed');
  const data = await res.json();
  return data.png as string;
}

export async function blobUrlToDataUrl(url: string): Promise<string> {
  const blob = await fetch(url).then(r => r.blob());
  return await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}


