import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const prerender = true;

export async function getStaticPaths() {
  const articles = await getCollection('system-design');
  return articles.map(a => ({
    params: { slug: a.id },
    props: {
      title: a.data.title,
      category: a.data.category,
      difficulty: a.data.difficulty,
      estimatedReadMinutes: a.data.estimatedReadMinutes,
    },
  }));
}

// Fetch Geist font from Google Fonts at build time (cached per build)
let _fontBold: ArrayBuffer | null = null;
let _fontRegular: ArrayBuffer | null = null;

async function getFont(weight: 400 | 700): Promise<ArrayBuffer> {
  const cache = weight === 700 ? _fontBold : _fontRegular;
  if (cache) return cache;

  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OGImageBot/1.0)' } }
  ).then(r => r.text()).catch(() => null);

  // Extract first woff2 URL from the CSS response
  const url = css?.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1];
  if (!url) throw new Error(`Could not extract font URL (weight ${weight})`);

  const buf = await fetch(url).then(r => r.arrayBuffer());
  if (weight === 700) _fontBold = buf;
  else _fontRegular = buf;
  return buf;
}

const CATEGORY_LABEL: Record<string, string> = {
  foundations:  'Foundations',
  social:       'Social',
  media:        'Media',
  storage:      'Storage',
  commerce:     'Commerce',
  'search-maps':'Search & Maps',
  realtime:     'Real-time',
  infra:        'Infra',
  ai:           'AI Systems',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  mid:    '#8fb086',
  senior: '#e0a96d',
  staff:  '#d27a4f',
};

// Build element tree without React using satori's JSX-object format
function h(type: string, props: Record<string, any> = {}, ...children: any[]) {
  const c = children.length === 0 ? undefined
          : children.length === 1 ? children[0]
          : children;
  return { type, props: { ...props, children: c } };
}

export const GET: APIRoute = async ({ props }) => {
  const { title, category, difficulty, estimatedReadMinutes } = props as {
    title: string;
    category: string;
    difficulty: string;
    estimatedReadMinutes: number;
  };

  const [fontBold, fontRegular] = await Promise.all([getFont(700), getFont(400)]);

  const diffColor = DIFFICULTY_COLOR[difficulty] ?? '#e8b87a';
  const catLabel  = CATEGORY_LABEL[category]    ?? category;

  const svg = await satori(
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        padding: '60px 64px',
        fontFamily: 'Geist',
        boxSizing: 'border-box',
      },
    },
      // Top row: site name + category
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
        h('span', { style: { fontSize: 18, color: '#e8b87a', fontWeight: 700, letterSpacing: '-0.02em' } }, 'System Design'),
        h('span', { style: { fontSize: 18, color: 'rgba(237,237,237,0.28)' } }, '/'),
        h('span', { style: { fontSize: 17, color: 'rgba(237,237,237,0.55)', fontWeight: 400 } }, catLabel),
      ),

      // Title
      h('div', { style: { display: 'flex', flex: 1, alignItems: 'center', paddingTop: '16px', paddingBottom: '16px' } },
        h('h1', {
          style: {
            fontSize: title.length > 50 ? 42 : 52,
            fontWeight: 700,
            color: '#ededed',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: 0,
            maxWidth: '820px',
          },
        }, title),
      ),

      // Bottom row: difficulty badge + read time
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            padding: '6px 14px',
            background: `${diffColor}22`,
            border: `1px solid ${diffColor}55`,
            borderRadius: '8px',
            fontSize: 15,
            fontWeight: 600,
            color: diffColor,
            textTransform: 'capitalize',
          },
        }, difficulty),
        h('span', { style: { fontSize: 15, color: 'rgba(237,237,237,0.35)', fontWeight: 400 } },
          `${estimatedReadMinutes} min read`),
        h('div', { style: { flex: 1 } }),
        h('span', { style: { fontSize: 15, color: 'rgba(237,237,237,0.22)', fontWeight: 400 } }, 'pushkar.dev/system-design'),
      ),
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: fontBold,    weight: 700, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
