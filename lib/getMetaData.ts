import domino from 'domino';
import { getMetadata } from 'page-metadata-parser';

export default async function (content: string) {
  const metadata = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = content.match(urlRegex);

  if (matches?.length) {
    for (const match of matches) {
      const url = match.replace('http://', 'https://');
      const response = await fetch(url);
      const html = await response.text();
      const doc = domino.createWindow(html).document;
      const tags = getMetadata(doc, url);

      metadata.push(tags);
    }
  }

  return metadata;
}
