import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://127.0.0.1:11434/api/tags');
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch models from Ollama API: ' + res.statusText }, { status: res.status });
    }

    const data = await res.json();
    const models = (data.models || []).map((m: any) => {
      const isCloud = m.name.toLowerCase().endsWith('cloud') || m.name.toLowerCase().includes(':cloud');
      return {
        name: m.name,
        type: isCloud ? 'cloud' : 'local',
        provider: isCloud ? 'Cloud Provider' : 'Ollama'
      };
    });

    return NextResponse.json({ models });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch models. Make sure Ollama is running on localhost:11434' }, { status: 500 });
  }
}
