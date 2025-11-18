import { useState, useEffect } from "react";
import { Smartphone, Download, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Detecta se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Captura o evento de instalação
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  const getInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return {
        title: "Como instalar no iOS",
        steps: [
          "1. Toque no botão 'Compartilhar' (quadrado com seta)",
          "2. Role para baixo e selecione 'Adicionar à Tela de Início'",
          "3. Toque em 'Adicionar' no canto superior direito",
          "4. Pronto! O EduCA$H estará na sua tela inicial 🎉"
        ]
      };
    } else if (/android/.test(userAgent)) {
      return {
        title: "Como instalar no Android",
        steps: [
          "1. Toque nos três pontos no canto superior direito",
          "2. Selecione 'Instalar app' ou 'Adicionar à tela inicial'",
          "3. Confirme a instalação",
          "4. Pronto! O EduCA$H estará na sua tela inicial 🎉"
        ]
      };
    }
    
    return {
      title: "Como instalar",
      steps: [
        "1. Use o botão 'Instalar' abaixo ou",
        "2. No menu do navegador, procure por 'Instalar app'",
        "3. Confirme a instalação",
        "4. Acesse o app direto da sua área de trabalho 🎉"
      ]
    };
  };

  const instructions = getInstructions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-4">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Instale o EduCA$H
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Tenha acesso rápido ao seu controle financeiro direto da tela inicial!
          </p>
        </div>

        {isInstalled ? (
          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">App Instalado! 🎉</h2>
              <p className="text-muted-foreground">
                O EduCA$H já está instalado no seu dispositivo
              </p>
              <Button onClick={() => navigate('/app')} className="w-full">
                Ir para o App
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {deferredPrompt && (
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5">
                <Button
                  onClick={handleInstall}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Instalar Agora
                </Button>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                {instructions.title}
              </h2>
              <ul className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-semibold min-w-[20px]">
                      {step.split('.')[0]}.
                    </span>
                    <span>{step.split('.').slice(1).join('.')}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5">
              <h3 className="text-lg font-bold mb-3 text-foreground">
                Por que instalar?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Acesso instantâneo da tela inicial</li>
                <li>✓ Funciona offline após instalado</li>
                <li>✓ Notificações de desafios e metas</li>
                <li>✓ Carregamento mais rápido</li>
                <li>✓ Experiência de app nativo</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
