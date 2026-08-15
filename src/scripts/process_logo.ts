import sharp from "sharp";
import fs from "fs";
import path from "path";

async function processDemuseLogo() {
  const logoPath = path.join(process.cwd(), "public", "demuse_logo.png");
  if (!fs.existsSync(logoPath)) {
    console.error("demuse_logo.png not found in public/");
    return;
  }

  const metadata = await sharp(logoPath).metadata();
  console.log("demuse_logo.png dimensions:", metadata.width, metadata.height);

  function createRoundedMask(size: number, radius: number): Buffer {
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#ffffff" /></svg>`;
    return Buffer.from(svg);
  }

  // Generate rounded version of demuse_logo directly in public/
  const logoSize = Math.min(metadata.width || 512, metadata.height || 512);
  const roundedLogoMask = createRoundedMask(logoSize, logoSize * 0.22);
  const roundedLogo = await sharp(logoPath)
    .resize(logoSize, logoSize, { fit: "cover" })
    .composite([{ input: roundedLogoMask, blend: "dest-in" }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(process.cwd(), "public", "demuse_logo_rounded.png"), roundedLogo);

  // Generate all favicons and chrome/apple icons directly from demuse_logo.png
  const targets = [
    { size: 512, radius: 115, file: "public/demuse/android-chrome-512x512.png" },
    { size: 192, radius: 44, file: "public/demuse/android-chrome-192x192.png" },
    { size: 180, radius: 40, file: "public/demuse/apple-touch-icon.png" },
    { size: 32, radius: 7, file: "public/demuse/favicon-32x32.png" },
    { size: 16, radius: 3.5, file: "public/demuse/favicon-16x16.png" },
  ];

  for (const t of targets) {
    const mask = createRoundedMask(t.size, t.radius);
    const roundedBuffer = await sharp(logoPath)
      .resize(t.size, t.size, { fit: "cover" })
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(process.cwd(), t.file), roundedBuffer);
    console.log("Generated:", t.file);
  }

  const fav32 = fs.readFileSync(path.join(process.cwd(), "public", "demuse", "favicon-32x32.png"));
  fs.writeFileSync(path.join(process.cwd(), "public", "favicon.ico"), fav32);
  fs.writeFileSync(path.join(process.cwd(), "src", "app", "favicon.ico"), fav32);
  fs.writeFileSync(path.join(process.cwd(), "public", "demuse", "favicon.ico"), fav32);

  console.log("Successfully generated all rounded favicons and logos from demuse_logo.png!");
}

processDemuseLogo().catch(console.error);
