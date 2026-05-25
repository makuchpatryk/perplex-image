import { createClient } from "@supabase/supabase-js";
import type { ImagePhoto } from "~/modules/core/types";
import type { ImageAdapter } from "./image-adapter";

interface SupabaseConfig {
  supabaseUrl: string;
  supabaseServiceKey: string;
  supabaseBucket: string;
}

const DEFAULT_METADATA = {
  photographer: "Supabase Upload",
  photographer_id: 0,
  photographer_url: "",
  height: 1200,
  width: 1600,
  liked: false,
} as const;

export class SupabaseImageAdapter implements ImageAdapter {
  private supabaseUrl: string;
  private supabaseKey: string;
  private bucketName: string;
  private cachedFiles: Array<{ name: string }> | null = null;

  constructor(supabaseUrl: string, supabaseKey: string, bucketName: string) {
    if (!supabaseUrl || !supabaseKey || !bucketName) {
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message:
          "Missing Supabase config. Set SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET.",
      });
    }

    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.bucketName = bucketName;
  }

  private getClient() {
    return createClient(this.supabaseUrl, this.supabaseKey);
  }

  private filterImageFiles(files: Array<{ name: string }>) {
    return (files || []).filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    );
  }

  private buildPhotoResponse(
    id: number,
    fileName: string,
    publicUrl: string
  ): ImagePhoto {
    return {
      id,
      alt: fileName,
      ...DEFAULT_METADATA,
      src: {
        landscape: publicUrl,
        large: publicUrl,
        large2x: publicUrl,
        medium: publicUrl,
        original: publicUrl,
        portrait: publicUrl,
        small: publicUrl,
        tiny: publicUrl,
        url: publicUrl,
      },
      url: publicUrl,
    };
  }

  private async fetchFiles() {
    const supabase = this.getClient();

    const { data: files, error } = await supabase.storage
      .from(this.bucketName)
      .list("images", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw error;
    }

    return this.filterImageFiles(files || []);
  }

  async getImage(id: number): Promise<ImagePhoto> {
    if (!Number.isInteger(id) || id < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Parameter 'id' must be a non-negative integer.",
      });
    }

    try {
      const files = await this.fetchFiles();

      if (id >= files.length) {
        throw createError({
          statusCode: 404,
          statusMessage: "Not Found",
          message: "Image with given ID not found.",
        });
      }

      const supabase = this.getClient();
      const file = files[id];
      const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(`images/${file.name}`);

      return this.buildPhotoResponse(id, file.name, data.publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw createError({
        statusCode: 502,
        statusMessage: "Supabase Error",
        message: `Failed to fetch image from Supabase: ${message}`,
      });
    }
  }

  async getImages(): Promise<ImagePhoto[]> {
    try {
      const files = await this.fetchFiles();
      const supabase = this.getClient();

      return files.map((file, index) => {
        const { data } = supabase.storage
          .from(this.bucketName)
          .getPublicUrl(`images/${file.name}`);

        return this.buildPhotoResponse(index, file.name, data.publicUrl);
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw createError({
        statusCode: 502,
        statusMessage: "Supabase Error",
        message: `Failed to fetch images from Supabase: ${message}`,
      });
    }
  }
}

export function createSupabaseAdapter(config: SupabaseConfig): ImageAdapter {
  return new SupabaseImageAdapter(
    config.supabaseUrl,
    config.supabaseServiceKey,
    config.supabaseBucket
  );
}
