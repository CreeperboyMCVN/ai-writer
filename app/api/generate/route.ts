import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      model, prompt, customPrompt, language, tone, genre, aiMode, 
      storyName, storyDescription, database,
      storySummary, fallbackContext
    } = body;

    // Read general Instructions
    let systemInstruction = '';
    try {
      systemInstruction = fs.readFileSync(path.join(process.cwd(), 'agent_instructions.txt'), 'utf8');
    } catch (e) {
      console.warn("Could not read agent_instructions.txt");
    }

    // Process Lore Database
    let loreText = '';
    if (database && Array.isArray(database) && database.length > 0) {
      loreText = "LORE HANDBOOK:\n" + database.map(e => `[${e.type.toUpperCase()}] ${e.name} - ${e.description}`).join('\n') + "\n\n";
    }

    // Process Story Context (Summary or Fallback)
    let memoryText = '';
    if (storySummary && storySummary.trim().length > 0) {
      memoryText = `PREVIOUS STORY SUMMARY:\n${storySummary}\n\n`;
    } else if (fallbackContext && fallbackContext.trim().length > 0) {
      memoryText = `PREVIOUS CHAPTERS CONTEXT (Raw excerpt):\n${fallbackContext}\n\n`;
    }

    // Append Lore & World rules dynamically to the system instruction
    const enhancedSystem = `${systemInstruction}

STORY DETAILS:
Name: ${storyName || 'Untitled'}
Synopsis: ${storyDescription || 'N/A'}

${memoryText}${loreText}
ALWAYS USE the Lore Handbook and Story Context provided above. Incorporate these characters, places, and past events accurately when relevant. Ensure narrative continuity.`;

    let finalPrompt = '';

    if (aiMode !== false) {
      // Direct insertion mode
      finalPrompt = `Continue the following text organically. Respond ONLY with the continuation.
Constraints:
- Language: ${language || 'English'}
- Tone: ${tone || 'Professional'}
- Genre: ${genre || 'General Fiction'}
${customPrompt ? `- User Instructions: ${customPrompt}` : ''}

Text to continue:
${prompt}`;
    } else {
      // Support mode
      finalPrompt = `The user is asking a question, requesting feedback, or seeking brainstorming assistance.
Constraints:
- Language: ${language || 'English'}
- Tone: ${tone || 'Professional'}
- Genre: ${genre || 'General Fiction'}

User Request: ${customPrompt || 'Give me feedback on my text so far.'}

Current story context (for reference only):
${prompt || '(No text currently selected)'}`;
    }

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama3',
        system: enhancedSystem,
        prompt: finalPrompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Ollama generate failed: ' + response.statusText }, { status: response.status });
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to generate text. Ensure Ollama is running.' }, { status: 500 });
  }
}
