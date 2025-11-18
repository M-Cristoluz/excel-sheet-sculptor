import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Target, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ProcessedMascot from "./ProcessedMascot";

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const steps = [
  {
    title: "Bem-vindo ao EduCA$H! 🎉",
    description: "Sua jornada para a educação financeira gamificada começa aqui. Aprenda enquanto gerencia suas finanças de forma divertida!",
    icon: ProcessedMascot,
    color: "from-primary to-educash-green-base",
  },
  {
    title: "Importe sua Planilha 📊",
    description: "Faça upload da sua planilha de gastos (formato: Data | Mês | Ano | Tipo | Descrição | Valor). Nossa IA categorizará tudo automaticamente!",
    icon: TrendingUp,
    color: "from-educash-green-base to-educash-green-medium",
  },
  {
    title: "Ganhe EduCoins! 💰",
    description: "Complete desafios, mantenha gastos sob controle e ganhe EduCoins para trocar por recompensas mensais. Gamificação real!",
    icon: Award,
    color: "from-accent to-educash-gold",
  },
];

const Onboarding = ({ onComplete, onSkip }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Card className="relative w-full max-w-2xl bg-card border-2 shadow-2xl animate-scale-in overflow-hidden">
          {/* Gradiente de fundo */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.color} opacity-5`} />
          
          {/* Botão fechar */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="relative p-8 space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Passo {currentStep + 1} de {steps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Conteúdo */}
            <div className="text-center space-y-6 py-8">
              <div className="flex justify-center animate-bounce-in">
                {currentStepData.icon === ProcessedMascot ? (
                  <ProcessedMascot className="w-32 h-32 object-contain" />
                ) : (
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentStepData.color} flex items-center justify-center shadow-lg`}>
                    <currentStepData.icon className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-3 animate-slide-up">
                <h2 className="text-3xl font-bold text-foreground font-display">
                  {currentStepData.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {/* Navegação */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-8 bg-primary'
                        : idx < currentStep
                        ? 'w-2 bg-primary/50'
                        : 'w-2 bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="gap-2 bg-gradient-to-r from-primary to-educash-green-medium hover:opacity-90 transition-opacity"
              >
                {currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Link para pular */}
            <div className="text-center pt-2">
              <button
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Pular tutorial
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;