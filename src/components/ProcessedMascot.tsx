import mascotEducash from "@/assets/mascot-educash.png";

const ProcessedMascot = ({ className = "" }: { className?: string }) => {
  return (
    <img 
      src={mascotEducash} 
      alt="PeppaCash - Mascote EduCA$H" 
      className={className}
    />
  );
};

export default ProcessedMascot;
