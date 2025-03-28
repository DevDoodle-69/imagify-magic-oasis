
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Image, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)] justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-4 inline-block"
        >
          <div className="bg-secondary/50 text-accent rounded-full px-4 py-2 text-sm font-medium flex items-center">
            <Sparkles size={16} className="mr-2" />
            Advanced AI Image Generation
          </div>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
        >
          Create stunning images with <span className="text-gradient">AI</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg text-muted-foreground mb-10 max-w-2xl"
        >
          Unleash your creativity with our cutting-edge image generation platform. Powered by DALLE-3 and Flux APIs, create stunning, realistic images from simple text prompts.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <button 
            onClick={() => navigate('/generate')}
            className="purple-glow bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-300 hover:shadow-purple-500/25 hover:shadow-lg"
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <FeatureCard 
          icon={<Image className="text-purple-400" />}
          title="DALLE-3 Integration"
          description="Leverage OpenAI's most advanced image generation model to create photorealistic images from text descriptions."
        />
        <FeatureCard 
          icon={<Zap className="text-purple-400" />}
          title="Flux Technology"
          description="Experience rapid image creation with multiple aspect ratios using the powerful Flux API."
        />
        <FeatureCard 
          icon={<Sparkles className="text-purple-400" />}
          title="Creative Freedom"
          description="Choose between multiple aspect ratios and generate as many images as you need."
        />
      </motion.div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-6 rounded-xl"
    >
      <div className="bg-secondary/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default Index;
