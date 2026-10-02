import Vibrant from 'node-vibrant';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractColors() {
  const assetsDir = path.join(__dirname, 'public', 'assets');
  const palette = {};

  for (let i = 1; i <= 13; i++) {
    const imgPath = path.join(assetsDir, `${i}_DESKTOP.webp`);
    try {
      const v = new Vibrant(imgPath);
      const swatches = await v.getPalette();
      // Extract rgb arrays or hex strings
      palette[i] = {
        vibrant: swatches.Vibrant ? swatches.Vibrant.hex : '#ffffff',
        muted: swatches.Muted ? swatches.Muted.hex : '#aaaaaa',
        darkVibrant: swatches.DarkVibrant ? swatches.DarkVibrant.hex : '#000000',
        darkMuted: swatches.DarkMuted ? swatches.DarkMuted.hex : '#333333',
        lightVibrant: swatches.LightVibrant ? swatches.LightVibrant.hex : '#ffffff',
        lightMuted: swatches.LightMuted ? swatches.LightMuted.hex : '#cccccc',
      };
      console.log(`Extracted colors for image ${i}`);
    } catch (e) {
      console.error(`Error extracting colors for ${i}:`, e.message);
      palette[i] = { vibrant: '#ffffff' };
    }
  }

  await fs.writeFile(
    path.join(__dirname, 'src', 'colorPalette.json'),
    JSON.stringify(palette, null, 2)
  );
  console.log('Saved palettes to src/colorPalette.json');
}

extractColors();
