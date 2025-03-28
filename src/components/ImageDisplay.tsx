
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Maximize } from "lucide-react";
import { GeneratedImage } from "@/lib/models";
import { aspectRatioToDimensions } from "@/lib/models";

interface ImageDisplayProps {
  image: GeneratedImage;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image }) => {
  const { url, model, prompt, aspectRatio } = image;
  const dimensions = aspectRatioToDimensions[aspectRatio];
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const handleDownload = () => {
    // Create an anchor element and set the href to the image URL
    const link = document.createElement('a');
    link.href = url;
    link.download = `${model}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-lg overflow-hidden flex flex-col relative group"
      >
        <div 
          className="relative overflow-hidden cursor-pointer"
          onClick={openPreview}
        >
          <motion.img 
            src={url} 
            alt={prompt}
            className="w-full h-auto object-cover"
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-white text-sm truncate mb-2">{prompt}</p>
            <div className="flex justify-between items-center">
              <span className="bg-secondary/70 text-white text-xs px-2 py-1 rounded-full">
                {aspectRatio} • {model}
              </span>
            </div>
          </div>
          <motion.div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="bg-accent hover:bg-accent/80 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
              aria-label="Download image"
            >
              <Download size={16} />
            </button>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize className="text-white drop-shadow-lg" size={24} />
          </div>
        </div>
      </motion.div>
      
      {/* Full screen image preview */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
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
                <button
                  onClick={closePreview}
                  className="bg-destructive hover:bg-destructive/80 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
                  aria-label="Close preview"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm md:text-base max-w-3xl mx-auto">{prompt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageDisplay;
