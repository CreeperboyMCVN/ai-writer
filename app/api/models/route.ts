import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://127.0.0.1:11434/api/tags');
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch models from Ollama API: ' + res.statusText }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch models. Make sure Ollama is running on localhost:11434' }, { status: 500 });
  }
}
