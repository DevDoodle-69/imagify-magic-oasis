
// API types and models

export type ImageModel = "dalle3" | "flux";

export interface ImageGenerationOptions {
  prompt: string;
  model: ImageModel;
  aspectRatio: AspectRatio;
  imageCount?: number; // Only for Flux
}

export type AspectRatio = 
  | "1:1" 
  | "16:9" 
  | "9:16" 
  | "4:3" 
  | "3:2" 
  | "5:4" 
  | "2:3" 
  | "3:4" 
  | "4:5";

export interface GeneratedImage {
  url: string;
  model: ImageModel;
  prompt: string;
  aspectRatio: AspectRatio;
}

export interface GenerationResponse {
  images: GeneratedImage[];
  error?: string;
}

// Dalle-3 response type
export interface Dalle3Response {
  image_url: string;
  type: string;
  quality: string;
}

// Common aspect ratios with pixel dimensions
export const aspectRatioToDimensions: Record<AspectRatio, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1792, height: 1024 },
  "9:16": { width: 1024, height: 1792 },
  "4:3": { width: 1024, height: 768 },
  "3:2": { width: 1024, height: 683 },
  "5:4": { width: 1024, height: 819 },
  "2:3": { width: 683, height: 1024 },
  "3:4": { width: 768, height: 1024 },
  "4:5": { width: 819, height: 1024 },
};

// Model-specific aspect ratio support
export const supportedAspectRatios: Record<ImageModel, AspectRatio[]> = {
  "dalle3": ["1:1", "16:9", "9:16"],
  "flux": ["1:1", "16:9", "9:16", "4:3", "3:2", "5:4", "2:3", "3:4", "4:5"],
};
