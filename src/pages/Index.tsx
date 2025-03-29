
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Image, Zap, MessageSquareCode, Bot } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
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

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const featureData = [
    {
      icon: <Sparkles className="text-purple-400" />,
      title: "Advanced AI",
      description: "DALLE-3 generates photorealistic images from detailed text descriptions with stunning accuracy."
    },
    {
      icon: <Image className="text-purple-400" />,
      title: "Multiple Aspect Ratios",
      description: "Generate perfect images in various dimensions, from square to portrait and landscape formats."
    },
    {
      icon: <MessageSquareCode className="text-purple-400" />,
      title: "Intelligent Understanding",
      description: "The AI understands complex prompts, artistic styles, and detailed visual references."
    },
    {
      icon: <Bot className="text-purple-400" />,
      title: "Creative Assistance",
      description: "Get help with all your creative projects, from concept art to marketing visuals."
    },
    {
      icon: <Zap className="text-purple-400" />,
      title: "Instant Creation",
      description: "Experience rapid image generation with high-quality results in just seconds."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center">
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full filter blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/20 rounded-full filter blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-4xl mx-auto z-10"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-4 inline-block"
        >
          <div className="bg-secondary/50 text-accent rounded-full px-4 py-2 text-sm font-medium flex items-center">
            <Sparkles size={16} className="mr-2" />
            AI-Powered Art Generation
          </div>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
        >
          Create stunning <span className="text-gradient">masterpieces</span> with a single prompt
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
        >
          Unleash your creativity with our cutting-edge image generation platform. Powered by DALLE-3, transform simple text into breathtaking, realistic visuals in seconds.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center">
          <motion.button 
            onClick={() => navigate('/generate')}
            className="purple-glow bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-300 hover:shadow-purple-500/25 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Create Now</span>
            <ArrowRight size={18} />
          </motion.button>
          
          <motion.a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300 underline-offset-4 hover:underline"
          >
            Learn more
          </motion.a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 max-w-lg mx-auto relative z-10"
        >
          <img 
            src="https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg" 
            alt="AI Generated Art Example" 
            className="rounded-lg shadow-2xl"
          />
          <div className="absolute -bottom-3 -right-3 bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-white">
            Generated with DALLE-3
          </div>
        </motion.div>
      </motion.div>

      <div id="features" ref={ref} className="mt-32 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Why Choose Imagify</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Experience the future of creative content generation with our cutting-edge AI technology</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="bg-secondary/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-24 mb-16 max-w-4xl mx-auto text-center glass-card p-10 rounded-2xl"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to create?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Start generating stunning AI art with just a few clicks. No design skills needed - just your imagination.
        </p>
        <motion.button 
          onClick={() => navigate('/generate')}
          className="purple-glow bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-300 hover:shadow-purple-500/25 hover:shadow-lg mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Index;
