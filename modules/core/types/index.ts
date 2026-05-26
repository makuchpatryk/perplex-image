// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TODO = any;

export interface ResponseImage {
  id: string;
  media: ImagePhoto[];
  page: number;
  per_page: number;
  total_results: number;
  prev_page?: string;
  next_page?: string;
}

export interface ImagePhoto {
  alt: string;
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
  originalIndex: number;
  backgroundPosition: string;
  width: string;
  height: string;
  selected?: boolean;
}

export interface DisplacedMapping {
  piece: ImagePieces;
  newSlot: number;
}
