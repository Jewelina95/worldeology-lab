const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../public/InteractEvalteste/assets/brand');
async function build() {
  const source = path.join(root, 'interacteval-mark.svg');
  const sizes = [16, 32, 48, 64];
  const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((image, i) => {
    const at = 6 + i * 16;
    header[at] = sizes[i]; header[at + 1] = sizes[i];
    header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(image.length, at + 8); header.writeUInt32LE(offset, at + 12);
    offset += image.length;
  });
  fs.writeFileSync(path.join(root, 'interacteval.ico'), Buffer.concat([header, ...images]));
  await sharp(source).resize(180, 180).png().toFile(path.join(root, 'apple-touch-icon.png'));
  console.log('Brand icons built from one SVG: ICO 16/32/48/64px and Apple 180px.');
}
build().catch(error => {console.error(error); process.exitCode = 1;});
