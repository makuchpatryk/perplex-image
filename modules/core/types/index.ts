export interface ResponsePexel {
  id: string;
  media: PexelPhoto[];
  page: number;
  per_page: number;
  total_results: number;
  prev_page?: string;
  next_page?: string;
}

export interface PexelPhoto {
  alt: string;
  avg_color: string;
  height: number;
  width: number;
  id: number;
  liked: boolean;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
  src: {
    landscape: string;
    large: string;
    large2x: string;
    medium: string;
    original: string;
    portrait: string;
    small: string;
    tiny: string;
    url: string;
  };
  url: string;
}
export interface ImagePieces {
  position: number;
  backgroundPosition: string;
  width: string;
  height: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TODO = any;
