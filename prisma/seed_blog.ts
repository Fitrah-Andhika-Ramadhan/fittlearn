import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyPosts = [
  {
    title: "Bridging Business & Code: The Role of a Systems Analyst",
    slug: "bridging-business-and-code",
    excerpt: "In today's fast-paced tech world, the bridge between stakeholders and developers is more critical than ever. Let's explore how we translate complex business requirements into robust technical architectures.",
    content: `
The role of a Systems Analyst is often misunderstood. Many think we just write documentation or draw UML diagrams all day. While that's part of it, the true essence of systems analysis is translation—turning abstract business needs into concrete, actionable technical requirements.

When I first started bridging the gap between business stakeholders and development teams, the biggest challenge was communication. Stakeholders speak in terms of ROI, user engagement, and market trends. Developers speak in terms of APIs, database schemas, and latency. 

As a Systems Analyst, you are the bilingual translator. You must understand the business goals deeply enough to challenge them, and you must understand the technical constraints well enough to design realistic solutions.

In this post, we'll dive into the three core skills every modern Systems Analyst needs:
1. Active Listening and Requirement Elicitation
2. Architectural Thinking
3. Empathy for both the User and the Developer
    `,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    category: "TECH",
    tags: ["Systems Analysis", "Career", "Business"],
    status: "published",
    views: 124,
    likes: 45
  },
  {
    title: "From Campus to Career: Fresh Grad Survival Guide",
    slug: "fresh-grad-survival-guide",
    excerpt: "Navigating the transition from Telkom University to the professional tech industry can be daunting. I've compiled essential lessons learned during my first few months in the real world of web development.",
    content: `
Graduating with an Information Systems degree from Telkom University gave me a strong foundation, but nothing truly prepares you for your first day in a real tech company. 

The transition from academic projects to enterprise-level software engineering is steep. In university, if your code works, you get an A. In the industry, if your code works but isn't maintainable, scalable, and secure, you've created technical debt.

Here is my survival guide for fresh graduates entering the tech industry:

**1. Embrace Imposter Syndrome**
Everyone feels like they don't know what they're doing at first. Use that feeling as fuel to ask questions, not as a reason to hide.

**2. Learn Git Properly**
` + "`" + `git add .` + "`" + ` and ` + "`" + `git commit -m "update"` + "`" + ` won't cut it anymore. Learn how to rebase, squash commits, and write meaningful commit messages.

**3. Soft Skills are Hard Skills**
Your ability to communicate effectively with your team, present your ideas, and handle constructive criticism will determine your career trajectory just as much as your coding abilities.
    `,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    category: "CAREER",
    tags: ["Fresh Graduate", "Advice", "Telkom University"],
    status: "published",
    views: 89,
    likes: 32
  },
  {
    title: "Modern Web Architecture with Three.js & Tailwind",
    slug: "modern-web-architecture-threejs-tailwind",
    excerpt: "Step-by-step guide on how to build immersive portfolio sites that stand out using 3D rendering and utility-first CSS. We'll cover everything from scene setup to performance optimization.",
    content: `
The web is no longer just flat documents; it's becoming an immersive spatial experience. Combining the power of WebGL through Three.js with the rapid styling capabilities of Tailwind CSS allows developers to create stunning, interactive websites quickly.

In my recent portfolio redesign, I utilized this exact stack to build a cosmic-themed interactive experience. Here is a breakdown of how it works:

**The Canvas Layer**
The lowest z-index layer is a full-screen canvas running a Three.js scene. We use ` + "`" + `requestAnimationFrame` + "`" + ` to constantly render a particle system that reacts to mouse movements. 

**The UI Layer**
Above the canvas sits our standard DOM elements, styled exclusively with Tailwind CSS. By using ` + "`" + `backdrop-blur` + "`" + ` and semi-transparent backgrounds (glassmorphism), we allow the 3D scene to peek through the UI, creating a cohesive sense of depth.

**Performance Considerations**
Rendering 3D graphics on the web can quickly drain batteries and drop frame rates on mobile devices. It's crucial to:
- Limit the number of polygons and particles.
- Pause the render loop when the canvas is out of the viewport.
- Use ` + "`" + `dpr` + "`" + ` (device pixel ratio) clamping to prevent rendering at unnecessarily high resolutions on retina screens.
    `,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    category: "DEV",
    tags: ["Three.js", "TailwindCSS", "Web Design"],
    status: "published",
    views: 312,
    likes: 128
  },
  {
    title: "Optimizing SQL Queries for Large-Scale Platforms",
    slug: "optimizing-sql-queries",
    excerpt: "A deep dive into database performance optimization based on real-world experience building complex platforms. Learn how we reduced query response times by 60% with indexing and execution plan analysis.",
    content: `
When building data-intensive applications, your database is almost always the bottleneck. During my time developing complex systems, I've encountered numerous performance issues that ultimately boiled down to inefficient SQL queries.

Here are the top three strategies for optimizing your relational database performance:

### 1. Understand Your Indexes
Adding an index isn't a magic bullet. While it speeds up reads, it slows down writes and consumes disk space. You need to analyze your query patterns. Use composite indexes for queries that filter on multiple columns simultaneously, and always be aware of index selectivity.

### 2. Analyze the Execution Plan
Before you try to rewrite a slow query, prepend it with ` + "`" + `EXPLAIN` + "`" + ` (or ` + "`" + `EXPLAIN ANALYZE` + "`" + ` in PostgreSQL). The execution plan tells you exactly how the database engine is executing your query. Look for sequential scans on large tables—those are prime candidates for indexing.

### 3. Avoid the N+1 Query Problem
In modern ORMs (like Prisma or Sequelize), it's incredibly easy to accidentally trigger hundreds of queries when fetching related data. Always use eager loading (e.g., ` + "`" + `include` + "`" + ` in Prisma) to fetch necessary relations in a single, optimized query rather than iterating and querying in a loop.
    `,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
    category: "DATA",
    tags: ["SQL", "PostgreSQL", "Optimization"],
    status: "published",
    views: 205,
    likes: 87
  },
  {
    title: "Building Resilient REST APIs with Node.js & TypeScript",
    slug: "resilient-rest-apis-nodejs-typescript",
    excerpt: "Learn the best practices for structuring, validating, and error-handling in modern Node.js applications. A comprehensive guide to building APIs that don't wake you up at 3 AM.",
    content: `
APIs are the backbone of modern software. If your API goes down, the frontend is useless. Building a resilient API isn't just about making it work on the happy path; it's about gracefully handling the myriad of ways things can fail.

When building REST APIs with Node.js and TypeScript, I adhere to a strict set of principles:

**Type Safety Everywhere**
TypeScript is only useful if you actually use its types. Avoid ` + "`" + `any` + "`" + ` at all costs. Define strict interfaces for your request bodies, query parameters, and response structures. Use libraries like Zod or Joi to validate incoming data at the boundaries, ensuring that invalid data never reaches your business logic.

**Centralized Error Handling**
Never send stack traces to the client in production. Implement a global error-handling middleware that catches all unhandled exceptions, logs them securely, and returns a standardized, user-friendly error response (e.g., standard HTTP status codes and a consistent JSON error format).

**Rate Limiting & Security**
Always assume your API will be abused. Implement rate limiting (e.g., using ` + "`" + `express-rate-limit` + "`" + `) to prevent brute-force attacks and DoS. Ensure you're setting appropriate security headers with tools like Helmet.
    `,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
    category: "BACKEND",
    tags: ["Node.js", "TypeScript", "API"],
    status: "published",
    views: 156,
    likes: 64
  }
];

async function main() {
  console.log('Start seeding blog posts...');
  
  // Optional: clear existing dummy posts to prevent duplicates on multiple runs
  // We'll just upsert based on slug
  for (const post of dummyPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`Upserted post: ${post.title}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
