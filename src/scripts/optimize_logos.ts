import sharp from "sharp";
import fs from "fs";
import path from "path";

async function optimizeLogos() {
  const logoPath = path.join(process.cwd(), "public", "demuse_logo.png");
  const rawInput = fs.readFileSync(logoPath);

  function makeRoundedMask(size: number, radius: number): Buffer {
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#ffffff" /></svg>`;
    return Buffer.from(svg);
  }

  // 1. Clean optimized 512x512 square logo
  const cleanSquare = await sharp(rawInput)
    .resize(512, 512, { fit: "contain", background: { r: 250, g: 247, b: 242, alpha: 0 } })
    .png({ compressionLevel: 8 })
    .toBuffer();
  fs.writeFileSync(path.join(process.cwd(), "public", "demuse_logo.png"), cleanSquare);

  // 2. Clean 512x512 rounded squircle logo
  const mask512 = makeRoundedMask(512, 115);
  const rounded512 = await sharp(rawInput)
    .resize(512, 512, { fit: "cover" })
    .composite([{ input: mask512, blend: "dest-in" }])
    .png({ compressionLevel: 8 })
    .toBuffer();
  fs.writeFileSync(path.join(process.cwd(), "public", "demuse_logo_rounded.png"), rounded512);

  // 3. Android Chrome & Apple Touch icons
  const targets = [
    { size: 512, radius: 115, file: "public/demuse/android-chrome-512x512.png" },
    { size: 192, radius: 44, file: "public/demuse/android-chrome-192x192.png" },
    { size: 180, radius: 40, file: "public/demuse/apple-touch-icon.png" },
    { size: 32, radius: 7, file: "public/demuse/favicon-32x32.png" },
    { size: 16, radius: 3.5, file: "public/demuse/favicon-16x16.png" },
  ];

  for (const t of targets) {
    const mask = makeRoundedMask(t.size, t.radius);
    const buf = await sharp(rawInput)
      .resize(t.size, t.size, { fit: "cover" })
      .composite([{ input: mask, blend: "dest-in" }])
      .png({ compressionLevel: 8 })
      .toBuffer();
    fs.writeFileSync(path.join(process.cwd(), t.file), buf);
  }

  const fav32 = fs.readFileSync(path.join(process.cwd(), "public", "demuse", "favicon-32x32.png"));
  fs.writeFileSync(path.join(process.cwd(), "public", "favicon.ico"), fav32);
  fs.writeFileSync(path.join(process.cwd(), "src", "app", "favicon.ico"), fav32);
  fs.writeFileSync(path.join(process.cwd(), "public", "demuse", "favicon.ico"), fav32);

  console.log("Successfully optimized all PNG logos and rounded favicons!");
}

optimizeLogos().catch(console.error);
