import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const systemDesign = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/system-design' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum([
      'foundations',
      'social',
      'media',
      'storage',
      'commerce',
      'search-maps',
      'realtime',
      'infra',
      'ai',
    ]),
    difficulty: z.enum(['mid', 'senior', 'staff']),
    estimatedReadMinutes: z.number(),
    tags: z.array(z.string()),
    companyFlavors: z.array(z.string()).optional(),
    prerequisites: z.array(z.string()).optional(),
    relatedQuestions: z.array(z.string()),
    publishedAt: z.string(),
    updatedAt: z.string(),
    summary: z.string(),
    heroDiagram: z.string().optional(),
    javaPackages: z.array(z.string()).optional(),
  }),
});

export const collections = { 'system-design': systemDesign };
