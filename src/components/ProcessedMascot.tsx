import { useEffect, useState } from "react";
import { removeBackground, loadImage } from "@/utils/imageProcessing";
import mascotOriginal from "@/assets/mascot.jpeg";

const ProcessedMascot = ({ className = "" }: { className?: string }) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processImage = async () => {
      try {
        setIsProcessing(true);
        
        // Load the original image
        const response = await fetch(mascotOriginal);
        const blob = await response.blob();
        const imageElement = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(imageElement);
        const url = URL.createObjectURL(processedBlob);
        
        setProcessedImage(url);
      } catch (error) {
        console.error("Failed to process mascot image:", error);
        // Fallback to original image
        setProcessedImage(mascotOriginal);
      } finally {
        setIsProcessing(false);
      }
    };

    processImage();
  }, []);

  if (isProcessing) {
    return (
      <div className={`${className} animate-pulse bg-muted rounded-2xl flex items-center justify-center`}>
        <p className="text-muted-foreground">Preparando PeppaCash...</p>
      </div>
    );
  }

  return (
    <img 
      src={processedImage || mascotOriginal} 
      alt="PeppaCash - Mascote EduCA$H" 
      className={className}
    />
  );
};

export default ProcessedMascot;
