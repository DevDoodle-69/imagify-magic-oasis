
import React from "react";
import { motion } from "framer-motion";

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-accent bg-accent/10 text-accent-foreground"
          : "border-secondary bg-secondary/30 hover:bg-secondary/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icon}</div>
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
    </motion.div>
  );
};

export default ModelOption;
