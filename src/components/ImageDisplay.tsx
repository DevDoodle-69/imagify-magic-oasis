
import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { GeneratedImage } from "@/lib/models";
import { aspectRatioToDimensions } from "@/lib/models";

interface ImageDisplayProps {
  image: GeneratedImage;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image }) => {
  const { url, model, prompt, aspectRatio } = image;
  const dimensions = aspectRatioToDimensions[aspectRatio];
  
  const handleDownload = () => {
    // Create an anchor element and set the href to the image URL
    const link = document.createElement('a');
    link.href = url;
    link.download = `${model}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-lg overflow-hidden flex flex-col"
    >
      <div className="relative overflow-hidden group">
        <img 
          src={url} 
          alt={prompt}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm truncate mb-2">{prompt}</p>
          <div className="flex justify-between items-center">
            <span className="bg-secondary/70 text-white text-xs px-2 py-1 rounded-full">
              {aspectRatio} • {model}
            </span>
            <button
              onClick={handleDownload}
              className="bg-accent hover:bg-accent/80 text-white p-2 rounded-full transition-colors duration-200"
              aria-label="Download image"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageDisplay;
