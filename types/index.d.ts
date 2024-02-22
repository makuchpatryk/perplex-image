declare global {
    interface PexelPhotos {
        next_page: string,
        page: number,
        per_page: number,
        photos: {
            alt: string,
            avg_color: string,
            height: number,
            id: number,
            liked: boolean,
            photographer: string,
            photographer_id: number,
            photographer_url: string,
            src: {
                landscape: string,
                large: string,
                large2x: string,
                medium: string,
                original: string,
                portrait: string,
                small: string,
                tiny: string,
                url: string,
            }
            url: string,
        }[],
        width: number,
        total_results: number,
    }
    interface ImagePieces {
        position: number,
        backgroundPosition: string,
        width: string,
        height: string,
    }
}

export {};