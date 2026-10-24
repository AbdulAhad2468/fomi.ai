import { assets } from '../../../lib/data';

const imageMap = { Atmosphere: assets.ridge, Product: assets.glass, Spaces: assets.house };

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const prompt = String(body.prompt || '').trim();
  if (prompt.length < 12) return Response.json({ error: 'Add a little more detail to your prompt (at least 12 characters).' }, { status: 400 });
  const direction = imageMap[body.direction] ? body.direction : 'Atmosphere';
  const type = body.type === 'video' ? 'video' : 'image';
  await new Promise(resolve => setTimeout(resolve, 1100));
  if (body.surface === 'reference') {
    return Response.json({ results: Array.from({ length: Math.max(1, Math.min(Number(body.count) || 4, 4)) }, (_, index) => ({
      id: crypto.randomUUID(), image: index % 2 ? assets.portraitB : assets.portraitA, prompt, type, isMock: true
    })) });
  }
  return Response.json({
    result: {
      id: crypto.randomUUID(),
      image: imageMap[direction],
      title: type === 'video' ? 'Motion study' : 'New exploration',
      prompt,
      direction,
      ratio: body.ratio || 'Landscape',
      date: 'Just now',
      type,
      duration: type === 'video' ? '0:04' : null,
      isMock: true
    }
  });
}
