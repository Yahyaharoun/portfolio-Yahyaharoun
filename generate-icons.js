const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/d0a06d6e-57af-4670-8a6b-866f2a6cd581/yh_premium_logo_1787938119783.jpg';
const publicIconsDir = path.join(__dirname, 'public/icons');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

async function generateIcons() {
  try {
    // 192x192
    await sharp(inputImagePath).resize(192, 192).toFile(path.join(publicIconsDir, 'icon-192x192.png'));
    // 256x256
    await sharp(inputImagePath).resize(256, 256).toFile(path.join(publicIconsDir, 'icon-256x256.png'));
    // 384x384
    await sharp(inputImagePath).resize(384, 384).toFile(path.join(publicIconsDir, 'icon-384x384.png'));
    // 512x512
    await sharp(inputImagePath).resize(512, 512).toFile(path.join(publicIconsDir, 'icon-512x512.png'));
    // apple-touch-icon
    await sharp(inputImagePath).resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'));
    // favicon (we'll just use a 32x32 png, browsers accept png as favicon if specified)
    await sharp(inputImagePath).resize(32, 32).toFile(path.join(publicDir, 'favicon.ico'));
    
    console.log('Icons generated successfully.');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
