import sharp from "sharp";
import fs from "fs";
import path from "path";

async function processFavicons() {
  const srcImage = path.join(process.cwd(), "public", "demuse", "android-chrome-512x512.png");
  const metadata = await sharp(srcImage).metadata();
  console.log("Source metadata:", metadata.width, metadata.height);

  function createRoundedMask(size: number, radius: number): Buffer {
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#ffffff" /></svg>`;
    return Buffer.from(svg);
  }

  const targets = [
    { size: 512, radius: 115, file: "public/demuse/android-chrome-512x512.png" },
    { size: 192, radius: 44, file: "public/demuse/android-chrome-192x192.png" },
    { size: 180, radius: 40, file: "public/demuse/apple-touch-icon.png" },
    { size: 32, radius: 7, file: "public/demuse/favicon-32x32.png" },
    { size: 16, radius: 3.5, file: "public/demuse/favicon-16x16.png" },
  ];

  for (const t of targets) {
    const mask = createRoundedMask(t.size, t.radius);
    const roundedBuffer = await sharp(srcImage)
      .resize(t.size, t.size, { fit: "cover" })
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(process.cwd(), t.file), roundedBuffer);
    console.log("Generated rounded:", t.file);
  }

  // Update favicon.ico in src/app and public
  const fav32 = fs.readFileSync(path.join(process.cwd(), "public", "demuse", "favicon-32x32.png"));
  fs.writeFileSync(path.join(process.cwd(), "src", "app", "favicon.ico"), fav32);
  fs.writeFileSync(path.join(process.cwd(), "public", "demuse", "favicon.ico"), fav32);
  fs.writeFileSync(path.join(process.cwd(), "public", "favicon.ico"), fav32);

  // Also create a rounded version of demuse_logo if desired
  const logoPath = path.join(process.cwd(), "public", "demuse_logo.png");
  if (fs.existsSync(logoPath)) {
    const logoMeta = await sharp(logoPath).metadata();
    if (logoMeta.width && logoMeta.height) {
      const logoSize = Math.min(logoMeta.width, logoMeta.height);
      const mask = createRoundedMask(logoSize, logoSize * 0.22);
      const roundedLogo = await sharp(logoPath)
        .resize(logoSize, logoSize, { fit: "cover" })
        .composite([{ input: mask, blend: "dest-in" }])
        .png()
        .toBuffer();
      fs.writeFileSync(path.join(process.cwd(), "public", "demuse_logo_rounded.png"), roundedLogo);
      console.log("Generated rounded demuse_logo_rounded.png");
    }
  }

  console.log("All rounded favicons processed successfully!");
}

processFavicons().catch(console.error);
