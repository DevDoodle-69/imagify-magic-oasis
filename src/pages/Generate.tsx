
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImageDisplay from "@/components/ImageDisplay";
import ImageLoading from "@/components/loading/ImageLoading";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ModelOption from "@/components/ModelOption";
import { 
  AspectRatio,
  GeneratedImage,
  ImageModel,
  supportedAspectRatios
} from "@/lib/models";
import { generateDalle3Image, generateFluxImages } from "@/services/imageService";
import { Download, Image, Sparkles, Repeat } from "lucide-react";

const Generate = () => {
  const { toast } = useToast();
  const [model, setModel] = useState<ImageModel>("dalle3");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [prompt, setPrompt] = useState("");
  const [imageCount, setImageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const availableAspectRatios = supportedAspectRatios[model];
  
  React.useEffect(() => {
    if (!availableAspectRatios.includes(aspectRatio)) {
      setAspectRatio(availableAspectRatios[0]);
    }
  }, [model, availableAspectRatios, aspectRatio]);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setGeneratedImages([]);
    
    try {
      let result;
      
      // Display different toast messages based on the model
      toast({
        title: "Generating...",
        description: model === "dalle3" 
          ? "Creating your image with DALLE-3. This may take a moment." 
          : `Creating ${imageCount} image${imageCount > 1 ? 's' : ''} with Flux.`,
        variant: "default",
      });
      
      if (model === "dalle3") {
        result = await generateDalle3Image({
          prompt,
          aspectRatio,
        });
      } else {
        result = await generateFluxImages({
          prompt,
          aspectRatio,
          imageCount,
        });
      }
      
      if (result.error && result.images.length === 0) {
        throw new Error(result.error);
      }
      
      if (result.images.length > 0) {
        setGeneratedImages(result.images);
        
        if (result.error) {
          toast({
            title: "Partial Success",
            description: result.error,
            variant: "default",
          });
        } else {
          toast({
            title: "Success",
            description: `Generated ${result.images.length} image${result.images.length > 1 ? 's' : ''}.`,
            variant: "default",
          });
        }
      } else {
        throw new Error("No images were generated.");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate images. Please try again with a different prompt.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
          >
            AI Image Generator
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-muted-foreground"
          >
            Create stunning visuals with advanced AI models
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card rounded-xl p-6 mb-10 shadow-lg"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ModelOption 
                id="dalle3"
                name="DALLE-3"
                description="Highly detailed, realistic images"
                icon={<Sparkles className="text-purple-400" size={20} />}
                selected={model === "dalle3"}
                onClick={() => setModel("dalle3")}
              />
              
              <ModelOption 
                id="flux"
                name="Flux"
                description="Multiple images with varied styles"
                icon={<Image className="text-purple-400" size={20} />}
                selected={model === "flux"}
                onClick={() => setModel("flux")}
              />
            </div>
          </div>
          
          <motion.div 
            className="mb-6"
            initial={{ height: "auto" }}
            animate={{ height: "auto" }}
          >
            <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
            <RadioGroup 
              value={aspectRatio} 
              onValueChange={(val) => setAspectRatio(val as AspectRatio)}
              className="flex flex-wrap gap-3"
            >
              {availableAspectRatios.map((ratio) => (
                <div key={ratio}>
                  <RadioGroupItem value={ratio} id={`ratio-${ratio}`} className="peer sr-only" />
                  <label
                    htmlFor={`ratio-${ratio}`}
                    className="flex h-10 items-center justify-center rounded-md border-2 border-muted bg-secondary/50 px-4 py-2 text-sm font-medium hover:bg-secondary/80 hover:text-accent-foreground peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 peer-data-[state=checked]:text-accent cursor-pointer transition-colors"
                  >
                    {ratio}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {model === "flux" && (
              <motion.div 
                key="image-count"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 overflow-hidden"
              >
                <label className="block text-sm font-medium mb-2">Number of Images (1-5)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={imageCount}
                    onChange={(e) => setImageCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <motion.span 
                    key={imageCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="bg-secondary/70 px-3 py-1 rounded-md text-sm font-medium w-10 text-center"
                  >
                    {imageCount}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">Prompt</label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="w-full bg-secondary/30 border border-secondary rounded-lg p-4 h-24 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
              />
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full purple-glow bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate</span>
              </>
            )}
          </button>
        </motion.div>
        
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: model === "flux" ? imageCount : 1 }).map((_, index) => (
                <ImageLoading key={`loading-${index}`} aspectRatio={aspectRatio} />
              ))}
            </motion.div>
          ) : generatedImages.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {generatedImages.map((image, index) => (
                <ImageDisplay key={`image-${index}`} image={image} />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Generate;
