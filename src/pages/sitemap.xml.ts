const routes = [
  ['/', '1.0'],
  ['/faculty/', '0.8'],
  ['/faculty/xuanming-zhang/', '0.9'],
  ['/research/', '0.9'],
  ['/faculty/xuanming-zhang/projects/mariolm/', '0.8'],
  ['/faculty/xuanming-zhang/notes/', '0.8'],
  ['/faculty/xuanming-zhang/blog/MetaMind/', '0.9'],
  ['/faculty/xuanming-zhang/blog/MetaMind/technical-contribution/', '0.9'],
  ['/faculty/xuanming-zhang/blog/MetaMind/cognitive-frontier/', '0.8'],
  ['/faculty/xuanming-zhang/connect/', '0.5'],
  ['/faculty/xuanming-zhang/privacy/', '0.2']
];

export const GET = ({ site }: { site: URL }) => {
  const entries = routes.map(([path, priority]) =>
    `  <url><loc>${new URL(path, site)}</loc><priority>${priority}</priority></url>`
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' }
  });
};
