
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Maximize, Eye } from "lucide-react";
import { GeneratedImage } from "@/lib/models";
import { aspectRatioToDimensions } from "@/lib/models";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageDisplayProps {
  image: GeneratedImage;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image }) => {
  const { url, model, prompt, aspectRatio } = image;
  const dimensions = aspectRatioToDimensions[aspectRatio];
  
  const handleDownload = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Create an anchor element and set the href to the image URL
    const link = document.createElement('a');
    link.href = url;
    link.download = `${model}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-lg overflow-hidden flex flex-col relative group shadow-md hover:shadow-lg transition-all duration-300"
      >
        <DialogTrigger asChild>
          <div className="relative overflow-hidden cursor-pointer">
            <motion.img 
              src={url} 
              alt={prompt}
              className="w-full h-auto object-cover"
              loading="lazy"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Download button overlay */}
            <motion.div 
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="bg-accent hover:bg-accent/80 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                    aria-label="Download image"
                  >
                    <Download size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download image</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
            
            {/* Preview icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="text-white drop-shadow-lg" size={28} />
            </div>
            
            {/* Model type badge */}
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {model} • {aspectRatio}
            </div>
          </div>
        </DialogTrigger>
      </motion.div>
      
      {/* Full-screen dialog for image preview */}
      <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
        <div className="relative flex items-center justify-center min-h-[80vh] p-0">
          <img 
            src={url} 
            alt={prompt} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg" 
          />
          
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              onClick={handleDownload}
              className="bg-accent hover:bg-accent/80 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
              aria-label="Download image"
            >
              <Download size={20} />
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-sm md:text-base max-w-3xl mx-auto">{prompt}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDisplay;
