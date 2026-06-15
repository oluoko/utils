export interface ImageRequestBody {
  imageUrl: string;
}

export interface ImageResponseBody {
  imageUrl: string;
}

export interface ErrorResponseBody {
  error: string;
}

export type ApiResponse = ImageResponseBody | ErrorResponseBody;
