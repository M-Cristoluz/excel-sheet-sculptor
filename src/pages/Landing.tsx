import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Rocket, 
  FileText, 
  Star, 
  TrendingUp, 
  Shield, 
  Award,
  Lightbulb,
  Heart,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Instagram
} from "lucide-react";
import educashLogo from "@/assets/educash-logo.png";
import mascot from "@/assets/mascot.jpeg";
import heroBanner from "@/assets/hero-banner.jpeg";
import teamPhoto from "@/assets/team-photo.jpeg";
import ProcessedMascot from "@/components/ProcessedMascot";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-educash-green-base/10 overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 group">
            <img 
              src={educashLogo} 
              alt="EduCA$H" 
              className="h-10 w-10 sm:h-12 sm:w-12 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" 
            />
            <div>
              <h2 className="text-base sm:text-xl font-display font-bold text-foreground">EduCA$H</h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Mente Rica, Futuro Brilhante</p>
            </div>
          </div>
          <Link to="/app">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-educash-green-base to-educash-green-dark hover:scale-105 hover:shadow-xl text-white font-display font-bold transition-all duration-300 text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3"
            >
              <Sparkles className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Acessar Plataforma</span>
              <span className="sm:hidden">Entrar</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-educash-green-base/5 via-educash-gold/5 to-transparent animate-pulse" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-educash-gold/20 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-educash-green-base/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-educash-gold/20 to-educash-green-base/20 rounded-full border border-educash-gold/30 mb-2 sm:mb-4">
              <p className="text-xs sm:text-sm font-display font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-educash-gold animate-pulse" />
                Transforme sua vida financeira hoje!
              </p>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-tight bg-clip-text text-transparent bg-gradient-to-r from-educash-green-dark via-educash-green-base to-educash-gold animate-slideInUp px-4">
              Cansado de sentir que o dinheiro te controla?
            </h1>
            
            <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed animate-slideInUp px-4">
              Seja sincero: você sente que está sempre correndo atrás do dinheiro, mas nunca chega lá? 
              <span className="block mt-2 text-foreground font-semibold">
                A gente entende. O EduCa$h foi feito para transformar a sua relação com as finanças.
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6 sm:pt-8 animate-scaleIn px-4">
              <Link to="/app" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-educash-green-base to-educash-green-dark hover:scale-110 hover:shadow-2xl text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl font-display font-bold transition-all duration-500 group"
                >
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="hidden sm:inline">Comece sua jornada de liberdade</span>
                  <span className="sm:hidden">Começar Agora</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl backdrop-blur-sm border border-border/50">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                <span>Em menos de 5 minutos você começa!</span>
              </div>
            </div>
            
            <div className="mt-10 sm:mt-16 flex justify-center">
              <div className="relative">
                <ProcessedMascot className="h-40 sm:h-56 lg:h-72 drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
                <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-educash-gold to-educash-green-base text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-display font-bold shadow-xl text-xs sm:text-base whitespace-nowrap">
                  PeppaCash está aqui! 🎉
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Dor e a Cura */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-12 animate-fadeIn">
            <div className="space-y-3 sm:space-y-4 px-4">
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-display font-extrabold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-destructive via-destructive/80 to-destructive/60">
                O buraco no bolso, a ansiedade no peito.
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground">Esses problemas te parecem familiares?</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                "Não sabe pra onde o dinheiro vai?",
                "O salário acaba antes do mês?",
                "Medo de investir porque 'não é pra você'?"
              ].map((problem, index) => (
                <Card 
                  key={index}
                  className="border-2 border-destructive/30 hover:border-destructive hover:scale-105 transition-all duration-300 bg-gradient-to-br from-background to-destructive/5 hover:shadow-2xl hover:shadow-destructive/20"
                >
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-2xl">😰</span>
                    </div>
                    <CardTitle className="text-destructive font-display text-xl">{problem}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="pt-8 sm:pt-12 space-y-4 sm:space-y-6 px-4">
              <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-educash-green-base to-educash-green-dark rounded-2xl shadow-xl">
                <p className="text-xl sm:text-2xl lg:text-3xl text-white font-display font-bold">
                  ✨ Pare de se preocupar!
                </p>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-foreground font-display font-semibold">
                A EduCa$h é o mapa que te tira do labirinto financeiro.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-educash-gold animate-pulse" />
                <span>E a melhor parte? É tudo feito por quem já passou por isso: de jovens para jovens.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jornada Gameficada */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-educash-gold/10 via-transparent to-educash-green-base/10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4 animate-fadeIn px-4">
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-educash-green-base to-educash-gold">
                Sua jornada rumo à mente rica. 🚀
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground font-light">
                Acompanhe sua evolução através das 5 fases com o PeppaCash
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  icon: Rocket,
                  title: "Fase 1: Partiu Grana!",
                  description: "Com o PeppaCash, você aprende a fazer as pazes com o seu dinheiro.",
                  color: "from-educash-green-dark to-educash-green-base",
                  emoji: "🚀"
                },
                {
                  icon: FileText,
                  title: "Fase 2: Missão Organização",
                  description: "Aprenda a controlar seus gastos e organize sua vida financeira como um mestre.",
                  color: "from-educash-green-base to-success",
                  emoji: "📊"
                },
                {
                  icon: Star,
                  title: "Fase 3: Poupe & Brilhe",
                  description: "Crie metas e veja sua reserva de emergência crescer, sem dor de cabeça.",
                  color: "from-educash-gold to-warning",
                  emoji: "⭐"
                },
                {
                  icon: TrendingUp,
                  title: "Fase 4: Investir é Real",
                  description: "Descubra que investir não é um bicho de sete cabeças e comece a ver seu dinheiro multiplicar.",
                  color: "from-warning to-success",
                  emoji: "📈"
                },
                {
                  icon: Shield,
                  title: "Fase 5: Liberdade em Vista",
                  description: "O topo da jornada: independência financeira e a chance de viver o futuro que você sempre sonhou.",
                  color: "from-success to-educash-green-dark",
                  emoji: "🎯"
                }
              ].map((phase, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 hover:border-educash-gold group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-8">
                    <div className={`relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${phase.color} shadow-lg group-hover:scale-110 transition-transform duration-300 self-start`}>
                      <phase.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      <div className="absolute -top-2 -right-2 text-2xl sm:text-3xl animate-bounce">
                        {phase.emoji}
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-display mb-2 sm:mb-3">{phase.title}</CardTitle>
                      <CardDescription className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                        {phase.description}
                      </CardDescription>
                    </div>
                    <div className="hidden lg:block text-6xl font-display font-extrabold text-muted-foreground/10 group-hover:text-educash-gold/30 transition-colors duration-300">
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
      <section className="py-12 sm:py-20 bg-gradient-to-br from-muted/50 to-educash-green-base/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4 animate-fadeIn px-4">
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-educash-green-dark to-educash-gold">
                Isso não é só mais um curso. É um estilo de vida. ✨
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
              {[
                {
                  icon: Award,
                  title: "A Força dos EduCoins",
                  description: "A cada missão concluída, você ganha EduCoins, nossa moeda virtual. Troque por e-books, mentorias e prêmios que te ajudam a ir ainda mais longe.",
                  color: "from-educash-gold to-warning",
                  emoji: "🏆"
                },
                {
                  icon: Heart,
                  title: "O Seu Guia, PeppaCash",
                  description: "Conheça o nosso mascote! Ele está ao seu lado em cada etapa, com dicas, desafios e um bom-humor que transforma o aprendizado em algo leve e divertido.",
                  color: "from-educash-green-base to-success",
                  emoji: "💖"
                },
                {
                  icon: Target,
                  title: "Conectando o Sonho à Realidade",
                  description: "Não queremos apenas que você aprenda, queremos que você vença. As recompensas do Pódio Mensal são reais: mentorias e brindes exclusivos.",
                  color: "from-success to-educash-green-dark",
                  emoji: "🎯"
                }
              ].map((feature, index) => (
                <Card 
                  key={index}
                  className="text-center hover:shadow-2xl transition-all duration-500 hover:scale-110 border-2 hover:border-educash-gold group bg-gradient-to-br from-background to-muted/30"
                >
                  <CardHeader className="p-8">
                    <div className="relative mx-auto w-fit mb-6">
                      <div className={`p-6 rounded-3xl bg-gradient-to-br ${feature.color} shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                        <feature.icon className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 text-4xl animate-bounce">
                        {feature.emoji}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-display mb-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-educash-green-base/10 via-transparent to-educash-gold/10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4 animate-fadeIn px-4">
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-educash-gold to-educash-green-base">
                O que nos move. 💚
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
              {[
                {
                  icon: Target,
                  title: "Missão",
                  description: "Educar e empoderar jovens para que conquistem uma vida financeira equilibrada, autônoma e de qualidade, utilizando a educação financeira como ferramenta de transformação pessoal e social.",
                  color: "from-educash-green-dark to-educash-green-base"
                },
                {
                  icon: Lightbulb,
                  title: "Visão",
                  description: "Ser referência nacional em educação financeira para juventudes até 2030, impactando milhares de vidas e ampliando oportunidades por meio de um modelo acessível, moderno e eficaz de ensino.",
                  color: "from-educash-gold to-warning"
                },
                {
                  icon: Heart,
                  title: "Valores",
                  description: null,
                  color: "from-success to-educash-green-dark",
                  values: [
                    "Ética e Transparência",
                    "Empoderamento juvenil",
                    "Educação acessível",
                    "Autonomia",
                    "Leveza educativa",
                    "Crescimento pessoal"
                  ]
                }
              ].map((item, index) => (
                <Card 
                  key={index}
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 hover:border-educash-gold group bg-gradient-to-br from-background to-muted/30"
                >
                  <CardHeader className="p-8">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} w-fit mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-display mb-4">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    {item.description ? (
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    ) : (
                      <ul className="space-y-3">
                        {item.values?.map((value, idx) => (
                          <li key={idx} className="flex items-center gap-3 group/item">
                            <CheckCircle2 className="w-5 h-5 text-educash-green-base flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300" />
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">{value}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-muted/30 to-educash-gold/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12 sm:space-y-20">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <ProcessedMascot className="w-full max-w-xs sm:max-w-md mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-educash-green-base to-educash-gold">
                  Olá! Meu nome é PeppaCash! 👋
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Eu sou o mascote da EduCa$h e estou super animado para te acompanhar em cada passo dessa jornada de transformação financeira! 
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Com um jeito leve e divertido, vou te mostrar que cuidar do dinheiro não precisa ser chato! 
                  Na verdade, pode ser bem divertido! 🎉
                </p>
                <p className="text-base sm:text-lg text-foreground font-semibold">
                  Juntos, vamos aprender a organizar suas finanças, criar metas realistas e conquistar 
                  aquela tão sonhada independência financeira. Bora nessa? 🚀
                </p>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-10">
              <div className="text-center space-y-3 sm:space-y-4 px-4">
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-educash-gold to-educash-green-base">
                  Nossa Equipe 🌟
                </h3>
                <p className="text-base sm:text-xl text-muted-foreground">
                  De jovens, para jovens. Com muito amor e dedicação! 💚
                </p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border-2 sm:border-4 border-educash-gold/30">
                <img 
                  src={teamPhoto} 
                  alt="Equipe EduCA$H" 
                  className="w-full"
                />
              </div>
              <p className="text-center text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Somos jovens que acreditam no poder transformador da educação financeira. 
                Cada um de nós já passou por desafios financeiros e sabemos como é importante ter 
                conhecimento e apoio nessa jornada. Por isso, criamos o EduCA$H! ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-educash-green-dark via-educash-green-base to-educash-gold" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-10 animate-fadeIn">
            <div className="space-y-4 sm:space-y-6 px-4">
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white drop-shadow-2xl">
                Pronto para transformar sua vida financeira? 🚀
              </h2>
              <p className="text-lg sm:text-2xl lg:text-3xl text-white/95 font-light">
                Comece agora mesmo sua jornada rumo à independência financeira!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6 sm:pt-8 px-4">
              <Link to="/app" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-educash-green-dark hover:scale-110 hover:shadow-2xl text-base sm:text-xl px-10 sm:px-16 py-6 sm:py-8 rounded-2xl font-display font-bold transition-all duration-500 group"
                >
                  <Sparkles className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Começar Agora - É Grátis!
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-6 sm:pt-8 px-4">
              {[
                { text: "100% Gratuito", icon: "💰" },
                { text: "Sem Cadastro Complicado", icon: "⚡" },
                { text: "Resultados Imediatos", icon: "🎯" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/30"
                >
                  <span className="text-2xl sm:text-3xl">{item.icon}</span>
                  <span className="text-white font-display font-semibold text-sm sm:text-base">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suporte Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-muted/30 to-educash-green-base/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-educash-green-base/30 hover:border-educash-green-base hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-educash-green-base/5">
              <CardContent className="p-8 sm:p-12 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-educash-green-base/40 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative p-6 rounded-full bg-gradient-to-r from-educash-green-base to-educash-green-dark shadow-2xl">
                      <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-educash-green-base to-educash-green-dark">
                    Suporte 🛠️
                  </h3>
                  <p className="text-xl sm:text-2xl text-foreground font-display font-semibold">
                    Viu algum bug? Nos ajude a melhorar!
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Sua opinião é fundamental para aprimorarmos a plataforma. Cada feedback, sugestão ou relato de problema 
                    nos ajuda a criar uma experiência melhor para toda a comunidade EduCA$H. Juntos, construímos uma 
                    ferramenta cada vez mais incrível! 💚
                  </p>
                </div>
                
                <a
                  href="mailto:educash.pe@gmail.com"
                  className="inline-block"
                >
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-educash-green-base to-educash-green-dark hover:scale-110 hover:shadow-2xl text-white text-base sm:text-xl px-8 sm:px-12 py-6 sm:py-7 rounded-2xl font-display font-bold transition-all duration-500 group"
                  >
                    <Shield className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-500" />
                    Fale Conosco
                    <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </a>

                <div className="pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    📧 E-mail: <a href="mailto:educash.pe@gmail.com" className="text-educash-green-base hover:text-educash-green-dark font-semibold transition-colors">educash.pe@gmail.com</a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Respondemos em até 48 horas úteis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-muted/50 via-background to-educash-green-base/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-educash-gold/30 hover:border-educash-gold hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-educash-green-base/5">
              <CardContent className="p-8 sm:p-12 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative p-6 rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] shadow-2xl">
                      <Instagram className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
                    Siga-nos no Instagram! 📱
                  </h3>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Acompanhe atualizações, novidades da plataforma, dicas financeiras e muito mais sobre o EduCA$H!
                  </p>
                </div>
                
                <a
                  href="https://www.instagram.com/educash.oficial?igsh=bnF3cHZlMW9oM3ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:scale-110 hover:shadow-2xl text-white text-base sm:text-xl px-8 sm:px-12 py-6 sm:py-7 rounded-2xl font-display font-bold transition-all duration-500 group"
                  >
                    <Instagram className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-500" />
                    @educash.oficial
                    <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </a>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-4">
                  {[
                    { text: "Dicas Diárias", icon: "💡" },
                    { text: "Novidades", icon: "🎉" },
                    { text: "Comunidade", icon: "👥" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#f09433]/10 to-[#bc1888]/10 px-4 sm:px-6 py-2 rounded-xl border border-[#dc2743]/20"
                    >
                      <span className="text-xl sm:text-2xl">{item.icon}</span>
                      <span className="text-foreground font-display font-semibold text-sm sm:text-base">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-educash-green-dark border-t border-educash-gold/20 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 sm:gap-4 group">
              <img 
                src={educashLogo} 
                alt="EduCA$H" 
                className="h-12 w-12 sm:h-14 sm:w-14 transition-transform duration-500 group-hover:rotate-12" 
              />
              <div>
                <p className="font-display font-bold text-white text-base sm:text-lg">EduCA$H</p>
                <p className="text-xs sm:text-sm text-educash-gold">Mente Rica, Futuro Brilhante ✨</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-white/90 font-semibold text-sm sm:text-base mb-1">Suporte</p>
                <a 
                  href="mailto:educash.pe@gmail.com" 
                  className="text-educash-gold hover:text-white transition-colors text-xs sm:text-sm"
                >
                  educash.pe@gmail.com
                </a>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-white/80 font-light text-sm sm:text-base">
                  © 2025 EduCA$H. Todos os direitos reservados.
                </p>
                <p className="text-educash-gold/80 text-xs sm:text-sm mt-1">
                  Feito com 💚 por jovens, para jovens
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
