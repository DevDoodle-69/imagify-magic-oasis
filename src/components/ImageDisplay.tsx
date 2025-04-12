import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Eye } from "lucide-react";
import { GeneratedImage } from "@/lib/models";
import {
Dialog,
DialogContent,
DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ImageDisplayProps {
image: GeneratedImage;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image }) => {
const { url, model, prompt, aspectRatio } = image;
const { toast } = useToast();
const [isOpen, setIsOpen] = React.useState(false);

const handleDownload = (e?: React.MouseEvent) => {
if (e) e.stopPropagation();

try {
  const link = document.createElement('a');
  link.href = url;
  link.download = `dalle3-masterpiece-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
    
  toast({
    title: "Download Started",
    description: "Your masterpiece is being downloaded",
    variant: "default",
  });
} catch (error) {
  toast({
    title: "Download Failed",
    description: "Please try again or right-click and save image",
    variant: "destructive",
  });
}
};

return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
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
className="w-full h-auto object-cover"
loading="lazy"
whileHover={{ scale: 1.03 }}
transition={{ duration: 0.3 }}
/>
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
              <p>Download Masterpiece</p>  
            </TooltipContent>  
          </Tooltip>  
        </motion.div>  
          
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">  
          <motion.div  
            whileHover={{ scale: 1.1 }}  
            className="bg-accent/90 p-3 rounded-full"  
          >  
            <Eye className="text-white" size={24} />  
          </motion.div>  
        </div>  
          
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">  
          {model} • {aspectRatio}  
        </div>  
      </div>  
    </DialogTrigger>  
  </motion.div>  
    
  <DialogContent className="max-w-6xl p-0 bg-black/95 border-none">  
    <AnimatePresence>  
      <motion.div   
        initial={{ opacity: 0 }}  
        animate={{ opacity: 1 }}  
        exit={{ opacity: 0 }}  
        className="relative flex items-center justify-center min-h-[85vh] p-0"  
      >  
        <motion.img   
          src={url}   
          alt={prompt}   
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"   
          initial={{ scale: 0.9, opacity: 0 }}  
          animate={{ scale: 1, opacity: 1 }}  
          transition={{ duration: 0.4 }}  
        />  
          
        <motion.div   
          className="absolute top-4 right-4 flex gap-3"  
          initial={{ opacity: 0, y: -10 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ delay: 0.2, duration: 0.3 }}  
        >  
          <button  
            onClick={handleDownload}  
            className="bg-accent hover:bg-accent/80 text-white p-3 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2"  
            aria-label="Download image"  
          >  
            <Download size={20} />  
            <span className="text-sm font-medium hidden sm:inline">Download</span>  
          </button>  
            
          <button  
            onClick={() => setIsOpen(false)}  
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg transition-colors duration-200"  
            aria-label="Close preview"  
          >  
            <X size={20} />  
          </button>  
        </motion.div>  
      </motion.div>  
    </AnimatePresence>  
  </DialogContent>  
</Dialog>
);
};

export default ImageDisplay;
