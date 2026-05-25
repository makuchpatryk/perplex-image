# Image Upload to Supabase

Script to compress images to WebP format and upload them to Supabase bucket.

## Setup

1. **Add dependencies** (if not already installed):

   ```bash
   pnpm add -D sharp tsx
   pnpm add dotenv
   ```

2. **Ensure `.env` contains Supabase config:**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_BUCKET=images
   ```

## Usage

1. **Add images** to `imagesToUpload/` folder
2. **Run script**:
   ```bash
   pnpm upload:images
   ```

## What happens

- Images resized to max 2000px (keeps aspect ratio)
- Compressed to WebP format (quality 60)
- Compressed images uploaded to Supabase bucket under `images/` prefix
- Original images moved to `done/` folder with `.uploaded` suffix
- Compressed WebP files deleted after upload

## Folder structure

```
scripts/uploadImages/
├── upload.ts                   # Main script
├── imagesToUpload/             # Add images here (processed files deleted after upload)
├── done/                       # Processed images and originals (.uploaded)
└── README.md                   # This file
```

## Supported formats

- JPEG / JPG
- PNG
- GIF
- WebP

## Error handling

- Failed uploads leave images in `imagesToUpload/` for retry
- Check console output for detailed error messages
