import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding AI blog posts...')

  const aiPosts = [
    {
      title: "The Future of Generative AI in Web Development",
      slug: "future-of-generative-ai-web-development",
      excerpt: "How tools like GitHub Copilot and v0 are reshaping the way developers write code and design interfaces.",
      content: `Generative AI is no longer a futuristic concept; it's a daily reality for millions of developers. 

## The Rise of AI Coding Assistants

Tools like GitHub Copilot, Cursor, and v0 by Vercel are changing the paradigm of software development. Instead of writing boilerplate code from scratch, developers now act more like directors, guiding the AI to produce the foundational layers while they focus on complex business logic and architecture.

### Key Benefits
1. **Speed:** Tasks that took hours now take minutes.
2. **Learning:** Junior developers can learn patterns from AI suggestions.
3. **Prototyping:** UI generation tools allow instant visualization of ideas.

## What's Next?
In the coming years, we can expect AI to not just write code, but to understand entire codebases, manage autonomous testing, and even handle initial rounds of refactoring. The role of the developer is evolving, but the demand for strong problem-solving skills remains higher than ever.`,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
      status: "published",
      tags: ["AI", "Web Development", "Future"],
      category: "Artificial Intelligence",
      views: 1450,
      likes: 320,
    },
    {
      title: "Understanding Large Language Models (LLMs) for Beginners",
      slug: "understanding-llms-beginners",
      excerpt: "A simple, jargon-free guide to understanding how ChatGPT and other LLMs actually work under the hood.",
      content: `Have you ever wondered how ChatGPT can write poetry, code, or essays? The secret lies in Large Language Models (LLMs).

## What is an LLM?

At its core, an LLM is a very advanced autocomplete system. By analyzing terabytes of text from the internet, it has learned the statistical probability of which word should follow the previous one. 

### The Training Process
1. **Pre-training:** The AI reads the internet and learns grammar, facts, and reasoning abilities.
2. **Fine-tuning:** Humans help the AI understand how to behave like an assistant (e.g., being polite, helpful, and safe).

## Why are they so smart?
It turns out that if you make the model large enough and give it enough data, it develops emergent abilities—skills it wasn't explicitly programmed to do, like translating languages or writing working Python code.`,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
      status: "published",
      tags: ["AI", "LLM", "Machine Learning", "Beginner"],
      category: "Artificial Intelligence",
      views: 980,
      likes: 210,
    },
    {
      title: "Integrating OpenAI API in Next.js 15: A Practical Guide",
      slug: "integrating-openai-api-nextjs-15",
      excerpt: "Learn how to build your own AI chatbot using Next.js 15 App Router and the official OpenAI SDK.",
      content: `Building AI applications is easier than ever. In this tutorial, we will explore how to integrate the OpenAI API into a Next.js 15 application using React Server Components and Server Actions.

## Setting Up
First, install the required packages:
\`\`\`bash
npm install openai ai
\`\`\`

## Creating the API Route
With Next.js App Router, creating a streaming endpoint is incredibly straightforward. You can use the Vercel AI SDK to stream responses directly to the client, providing a fluid, ChatGPT-like experience.

### Example Code
\`\`\`javascript
import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    stream: true,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
\`\`\`

With just a few lines of code, you have a production-ready AI streaming backend!`,
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
      status: "published",
      tags: ["Next.js", "OpenAI", "Tutorial", "API"],
      category: "Artificial Intelligence",
      views: 2100,
      likes: 450,
    },
    {
      title: "AI Ethics: Navigating the Bias in Machine Learning",
      slug: "ai-ethics-navigating-bias",
      excerpt: "Why AI models are biased, how it impacts society, and what developers can do to build fairer systems.",
      content: `Artificial Intelligence is often seen as objective and logical. However, because AI learns from human data, it inherently inherits human biases.

## The Source of Bias
AI models, especially neural networks, are trained on massive datasets. If a dataset contains historical prejudices (e.g., gender, race, or socio-economic biases), the AI will replicate and sometimes amplify those prejudices.

### Real-World Consequences
- **Hiring Algorithms:** Some AI recruiting tools have been found to penalize female candidates because they were trained on resumes predominantly submitted by men.
- **Facial Recognition:** Many systems have higher error rates for people of color due to imbalanced training data.

## Building Fairer AI
Developers have a responsibility to mitigate these issues:
1. **Diverse Datasets:** Ensure the training data represents all demographics equally.
2. **Continuous Testing:** Regularly audit AI models for biased outcomes.
3. **Transparency:** Be open about how the AI makes decisions and its limitations.`,
      image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=1200",
      status: "published",
      tags: ["AI", "Ethics", "Society"],
      category: "Artificial Intelligence",
      views: 850,
      likes: 180,
    },
    {
      title: "Prompt Engineering 101: Getting Better Results from AI",
      slug: "prompt-engineering-101",
      excerpt: "Master the art of writing effective prompts to make AI models like GPT-4 work better and smarter for you.",
      content: `You don't need a PhD in Machine Learning to get incredible results from AI. You just need to know how to talk to it. This is the art of Prompt Engineering.

## Be Specific and Contextual
The most common mistake is being too vague. Instead of saying "Write an article about AI", try:
*"Act as an expert tech journalist. Write a 500-word article about the impact of AI on healthcare. Use a professional but accessible tone, and include 3 real-world examples."*

## Use Delimiters
If you want the AI to process specific text, separate it clearly using quotes or brackets:
\`\`\`
Summarize the following text:
"""
[Your long text here]
"""
\`\`\`

## Ask the AI to Think Step-by-Step
For complex math or logic problems, simply adding the phrase *"Let's think step by step"* drastically improves the model's accuracy because it forces the AI to map out its reasoning before giving an answer.`,
      image: "https://images.unsplash.com/photo-1655393008711-30f252ce4837?auto=format&fit=crop&q=80&w=1200",
      status: "published",
      tags: ["AI", "Prompt Engineering", "Tips"],
      category: "Artificial Intelligence",
      views: 3200,
      likes: 890,
    }
  ]

  for (const post of aiPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  console.log('✅ Successfully seeded 5 AI blog posts!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
