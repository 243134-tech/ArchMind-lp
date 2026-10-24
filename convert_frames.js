const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'archmind_video_frames');
const outputDir = path.join(__dirname, 'frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertAll() {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png')).sort();
  console.log(`Found ${files.length} frames to convert.`);

  const startTime = Date.now();
  const concurrency = 8;
  let completed = 0;

  async function worker(items) {
    for (const file of items) {
      const inPath = path.join(inputDir, file);
      const outName = file.replace(/\.png$/, '.webp');
      const outPath = path.join(outputDir, outName);

      if (!fs.existsSync(outPath)) {
        await sharp(inPath)
          .webp({ quality: 88, effort: 3 })
          .toFile(outPath);
      }
      completed++;
      if (completed % 25 === 0 || completed === files.length) {
        console.log(`Progress: ${completed}/${files.length} frames (${Math.round((completed / files.length) * 100)}%)`);
      }
    }
  }

  const chunks = Array.from({ length: concurrency }, () => []);
  files.forEach((file, idx) => {
    chunks[idx % concurrency].push(file);
  });

  await Promise.all(chunks.map(worker));

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Completed conversion of ${files.length} frames in ${totalTime}s.`);
}

convertAll().catch(err => {
  console.error(err);
  process.exit(1);
});
