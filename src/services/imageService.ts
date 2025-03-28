
import { 
  ImageGenerationOptions, 
  GenerationResponse, 
  Dalle3Response,
  AspectRatio
} from "@/lib/models";

// DALLE-3 API key
const DALLE3_API_KEY = "r-bfde0b6fd826b597bdb9b511";

// Convert aspect ratio to Flux API ratio number
const aspectRatioToFluxNumber = (aspectRatio: AspectRatio): number => {
  const ratioMap: Record<AspectRatio, number> = {
    "1:1": 1,
    "16:9": 2,
    "4:3": 3,
    "3:2": 4,
    "5:4": 5,
    "9:16": 6,
    "2:3": 7,
    "3:4": 8,
    "4:5": 9
  };
  
  return ratioMap[aspectRatio] || 1;
};

// Generate images with DALLE-3
export const generateDalle3Image = async (options: Omit<ImageGenerationOptions, 'model'>): Promise<GenerationResponse> => {
  try {
    const { prompt, aspectRatio } = options;
    
    const apiUrl = `https://for-devs.ddns.net/api/dalle3?prompt=${encodeURIComponent(prompt)}&type=image&apikey=${DALLE3_API_KEY}`;
    
    // Show in console we're fetching (for debugging)
    console.log('Fetching from DALLE-3 API:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DALLE-3 API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json() as Dalle3Response;
    
    if (!data || !data.image_url) {
      throw new Error('Failed to generate image with DALLE-3.');
    }
    
    return {
      images: [{
        url: data.image_url,
        model: 'dalle3',
        prompt,
        aspectRatio,
      }]
    };
  } catch (error) {
    console.error('DALLE-3 generation error:', error);
    return {
      images: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Generate images with Flux
export const generateFluxImages = async (options: Omit<ImageGenerationOptions, 'model'> & { imageCount: number }): Promise<GenerationResponse> => {
  try {
    const { prompt, aspectRatio, imageCount } = options;
    const ratioNumber = aspectRatioToFluxNumber(aspectRatio);
    
    const images = [];
    
    // Flux API returns one image per call, so we need to make multiple calls for multiple images
    for (let i = 0; i < imageCount; i++) {
      const apiUrl = `https://fluxpro-v3-by-nzr.onrender.com/fluxpro?prompt=${encodeURIComponent(prompt)}&ratio=${ratioNumber}`;
      
      console.log(`Fetching Flux image ${i + 1}/${imageCount}:`, apiUrl);
      
      // Fetch image as blob
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Flux API Error: ${response.status}`);
      }
      
      // Convert the arraybuffer to a blob URL
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      images.push({
        url,
        model: 'flux' as const,
        prompt,
        aspectRatio,
      });
    }
    
    return { images };
  } catch (error) {
    console.error('Flux generation error:', error);
    return {
      images: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
