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

// Fetch Archivo static instances from Google Fonts at build time (cached per build).
// Google serves TTF to this user agent, which satori can read (it can't read woff2).
const _fonts = new Map<string, ArrayBuffer>();

async function getFont(axes: string): Promise<ArrayBuffer> {
  const cached = _fonts.get(axes);
  if (cached) return cached;

  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Archivo:${axes}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OGImageBot/1.0)' } }
  ).then(r => r.text()).catch(() => null);

  // Extract first font URL from the CSS response
  const url = css?.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1];
  if (!url) throw new Error(`Could not extract font URL (Archivo ${axes})`);

  const buf = await fetch(url).then(r => r.arrayBuffer());
  _fonts.set(axes, buf);
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

const DIFFICULTY_LEVEL: Record<string, number> = { mid: 1, senior: 2, staff: 3 };
const DIFFICULTY_LABEL: Record<string, string> = { mid: 'Mid', senior: 'Senior', staff: 'Staff' };

// Site palette (light theme)
const PAPER  = '#ECEEEF';
const INK    = '#15202B';
const INK_2  = '#4A5560';
const SIGNAL = '#FFC628';

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

  const [fontWide, fontBold, fontRegular] = await Promise.all([
    getFont('wdth,wght@125,800'),
    getFont('wght@700'),
    getFont('wght@400'),
  ]);

  const level    = DIFFICULTY_LEVEL[difficulty] ?? 0;
  const levelTxt = DIFFICULTY_LABEL[difficulty] ?? difficulty;
  const catLabel = CATEGORY_LABEL[category] ?? category;

  // Difficulty meter: 1, 2 or 3 filled squares, as on the site
  const meter = h('div', { style: { display: 'flex', gap: '6px' } },
    ...[1, 2, 3].map(n => h('div', {
      style: {
        width: '18px', height: '18px',
        border: `3px solid ${INK}`,
        background: n <= level ? INK : 'transparent',
      },
    })),
  );

  const svg = await satori(
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: PAPER,
        borderTop: `24px solid ${SIGNAL}`,
        padding: '48px 64px 56px',
        fontFamily: 'Archivo',
        boxSizing: 'border-box',
      },
    },
      // Top row: section name + category
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '24px' } },
        h('span', { style: { fontFamily: 'Archivo Expanded', fontSize: 24, color: INK } }, 'System design'),
        h('span', { style: { fontSize: 22, color: INK_2, fontWeight: 400 } }, catLabel),
      ),

      // Title
      h('div', { style: { display: 'flex', flex: 1, alignItems: 'center', paddingTop: '16px', paddingBottom: '16px' } },
        h('h1', {
          style: {
            fontFamily: 'Archivo Expanded',
            fontSize: title.length > 50 ? 52 : 64,
            color: INK,
            letterSpacing: '-0.025em',
            lineHeight: 1.04,
            margin: 0,
            maxWidth: '1040px',
          },
        }, title),
      ),

      // Bottom row: difficulty meter + read time, site
      h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '28px',
          borderTop: `3px solid ${INK}`, paddingTop: '24px',
        },
      },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
          meter,
          h('span', { style: { fontSize: 24, fontWeight: 700, color: INK } }, levelTxt),
        ),
        h('span', { style: { fontSize: 24, color: INK_2, fontWeight: 400 } },
          `${estimatedReadMinutes} min read`),
        h('div', { style: { flex: 1 } }),
        h('span', { style: { fontSize: 22, color: INK_2, fontWeight: 400 } }, 'pushkar.dev/system-design'),
      ),
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Archivo',          data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Archivo',          data: fontBold,    weight: 700, style: 'normal' },
        { name: 'Archivo Expanded', data: fontWide,    weight: 800, style: 'normal' },
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
