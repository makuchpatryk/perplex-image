import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_TO_UPLOAD = path.join(__dirname, "imagesToUpload");
const DONE_FOLDER = path.join(__dirname, "done");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const bucketName = process.env.SUPABASE_BUCKET;

if (!supabaseUrl || !supabaseServiceKey || !bucketName) {
  console.error(
    "❌ Missing Supabase config. Check .env for SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function compressImage(inputPath: string): Promise<string> {
  const ext = path.extname(inputPath).toLowerCase();
  const outputName = path.basename(inputPath, ext) + ".webp";
  const outputPath = path.join(DONE_FOLDER, outputName);

  try {
    await sharp(inputPath)
      .resize(2000, 2000, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 60 })
      .toFile(outputPath);

    console.log(`✅ Compressed: ${path.basename(inputPath)} → ${outputName}`);
    return outputPath;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Compression failed for ${inputPath}:`, errorMsg);
    throw error;
  }
}

async function uploadToSupabase(
  filePath: string,
  fileName: string
): Promise<void> {
  try {
    const fileBuffer = fs.readFileSync(filePath);

    const { error } = await supabase.storage
      .from(bucketName!)
      .upload(`images/${fileName}`, fileBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      console.error(`❌ Upload failed for ${fileName}:`, error.message);
      throw error;
    }

    console.log(`📤 Uploaded: ${fileName}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Supabase upload error:`, errorMsg);
    throw error;
  }
}

async function moveToOriginalDone(originalPath: string): Promise<void> {
  try {
    // Original file moved to done folder with .uploaded suffix
    const ext = path.extname(originalPath);
    const newName = path.basename(originalPath, ext) + ".uploaded" + ext;
    const newPath = path.join(DONE_FOLDER, newName);

    fs.renameSync(originalPath, newPath);
    console.log(
      `📁 Moved original: ${path.basename(originalPath)} → ${newName}`
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Move failed:`, errorMsg);
    throw error;
  }
}

async function processImages(): Promise<void> {
  if (!fs.existsSync(IMAGES_TO_UPLOAD)) {
    console.error(`❌ Folder not found: ${IMAGES_TO_UPLOAD}`);
    process.exit(1);
  }

  if (!fs.existsSync(DONE_FOLDER)) {
    fs.mkdirSync(DONE_FOLDER, { recursive: true });
  }

  const files = fs.readdirSync(IMAGES_TO_UPLOAD);
  const imageFiles = files.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

  if (imageFiles.length === 0) {
    console.log("ℹ️  No images found in imagesToUpload folder");
    return;
  }

  console.log(`\n🚀 Processing ${imageFiles.length} image(s)...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const fileName of imageFiles) {
    try {
      const originalPath = path.join(IMAGES_TO_UPLOAD, fileName);

      // Compress
      const compressedPath = await compressImage(originalPath);
      const compressedFileName = path.basename(compressedPath);

      // Upload
      await uploadToSupabase(compressedPath, compressedFileName);

      // Move original
      await moveToOriginalDone(originalPath);

      // Delete compressed file (keep only original)
      fs.unlinkSync(compressedPath);
      console.log(`🗑️  Deleted compressed: ${compressedFileName}`);

      successCount++;
      console.log("");
    } catch {
      failCount++;
      console.log("");
    }
  }

  console.log(
    `\n✅ Done! ${successCount}/${imageFiles.length} images processed`
  );
  if (failCount > 0) {
    console.log(`⚠️  ${failCount} image(s) failed`);
  }
}

processImages().catch((err) => {
  const errorMsg = err instanceof Error ? err.message : String(err);
  console.error("Fatal error:", errorMsg);
  process.exit(1);
});
