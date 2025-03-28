
import { 
  ImageGenerationOptions, 
  GenerationResponse, 
  Dalle3Response,
  AspectRatio
} from "@/lib/models";

// DALLE-3 API key
const DALLE3_API_KEY = "r-bfde0b6fd826b597bdb9b511";

// Convert aspect ratio to DALLE-3 type parameter
const aspectRatioToDalleType = (aspectRatio: AspectRatio): string => {
  const typeMap: Record<AspectRatio, string> = {
    "1:1": "square",
    "16:9": "wide",
    "9:16": "tall",
    // Other ratios default to square for DALLE-3
    "4:3": "square",
    "3:2": "square",
    "5:4": "square",
    "2:3": "tall",
    "3:4": "tall",
    "4:5": "tall"
  };
  
  return typeMap[aspectRatio] || "square";
};

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
    const dalleType = aspectRatioToDalleType(aspectRatio);
    
    const apiUrl = `https://for-devs.ddns.net/api/dalle3?prompt=${encodeURIComponent(prompt)}&type=${dalleType}&apikey=${DALLE3_API_KEY}`;
    
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

// Generate images with Flux - modified to use more reliable approach
export const generateFluxImages = async (options: Omit<ImageGenerationOptions, 'model'> & { imageCount: number }): Promise<GenerationResponse> => {
  try {
    const { prompt, aspectRatio, imageCount } = options;
    const ratioNumber = aspectRatioToFluxNumber(aspectRatio);
    
    const images = [];
    const errors = [];
    
    // Flux API returns one image per call, so we need to make multiple calls for multiple images
    for (let i = 0; i < imageCount; i++) {
      try {
        // Using a different approach with timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const apiUrl = `https://fluxpro-v3-by-nzr.onrender.com/fluxpro?prompt=${encodeURIComponent(prompt)}&ratio=${ratioNumber}`;
        console.log(`Fetching Flux image ${i + 1}/${imageCount}:`, apiUrl);
        
        const response = await fetch(apiUrl, { 
          signal: controller.signal,
          // Adding headers to avoid CORS issues
          headers: {
            'Accept': 'image/*, application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Flux API Error: ${response.status}`);
        }
        
        // Convert the response to a blob URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        images.push({
          url,
          model: 'flux' as const,
          prompt,
          aspectRatio,
        });
        
        // Add a small delay between requests to avoid rate limiting
        if (i < imageCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error fetching Flux image ${i + 1}:`, error);
        errors.push(error);
      }
    }
    
    if (images.length === 0 && errors.length > 0) {
      throw new Error('Failed to generate any images with Flux. Please try again or try with a different prompt.');
    }
    
    return { 
      images,
      error: errors.length > 0 ? `${errors.length} of ${imageCount} images failed to generate.` : undefined
    };
  } catch (error) {
    console.error('Flux generation error:', error);
    return {
      images: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
