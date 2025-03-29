
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModelOptionProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const ModelOption: React.FC<ModelOptionProps> = ({
  id,
  name,
  description,
  icon,
  selected,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative rounded-lg p-4 cursor-pointer transition-all duration-300",
        selected
          ? "border-2 border-accent bg-accent/10 text-accent-foreground shadow-lg"
          : "border border-secondary bg-secondary/30 hover:bg-secondary/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "shrink-0 mt-0.5 transition-colors duration-300",
          selected ? "text-accent" : "text-muted-foreground"
        )}>
          {icon}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        </div>
      </div>
      {selected && (
        <motion.div
          layoutId="selectedModel"
          className="absolute inset-0 border-2 border-accent rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: "none" }}
        />
      )}
      {selected && (
        <motion.div 
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModelOption;
