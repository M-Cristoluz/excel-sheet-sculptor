import { Share2, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

interface SocialShareProps {
  achievement: string;
  coins: number;
  savings?: number;
}

export const SocialShare = ({ achievement, coins, savings }: SocialShareProps) => {
  const handleShare = async (platform: 'whatsapp' | 'instagram' | 'generic') => {
    const text = `🎯 ${achievement}\n\n💰 EduCoins conquistados: ${coins}\n${savings ? `📊 Economias: R$ ${savings.toFixed(2)}` : ''}\n\n✨ Minha jornada financeira no EduCA$H! 🚀\n\n#EduCASH #EducaçãoFinanceira #MetasAlcançadas`;
    
    const shareData = {
      title: 'Minha Conquista no EduCA$H',
      text: text,
      url: 'https://instagram.com/educash.oficial'
    };

    try {
      if (platform === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\nConheça: ' + window.location.origin)}`;
        window.open(whatsappUrl, '_blank');
        toast.success("Compartilhando no WhatsApp!");
      } else if (platform === 'instagram') {
        // Instagram não tem API direta de compartilhamento, então copiamos o texto
        await navigator.clipboard.writeText(text);
        toast.success("Texto copiado! Cole no seu story do Instagram 📸", {
          description: "Siga @educash.oficial"
        });
        window.open('https://instagram.com/educash.oficial', '_blank');
      } else if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Conquista compartilhada! 🎉");
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Texto copiado para a área de transferência!");
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Não foi possível compartilhar");
      }
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Share2 className="h-4 w-4 text-primary" />
          Compartilhe sua conquista!
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white"
            size="sm"
          >
            WhatsApp
          </Button>
          
          <Button
            onClick={() => handleShare('instagram')}
            className="flex-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
            size="sm"
          >
            <Instagram className="h-4 w-4 mr-1" />
            Instagram
          </Button>
          
          {navigator.share && (
            <Button
              onClick={() => handleShare('generic')}
              variant="outline"
              size="sm"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
