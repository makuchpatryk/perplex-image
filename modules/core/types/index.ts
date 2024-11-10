/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResponsePexel {
  next_page: string;
  page: number;
  per_page: number;
  photos: PexelPhoto[];
  width: number;
  total_results: number;
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

export type TODO = any;
