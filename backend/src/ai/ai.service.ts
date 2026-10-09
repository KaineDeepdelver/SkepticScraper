import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';

@Injectable()
export class AiService {
    private readonly genAI: GoogleGenAI;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');

        if (!apiKey) {
            throw new InternalServerErrorException
                ('GEMINI_API_KEY is not set in the environment variables.');
        }

        this.genAI = new GoogleGenAI({ apiKey });
    }

    async summarizeNews(
        articles: string[],
        language: 'en' | 'ar' = 'en',
    ): Promise<string> {
        try {
            const languageInstruction =
                language === 'ar'
                    ? `MANDATORY ARABIC TRANSLATIONS:
            - "Key Takeaways" MUST be "أهم الاستنتاجات".
            - "Sources" MUST be "المصادر".
            - "Daily Intelligence Briefing" MUST be "الموجز الاستخباراتي اليومي".
            - All topic headings, story headlines, section headings, summaries, and explanatory text MUST be in Arabic.
            - Do not use English headings such as "Key Takeaways" or "Sources".
            - Article URLs must remain exactly unchanged.
            - Source and publication names may remain in their original language so readers can identify them.
            - Do not switch back to English for any section.`
                    : `Write the entire briefing in English.
            - Use "Key Takeaways" as the final section heading.
            - Use "Sources" for source attribution.
            - Preserve original article URLs exactly.`;

            const prompt = `
                You are a neutral news briefing assistant.

                LANGUAGE REQUIREMENT:
                ${languageInstruction}

                Create a comprehensive daily intelligence briefing based exclusively on the supplied news articles.

                CORE REQUIREMENTS:
                - Summarize efficiently without losing important information.
                - Preserve key facts, names, dates, figures, locations, events, statements, and relevant background.
                - Explain what happened, who is involved, why it matters, and the potential implications when supported by the reporting.
                - Group related articles covering the same event into a single story, combining their useful details without repeating information.
                - Include meaningful details from different reports rather than relying on only one article when several are relevant.
                - Distinguish verified facts, attributed claims, opinions, and uncertainty.
                - Highlight disagreements between sources when their reporting conflicts.
                - Do not invent facts, context, quotes, conclusions, predictions, or sources.
                - Do not omit important details merely to make the briefing shorter.
                - Remove filler and repetition instead of removing substantive information.
                - Give major developments more space than minor stories.
                - If the supplied articles lack enough information to explain something, explicitly acknowledge the limitation.

                SOURCE ATTRIBUTION:
                - Every story MUST include a Sources line with clickable Markdown links to the original articles used for that story.
                - Use the exact source names and URLs supplied in the input.
                - Never invent, modify, or guess URLs.
                - Only cite articles that were actually supplied and that support the story.
                - When multiple supplied articles contribute information, include each relevant source.
                - Attribute specific claims to the appropriate source when necessary.
                - Never imply that a source reported something if its supplied article does not support that claim.
                - Keep source links directly beneath the story they support.

                OUTPUT FORMAT:

                ## Topic Name

                ### Story Headline

                Provide a clear, information-rich summary covering the key developments, relevant context, important figures, and implications supported by the articles.

                **Sources:** [Source Name](original-article-URL) · [Another Source](original-article-URL)

                Repeat this structure for each significant story, grouping related stories under appropriate topics.

                ## Key Takeaways

                End with a brief overview of the most consequential developments across all topics.

                Prioritize accuracy, completeness, clarity, and traceable sourcing over arbitrary length limits. Be concise in wording, not in substance. The briefing should reflect the information available in the supplied articles without pretending to know more than they contain.

                NEWS ARTICLES:
                ${articles.join('\n\n---\n\n')}
                `;

            const response: GenerateContentResponse =
                await this.genAI.models.generateContent({
                    model: 'gemini-3.5-flash-lite',
                    contents: prompt,
                });
            return response.text ?? 'No summary could be generated by the AI.';

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message : String(error);

            if (message.includes('"code":503') ||
                message.includes('"status":"UNAVAILABLE"')) {
                throw new InternalServerErrorException(
                    'Gemini is temporarily overloaded. Please try again shortly.',
                );
            }

            throw new InternalServerErrorException(
                `Failed to summarize news articles: ${message}`,
            );
        }
    }
}
