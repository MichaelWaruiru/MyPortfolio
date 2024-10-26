const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');

const hostname = 'https://michaelwaruiru.netlify.app';
const pages = ['/', '/about', '/contact']; // Add more page paths as needed

const generateSitemap = async () => {
  const sitemap = new SitemapStream({ hostname });
  pages.forEach((page) => {
    sitemap.write({ url: page, changefreq: 'monthly', priority: 0.8 });
  });
  sitemap.end();

  const data = await streamToPromise(sitemap);
  fs.writeFileSync('./public/sitemap.xml', data);
  console.log('Sitemap generated at ./public/sitemap.xml');
};

generateSitemap().catch(console.error);
