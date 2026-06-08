import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { filename } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API Key not configured" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "DevPortfolio Pro"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI document summarizer. Since the user cannot upload the actual file content, you must guess the content based on the filename and generate a realistic educational summary in Indonesian, along with 4-6 key points. Return ONLY a valid JSON object with the keys 'summary' (string) and 'keyPoints' (array of strings)."
          },
          {
            role: "user",
            content: `Please summarize a document named "${filename}".`
          }
        ],
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const resultText = data.choices?.[0]?.message?.content || "{}";
    
    try {
      const result = JSON.parse(resultText);
      return NextResponse.json(result);
    } catch (parseError) {
      // If the AI didn't return perfect JSON, fallback
      return NextResponse.json({ 
        summary: resultText, 
        keyPoints: ["AI failed to format as JSON, raw text provided."] 
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
