import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const hostname = 'https://michaelwaruiru.netlify.app';
const pages = ['/', '/about', '/contact']; // Add more page paths as needed

const generateSitemap = async () => {
  const sitemap = new SitemapStream({ hostname });
  const writeStream = createWriteStream('./public/sitemap.xml');
  const pipe = promisify(pipeline);

  pages.forEach((page) => {
    sitemap.write({ url: page, changefreq: 'monthly', priority: 0.8 });
  });
  sitemap.end();

  await pipe(sitemap, writeStream);
  console.log('Sitemap generated at ./public/sitemap.xml');
};

generateSitemap().catch(console.error);
