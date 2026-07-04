import Groq from "groq-sdk";
import {
  BlogGeneratorInput,
  ProductDescriptionInput,
  SocialMediaInput,
  EmailGeneratorInput,
  SeoMetaInput,
} from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

async function generate(prompt: string, systemPrompt: string) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_completion_tokens: 2000,
  });

  return {
    content: completion.choices[0]?.message?.content ?? "",
    tokensUsed: completion.usage?.total_tokens ?? 0,
  };
}

export async function generateBlog(input: BlogGeneratorInput) {
  const prompt = `Write a ${input.wordCount}-word blog post about "${input.topic}".

Tone: ${input.tone}

Keywords:
${input.keywords || "None"}

Include:
- H1 Title
- Introduction
- H2 Headings
- Conclusion
`;

  return generate(
    prompt,
    "You are an expert SEO content writer."
  );
}

export async function generateProductDescription(
  input: ProductDescriptionInput
) {
  const prompt = `Write a compelling product description.

Product:
${input.productName}

Features:
${input.features}

Audience:
${input.targetAudience}

Tone:
${input.tone}
`;

  return generate(
    prompt,
    "You are an expert e-commerce copywriter."
  );
}

export async function generateSocialMediaPost(input: SocialMediaInput) {
  const prompt = `Create a ${input.platform} social media post.

Topic:
${input.topic}

Tone:
${input.tone}

Include hashtags:
${input.includeHashtags}
`;

  return generate(
    prompt,
    `You are a professional ${input.platform} social media expert.`
  );
}

export async function generateEmail(input: EmailGeneratorInput) {
  const prompt = `Write a ${input.type} email.

Subject:
${input.subject}

Recipient:
${input.recipientName || ""}

Sender:
${input.senderName}

Points:
${input.keyPoints}

Tone:
${input.tone}
`;

  return generate(
    prompt,
    "You are an expert email copywriter."
  );
}

export async function generateSeoMeta(input: SeoMetaInput) {
  const prompt = `Generate SEO meta tags.

Page Title:
${input.pageTitle}

Target Keyword:
${input.targetKeyword}

Summary:
${input.pageContent}
`;

  return generate(
    prompt,
    "You are an SEO expert."
  );
}