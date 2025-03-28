
import React from "react";
import { motion } from "framer-motion";
import { AspectRatio } from "@/lib/models";
import { aspectRatioToDimensions } from "@/lib/models";

interface ImageLoadingProps {
  aspectRatio: AspectRatio;
}

const ImageLoading: React.FC<ImageLoadingProps> = ({ aspectRatio }) => {
  const dimensions = aspectRatioToDimensions[aspectRatio];
  const ratio = dimensions.height / dimensions.width;
  
  // Create a percentage-based padding for maintaining aspect ratio
  const paddingBottom = `${ratio * 100}%`;
  
  return (
    <div className="glass-card rounded-lg overflow-hidden shimmer relative" style={{ paddingBottom }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default ImageLoading;
