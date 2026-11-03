const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const androidResDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// 1. Standard Icon SVG (512x512)
const standardSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'));

// 2. Maskable Icon SVG (512x512 with safe-zone padding and full-bleed midnight background)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050E1B" />
      <stop offset="50%" stop-color="#0A192F" />
      <stop offset="100%" stop-color="#020813" />
    </linearGradient>
    <linearGradient id="mGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3D6" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#92400E" />
    </linearGradient>
    <linearGradient id="mBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <filter id="mGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#F59E0B" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Full-bleed background for maskable launcher cropping -->
  <rect width="512" height="512" fill="url(#mBgGrad)" />

  <!-- Safe Zone Filigree Border (centered within 80% safe area) -->
  <rect x="64" y="64" width="384" height="384" rx="72" fill="none" stroke="url(#mBorderGrad)" stroke-width="8" filter="url(#mGoldGlow)" />
  <rect x="78" y="78" width="356" height="356" rx="60" fill="none" stroke="url(#mBorderGrad)" stroke-width="2" stroke-dasharray="8 8" opacity="0.6" />

  <!-- Corner Diamonds -->
  <polygon points="90,90 96,84 102,90 96,96" fill="url(#mGoldGrad)" />
  <polygon points="414,90 420,84 426,90 420,96" fill="url(#mGoldGrad)" />
  <polygon points="90,414 96,408 102,414 96,420" fill="url(#mGoldGrad)" />
  <polygon points="414,414 420,408 426,414 420,420" fill="url(#mGoldGrad)" />

  <!-- Sovereign Star at Top -->
  <polygon points="256,122 265,148 290,148 270,164 278,190 256,174 234,190 242,164 222,148 247,148" fill="url(#mGoldGrad)" />

  <!-- Royal Serif Capital 'P' Letterform -->
  <text x="256" y="356" font-family="'Playfair Display', Georgia, serif" font-size="228" font-weight="900" fill="url(#mGoldGrad)" text-anchor="middle" filter="url(#mGoldGlow)">P</text>

  <!-- Sovereign Baseline Accent Line -->
  <line x1="184" y1="384" x2="328" y2="384" stroke="url(#mBorderGrad)" stroke-width="5" stroke-linecap="round" />
</svg>`;

async function generateIcons() {
  console.log('Generating PWA and application icons from custom "P" mark...');

  // 1. pwa-512x512.png
  await sharp(standardSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✓ pwa-512x512.png created');

  // 2. pwa-maskable-512x512.png
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ pwa-maskable-512x512.png created');

  // 3. pwa-192x192.png
  await sharp(standardSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✓ pwa-192x192.png created');

  // 4. apple-touch-icon.png (180x180)
  await sharp(standardSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png created');

  // 5. favicon.png (64x64)
  await sharp(standardSvg)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ favicon.png created');

  // 6. Generate Android Mipmap Icons
  const mipmaps = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const mip of mipmaps) {
    const targetDir = path.join(androidResDir, mip.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Standard square launcher
    await sharp(standardSvg)
      .resize(mip.size, mip.size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round launcher with maskable SVG
    await sharp(Buffer.from(maskableSvg))
      .resize(mip.size, mip.size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    console.log(`✓ ${mip.dir}/ic_launcher.png & ic_launcher_round.png created (${mip.size}x${mip.size})`);
  }

  // 7. Clean up test file if exists
  if (fs.existsSync('test-render.png')) {
    fs.unlinkSync('test-render.png');
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
