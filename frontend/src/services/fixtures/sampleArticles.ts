import { Article } from '../../types/article';

/**
 * Isolated development fixtures for SmallWebReader.
 * These are strictly enabled during local development when VITE_USE_DEV_FIXTURES=true.
 * They are NEVER silently used in live API failure states.
 */
export const SAMPLE_ARTICLES: Record<string, Article> = {
  'https://editorial.smallweb.example/zen-reading': {
    url: 'https://editorial.smallweb.example/zen-reading',
    title: 'The Architecture of Distraction-Free Spaces',
    byline: 'Elena Vance, Design Critic',
    publishedDate: '2026-09-15T14:30:00Z',
    siteName: 'Small Web Journal',
    excerpt: 'How intentional negative space and typographic clarity allow human focus to flourish in an increasingly noisy web.',
    readingTimeMinutes: 4,
    wordCount: 780,
    content: `
      <p class="lead">We have normalized an internet where content is an afterthought—a tiny strip of prose sandwiched between sticky navigation bars, autoplay video banners, tracking prompts, and animated modal overlays.</p>
      
      <h2>The Geometry of Attention</h2>
      <p>When you sit with a well-printed book, the margins are not wasted paper. They are acoustic dampeners for the eye. The white space absorbs visual noise and tells the optic nerve where to anchor.</p>
      
      <blockquote>
        "Simplicity is not the lack of clutter, that's a consequence of simplicity. Simplicity somehow essentially describes the purpose and place of an object and its components."
      </blockquote>
      
      <p>Digital readers shouldn't merely resize fonts; they must restore pacing. A measure between 60 and 75 characters per line mimics natural ocular saccades, allowing comprehension without eye fatigue.</p>
      
      <h2>Typographic Rhythm</h2>
      <p>A balanced type scale establishes instinctive hierarchy without shouting. When headings maintain proportional line-heights and paragraphs feature rhythmic vertical cadence, reading shifts from a scanning battle into sustained contemplation.</p>
      
      <ul>
        <li><strong>Generous vertical baseline:</strong> Giving ascenders and descenders room to breathe.</li>
        <li><strong>Subdued tonal contrast:</strong> Off-black text on warm stone or cream backgrounds to avoid harsh retinal glare.</li>
        <li><strong>Hardware-accelerated stillness:</strong> Eliminating unnecessary scroll-jacking or reflow jank.</li>
      </ul>
      
      <p>SmallWebReader honors this tradition by placing words first, restoring the web to its original promise as a sanctuary for thought.</p>
    `,
  },
  'https://tech.smallweb.example/simple-standards': {
    url: 'https://tech.smallweb.example/simple-standards',
    title: 'Why Simple Web Standards Outlast Modern Hype',
    byline: 'Marcus Chen',
    publishedDate: '2026-10-01T09:15:00Z',
    siteName: 'Hypertext Review',
    excerpt: 'Examining semantic HTML, CSS custom properties, and timeless protocols against the churn of ephemeral tooling.',
    readingTimeMinutes: 3,
    wordCount: 620,
    content: `
      <p>Twenty-five years ago, an HTML page written with simple paragraph tags and basic anchors conveyed ideas across the globe. Today, that exact document still renders flawlessly in any browser on Earth.</p>
      
      <h2>The Resilience of Semantic Markup</h2>
      <p>Frameworks come and go, but the core primitives of the web remain unshakeable:</p>
      
      <pre><code>&lt;article&gt;
  &lt;header&gt;
    &lt;h1&gt;Readable Web&lt;/h1&gt;
  &lt;/header&gt;
  &lt;p&gt;Timeless prose.&lt;/p&gt;
&lt;/article&gt;</code></pre>
      
      <p>When we build tools that honor semantic documents, assistive technology works effortlessly, search engines understand context, and reader tools can extract the pure essence of an article without brittle hacks.</p>
      
      <h2>Defense in Depth</h2>
      <p>Building resilient readers also means protecting users. When fetching arbitrary web resources, security boundaries such as SSRF guards and client-side sanitizers ensure that convenience never compromises user safety.</p>
    `,
  },
  'https://minimal.smallweb.example/brief-dispatch': {
    url: 'https://minimal.smallweb.example/brief-dispatch',
    title: 'A Brief Dispatch on Negative Space',
    byline: 'A. Sato',
    publishedDate: '2026-10-20T18:00:00Z',
    siteName: 'Kyoto Notes',
    excerpt: 'Notes on ma (間) and the role of pauses in design.',
    readingTimeMinutes: 1,
    wordCount: 160,
    content: `
      <p>In Japanese aesthetics, <em>ma</em> (間) refers not to empty void, but to meaningful interval—the pause between notes that makes music, the silence between sentences that imparts weight.</p>
      <p>When designing digital reading tools, the absence of chrome is the feature.</p>
    `,
  },
};
