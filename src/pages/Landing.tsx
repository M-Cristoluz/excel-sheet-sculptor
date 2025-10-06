import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Rocket, 
  FileText, 
  Star, 
  TrendingUp, 
  Shield, 
  Users,
  Award,
  Lightbulb,
  Heart,
  Target,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import educashLogo from "@/assets/educash-logo.png";
import mascot from "@/assets/mascot.jpeg";
import heroBanner from "@/assets/hero-banner.jpeg";
import teamPhoto from "@/assets/team-photo.jpeg";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={educashLogo} alt="EduCA$H" className="h-12 w-12" />
            <div>
              <h2 className="text-xl font-bold text-foreground">EduCA$H</h2>
              <p className="text-xs text-muted-foreground">Mente Rica, Futuro Brilhante</p>
            </div>
          </div>
          <Link to="/app">
            <Button size="lg" className="bg-educash-green-base hover:bg-educash-green-dark text-white">
              Acessar Plataforma
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Cansado de sentir que o dinheiro te controla?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Seja sincero: você sente que está sempre correndo atrás do dinheiro, mas nunca chega lá? 
              A gente entende. O EduCa$h foi feito para transformar a sua relação com as finanças.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/app">
                <Button size="lg" className="bg-educash-green-base hover:bg-educash-green-dark text-white text-lg px-8 py-6">
                  Comece sua jornada de liberdade
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Em menos de 5 minutos, você já vai ter seu primeiro plano financeiro.
              </p>
            </div>
            <div className="mt-12 flex justify-center">
              <img 
                src={mascot} 
                alt="PeppaCash - Mascote EduCA$H" 
                className="h-48 md:h-64 animate-bounce"
              />
            </div>
          </div>
        </div>
      </section>

      {/* A Dor e a Cura */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              O buraco no bolso, a ansiedade no peito.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Não sabe pra onde o dinheiro vai?</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">O salário acaba antes do mês?</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Medo de investir porque 'não é pra você'?</CardTitle>
                </CardHeader>
              </Card>
            </div>
            <div className="pt-8">
              <p className="text-xl md:text-2xl text-foreground font-semibold">
                Pare de se preocupar. A EduCa$h é o mapa que te tira do labirinto financeiro.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                E a melhor parte? É tudo feito por quem já passou por isso: de jovens para jovens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jornada Gameficada */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              Sua jornada rumo à mente rica.
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Acompanhe sua evolução através das 5 fases com o PeppaCash
            </p>
            
            <div className="space-y-8">
              {[
                {
                  icon: Rocket,
                  title: "Fase 1: Partiu Grana!",
                  description: "Com o PeppaCash, você aprende a fazer as pazes com o seu dinheiro.",
                  color: "text-educash-green-base"
                },
                {
                  icon: FileText,
                  title: "Fase 2: Missão Organização",
                  description: "Aprenda a controlar seus gastos e organize sua vida financeira como um mestre.",
                  color: "text-educash-green-medium"
                },
                {
                  icon: Star,
                  title: "Fase 3: Poupe & Brilhe",
                  description: "Crie metas e veja sua reserva de emergência crescer, sem dor de cabeça.",
                  color: "text-educash-yellow"
                },
                {
                  icon: TrendingUp,
                  title: "Fase 4: Investir é Real",
                  description: "Descubra que investir não é um bicho de sete cabeças e comece a ver seu dinheiro multiplicar.",
                  color: "text-educash-gold"
                },
                {
                  icon: Shield,
                  title: "Fase 5: Liberdade em Vista",
                  description: "O topo da jornada: independência financeira e a chance de viver o futuro que você sempre sonhou.",
                  color: "text-primary"
                }
              ].map((phase, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-4 rounded-full bg-muted ${phase.color}`}>
                      <phase.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{phase.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {phase.description}
                      </CardDescription>
                    </div>
                    <div className="text-4xl font-bold text-muted-foreground/20">
                      {index + 1}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* O Que nos Diferencia */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              Isso não é só mais um curso. É um estilo de vida.
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-educash-green-base/10 w-fit mb-4">
                    <Award className="w-12 h-12 text-educash-green-base" />
                  </div>
                  <CardTitle className="text-xl">A Força dos EduCoins</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A cada missão concluída, você ganha EduCoins, nossa moeda virtual. 
                    Troque por e-books, mentorias e prêmios que te ajudam a ir ainda mais longe.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-educash-yellow/10 w-fit mb-4">
                    <Heart className="w-12 h-12 text-educash-yellow" />
                  </div>
                  <CardTitle className="text-xl">O Seu Guia, PeppaCash</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Conheça o nosso mascote! Ele está ao seu lado em cada etapa, com dicas, 
                    desafios e um bom-humor que transforma o aprendizado em algo leve e divertido.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-educash-gold/10 w-fit mb-4">
                    <Target className="w-12 h-12 text-educash-gold" />
                  </div>
                  <CardTitle className="text-xl">Conectando o Sonho à Realidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Não queremos apenas que você aprenda, queremos que você vença. 
                    As recompensas do Pódio Mensal são reais: mentorias e brindes exclusivos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              O que nos move.
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="p-3 rounded-full bg-educash-green-base/10 w-fit mb-4">
                    <Target className="w-8 h-8 text-educash-green-base" />
                  </div>
                  <CardTitle className="text-2xl">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Educar e empoderar jovens para que conquistem uma vida financeira equilibrada, 
                    autônoma e de qualidade, utilizando a educação financeira como ferramenta de 
                    transformação pessoal e social.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-3 rounded-full bg-educash-yellow/10 w-fit mb-4">
                    <Lightbulb className="w-8 h-8 text-educash-yellow" />
                  </div>
                  <CardTitle className="text-2xl">Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ser referência nacional em educação financeira para juventudes até 2030, 
                    impactando milhares de vidas e ampliando oportunidades por meio de um modelo 
                    acessível, moderno e eficaz de ensino.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-3 rounded-full bg-educash-gold/10 w-fit mb-4">
                    <Heart className="w-8 h-8 text-educash-gold" />
                  </div>
                  <CardTitle className="text-2xl">Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-educash-green-base mt-0.5 flex-shrink-0" />
                      <span>Ética e Transparência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-educash-green-base mt-0.5 flex-shrink-0" />
                      <span>Empoderamento juvenil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-educash-green-base mt-0.5 flex-shrink-0" />
                      <span>Educação acessível e inclusiva</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-educash-green-base mt-0.5 flex-shrink-0" />
                      <span>Autonomia e protagonismo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-educash-green-base mt-0.5 flex-shrink-0" />
                      <span>Leveza educativa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-educash-green-base mt-0.5 flex-shrink-0" />
                      <span>Crescimento pessoal</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={mascot} 
                  alt="PeppaCash" 
                  className="w-full max-w-md mx-auto rounded-2xl"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Olá! Meu nome é PeppaCash e eu sou o mascote da EduCa$h.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Estou aqui para te acompanhar em cada passo dessa jornada de transformação financeira. 
                  Com um jeito leve e divertido, vou te mostrar que cuidar do dinheiro não precisa ser chato!
                </p>
                <p className="text-lg text-muted-foreground">
                  Juntos, vamos aprender a organizar suas finanças, criar metas realistas e conquistar 
                  aquela tão sonhada independência financeira. Vamos nessa?
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Nossa Equipe
              </h3>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={teamPhoto} 
                  alt="Equipe EduCA$H" 
                  className="w-full"
                />
              </div>
              <p className="text-center text-muted-foreground mt-6 text-lg">
                Somos jovens que acreditam no poder transformador da educação financeira. 
                De jovens, para jovens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-educash-green-dark to-educash-green-base">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Pronto para transformar sua vida financeira?
            </h2>
            <p className="text-xl text-white/90">
              Comece agora mesmo sua jornada rumo à independência financeira!
            </p>
            <Link to="/app">
              <Button 
                size="lg" 
                className="bg-white text-educash-green-dark hover:bg-white/90 text-lg px-12 py-6"
              >
                Começar Agora - É Grátis!
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={educashLogo} alt="EduCA$H" className="h-10 w-10" />
              <div>
                <p className="font-bold">EduCA$H</p>
                <p className="text-xs text-muted-foreground">Mente Rica, Futuro Brilhante</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 EduCA$H. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
