
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
  thickness?: "thin" | "regular" | "thick";
  text?: string;
}

const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const thicknessMap = {
  thin: "border-t-1",
  regular: "border-t-2",
  thick: "border-t-3",
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className,
  color = "border-accent",
  thickness = "regular",
  text
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <motion.div
        className={cn(
          "border-t rounded-full",
          color,
          sizeMap[size],
          thicknessMap[thickness]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
