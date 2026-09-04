const routes = [
  ['/', '1.0'],
  ['/faculty/', '0.8'],
  ['/faculty/zhangxm/', '0.9'],
  ['/research/', '0.9'],
  ['/faculty/zhangxm/projects/mariolm/', '0.8'],
  ['/faculty/zhangxm/notes/', '0.8'],
  ['/faculty/zhangxm/blog/MetaMind/', '0.9'],
  ['/faculty/zhangxm/blog/MetaMind/technical-contribution/', '0.9'],
  ['/faculty/zhangxm/blog/MetaMind/cognitive-frontier/', '0.8'],
  ['/faculty/zhangxm/connect/', '0.5'],
  ['/faculty/zhangxm/privacy/', '0.2']
];

export const GET = ({ site }: { site: URL }) => {
  const entries = routes.map(([path, priority]) =>
    `  <url><loc>${new URL(path, site)}</loc><priority>${priority}</priority></url>`
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' }
  });
};
