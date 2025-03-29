
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImageDisplay from "@/components/ImageDisplay";
import ImageLoading from "@/components/loading/ImageLoading";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  AspectRatio,
  GeneratedImage,
  supportedAspectRatios,
} from "@/lib/models";
import { generateDalle3Image } from "@/services/imageService";
import { Sparkles } from "lucide-react";

const Generate = () => {
  const { toast } = useToast();
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const availableAspectRatios = supportedAspectRatios.dalle3;
  
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
      // Display toast message
      toast({
        title: "Creating Magic...",
        description: "Generating your image with DALLE-3. This may take a moment.",
        variant: "default",
      });
      
      const result = await generateDalle3Image({
        prompt,
        aspectRatio,
      });
      
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
            title: "✨ Success",
            description: "Your stunning image has been created!",
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient tracking-tight"
          >
            Experience DALLE-3 Magic
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Transform your ideas into stunning visuals with state-of-the-art AI
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card rounded-xl p-6 mb-10 shadow-lg"
        >
          <motion.div 
            className="mb-6"
            initial={{ height: "auto" }}
            animate={{ height: "auto" }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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
          
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">Your Vision</label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create in vivid detail..."
                className="w-full bg-secondary/30 border border-secondary rounded-lg p-4 h-28 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
              />
            </div>
          </div>
          
          <motion.button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full purple-glow bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Creating Your Vision...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Masterpiece</span>
              </>
            )}
          </motion.button>
        </motion.div>
        
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImageLoading aspectRatio={aspectRatio} />
            </motion.div>
          ) : generatedImages.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
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
