import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      model, 
      existingSummary, 
      newChaptersText, 
      storyName, 
      storyDescription, 
      database 
    } = body;

    let systemInstruction = '';
    try {
      systemInstruction = fs.readFileSync(path.join(process.cwd(), 'agent_instructions.txt'), 'utf8');
    } catch (e) {
      console.warn("Could not read agent_instructions.txt");
    }

    let loreText = '';
    if (database && Array.isArray(database) && database.length > 0) {
      loreText = "LORE HANDBOOK:\n" + database.map(e => `[${e.type.toUpperCase()}] ${e.name} - ${e.description}`).join('\n') + "\n\n";
    }

    const enhancedSystem = `${systemInstruction}
You are currently functioning as a precise summarization engine.

STORY DETAILS:
Name: ${storyName || 'Untitled'}
Synopsis: ${storyDescription || 'N/A'}
${loreText}`;

    // Construct the synthesis prompt
    let prompt = "";
    if (existingSummary && existingSummary.trim().length > 0) {
      prompt = `Here is the current ongoing summary of the story:
"""
${existingSummary}
"""

Here is the text from the newly written chapters:
"""
${newChaptersText}
"""

TASK: Combine the existing summary with the events of the new chapters into a single, cohesive, updated summary. Keep it strictly focused on major plot points, character arcs, and world progression. Do not output meta-commentary, just the pure updated summary text.`;
    } else {
      prompt = `Here are the initial chapters of the story:
"""
${newChaptersText}
"""

TASK: Create a comprehensive and concise summary of the story so far. Keep it strictly focused on major plot points, character arcs, and world progression. Do not output meta-commentary, just the pure summary text.`;
    }

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama3',
        system: enhancedSystem,
        prompt: prompt,
        stream: false, // Wait for the whole summary
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Ollama summarize failed: ' + response.statusText }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ summary: data.response });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to summarize text. Ensure Ollama is running.' }, { status: 500 });
  }
}
