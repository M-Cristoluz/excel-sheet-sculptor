# EduCA$H
## Sistema de Educação Financeira Gamificada

---

# EQUIPE PROJETO

| Nome | Função | Contato |
|------|--------|---------|
| Equipe EduCA$H | Desenvolvimento | educash.pe@gmail.com |
| Equipe EduCA$H | Design & UX | educash.pe@gmail.com |
| Equipe EduCA$H | Product Owner | educash.pe@gmail.com |

**Instagram Oficial:** [@educash.oficial](https://www.instagram.com/educash.oficial?igsh=bnF3cHZlMW9oM3ph)

---

# STAKEHOLDERS

| Nome | Papel | Contato | Responsabilidade |
|------|-------|---------|------------------|
| Usuários Finais | Público-Alvo | Via Instagram/Email | Utilizar o sistema para gestão financeira pessoal |
| Equipe EduCA$H | Desenvolvedores | educash.pe@gmail.com | Desenvolvimento, manutenção e suporte técnico |
| Comunidade | Beta Testers | Instagram DM | Feedback e identificação de bugs |

---

# DICIONÁRIO

**EduCA$H**: Nome do sistema, onde "CA$H" representa dinheiro (cash) com cifrão estilizado.

**EduCoins**: Moeda virtual do sistema de gamificação, conquistada através de desafios e metas alcançadas.

**50/30/20**: Regra de budgeting onde 50% dos gastos são Essenciais, 30% são Desejos e 20% são Poupança.

**Essencial**: Categoria de gastos com necessidades básicas (alimentação, moradia, transporte).

**Desejo**: Categoria de gastos com itens não essenciais (lazer, entretenimento).

**Poupança**: Categoria de valores destinados a economias e investimentos.

**RLS (Row Level Security)**: Sistema de segurança de dados em nível de linha do banco de dados.

**PWA (Progressive Web App)**: Aplicação web que funciona offline e pode ser instalada como app nativo.

**Lovable Cloud**: Plataforma backend que utiliza Supabase para gerenciamento de dados.

**Onboarding**: Processo de introdução e tutorial para novos usuários.

**Renda Extra**: Campo incremental para adicionar valores imprevistos além do salário base.

---

# OBJETIVO

O EduCA$H tem como objetivo principal **educar e capacitar usuários na gestão de suas finanças pessoais** através de uma abordagem gamificada e interativa.

## Objetivos Específicos:

1. **Educação Financeira**: Fornecer conhecimento sobre gestão de finanças baseada na regra 50/30/20
2. **Visualização Clara**: Apresentar dados financeiros de forma intuitiva através de gráficos e dashboards
3. **Engajamento**: Manter usuários motivados através de gamificação com desafios, conquistas e EduCoins
4. **Acessibilidade**: Ser totalmente responsivo e funcionar em dispositivos móveis e desktop
5. **Privacidade**: Permitir ocultação de valores para proteção de informações pessoais
6. **Autonomia**: Capacitar usuários a tomarem decisões financeiras informadas
7. **Predição**: Auxiliar no planejamento futuro através de análises preditivas de gastos
8. **Organização**: Facilitar o controle de receitas, despesas e metas financeiras

---

# ESCOPO

## O que é o sistema:

EduCA$H é uma **plataforma web de educação financeira pessoal** que combina gestão de finanças com elementos de gamificação. O sistema permite que usuários:

- **Importem e exportem** planilhas Excel no formato padrão (aba "LANÇAMENTOS")
- **Visualizem** suas finanças através de dashboards interativos e responsivos
- **Categorizem** automaticamente transações usando IA (regra 50/30/20)
- **Analisem** gastos por períodos (semana, mês, ano)
- **Criem metas** financeiras personalizadas
- **Recebam insights** inteligentes sobre seus hábitos financeiros
- **Participem de desafios** semanais para ganhar EduCoins
- **Compartilhem conquistas** em redes sociais (WhatsApp, Instagram)

## Descrição do Problema:

**Problema**: Muitas pessoas, especialmente jovens e adultos iniciantes, têm dificuldade em gerenciar suas finanças pessoais de forma eficaz. Aplicativos existentes são complexos, intimidadores ou entediantes, resultando em baixo engajamento e abandono.

**Afetados**: Usuários que buscam controlar suas finanças mas se sentem desmotivados por interfaces complexas, falta de feedback positivo e ausência de educação financeira básica.

**Impacto**: Decisões financeiras ruins, acúmulo de dívidas, dificuldade em poupar, estresse relacionado a dinheiro e falta de planejamento para metas futuras.

## Descrição da Solução:

**Solução**: EduCA$H transforma gestão financeira em uma experiência educativa e divertida através de:

1. **Interface Amigável**: Design dinâmico com mascote (porquinho) e cores vibrantes
2. **Gamificação**: Sistema de EduCoins, conquistas, desafios semanais e micro-achievements
3. **Educação Integrada**: Dicas financeiras contextuais e regra 50/30/20
4. **IA Integrada**: Categorização automática, insights personalizados e predição de gastos
5. **Flexibilidade**: Importação/exportação Excel, múltiplas visualizações temporais
6. **Social**: Compartilhamento de conquistas para motivação externa
7. **Privacidade**: Toggle para ocultar valores quando necessário

---

# ESCOPO ORIGINAL

## Fase 1 - Impacto Imediato (Implementado):
- ✅ Sistema de Metas Financeiras
- ✅ Melhorias Visuais (design responsivo, paleta de cores oficial)
- ✅ Onboarding Interativo (tutorial de 4 passos)
- ✅ Comparações Mensais (receitas, despesas, saldo com insights)

## Fase 2 - Inteligência (Implementado):
- ✅ Insights com IA (análise de padrões usando Lovable AI)
- ✅ Predições de Gastos (previsão para próximo mês por categoria)
- ✅ Alertas Personalizados (baseados em comportamento financeiro)
- ✅ Desafios Gamificados (desafios semanais com recompensas em EduCoins)

## Fase 3 - Performance & Social (Implementado):
- ✅ PWA (instalação offline, funcionamento como app nativo)
- ✅ Compartilhamento Social (conquistas no WhatsApp/Instagram)
- ✅ Otimizações (performance, cache, lazy loading)
- ✅ Analytics (sistema interno de rastreamento de uso)

---

# NÃO CONTEMPLADO

O sistema **NÃO** inclui:

1. **Integração Bancária Direta**: Não conecta automaticamente com contas bancárias
2. **Investimentos Avançados**: Não gerencia ações, fundos ou criptomoedas
3. **Pagamentos**: Não processa transações financeiras reais
4. **Múltiplos Usuários por Conta**: Cada conta é individual (não familiar)
5. **Consultoria Financeira**: Não substitui aconselhamento profissional
6. **Relatórios Fiscais**: Não gera documentos para declaração de impostos
7. **Crédito/Empréstimos**: Não oferece serviços de crédito
8. **Suporte Multi-idioma**: Atualmente apenas em Português (Brasil)
9. **Sincronização entre Dispositivos**: Dados locais por sessão (requer login)
10. **Notificações Push Nativas**: Alertas apenas dentro do app

---

# ENTREGÁVEIS

## Documentação:
- ✅ Documento de Visão
- ✅ README.md com instruções de instalação
- ✅ Documentação de API (Edge Functions)
- ✅ Guia de Estilo (paleta de cores, fontes: Poppins, Quicksand)

## Sistema:
- ✅ Aplicação Web Responsiva (PWA)
- ✅ Landing Page (rota `/`)
- ✅ Aplicação Principal (rota `/app`)
- ✅ Sistema de Autenticação (Lovable Cloud/Supabase)
- ✅ Banco de Dados (2 tabelas: financial_goals, user_onboarding)
- ✅ Edge Functions (3: categorize-transaction, generate-insights, predict-expenses)

## Funcionalidades:
- ✅ Importação/Exportação Excel (formato padrão)
- ✅ Dashboard Financeiro (gráficos pizza, barras, linha)
- ✅ Sistema de Metas com progresso visual
- ✅ Gamificação (EduCoins, conquistas, desafios)
- ✅ Análise por Período (semana, mês, ano)
- ✅ Modo Claro/Escuro
- ✅ Mascote e Celebrações
- ✅ Compartilhamento Social

---

# PREMISSAS

1. **Conectividade**: Usuários possuem acesso à internet (necessário para IA e sincronização)
2. **Dispositivos**: Compatível com navegadores modernos (Chrome, Firefox, Safari, Edge)
3. **Dados de Entrada**: Usuários podem fornecer dados manualmente ou via planilha Excel
4. **Formato Excel**: Planilhas seguem o formato especificado (aba "LANÇAMENTOS", cabeçalhos linha 13)
5. **Suporte**: Usuários podem relatar bugs via email (educash.pe@gmail.com)
6. **Lovable Cloud**: Backend gerenciado pela plataforma Lovable (Supabase)
7. **Capacidade de IA**: Lovable AI possui créditos suficientes para operação
8. **Responsividade**: Visualização adequada em telas de 320px a 1920px+
9. **PWA**: Navegadores suportam Service Workers para funcionamento offline
10. **Dados Locais**: Informações financeiras não são compartilhadas externamente

---

# RESTRIÇÕES

## Técnicas:
1. **Plataforma**: Apenas Web (React/Vite), não é app nativo iOS/Android
2. **Backend**: Limitado às funcionalidades do Lovable Cloud/Supabase
3. **IA**: Dependente dos modelos disponíveis no Lovable AI
4. **Excel**: Limitado ao formato específico de importação/exportação
5. **Offline**: PWA funciona offline mas sincronização requer internet

## Segurança:
1. **RLS Policies**: Dados protegidos por Row Level Security
2. **Autenticação**: Obrigatória para acesso aos dados pessoais
3. **Sem Pagamentos**: Sistema não processa transações financeiras reais

## Design:
1. **Paleta de Cores**: Restrita às cores oficiais da marca EduCA$H
2. **Fontes**: Limitadas a Poppins e Quicksand
3. **Mascote**: Apenas a imagem oficial do porquinho (sem animações de pulo)

## Operacionais:
1. **Suporte**: Via email e Instagram, sem chat ao vivo 24/7
2. **Idioma**: Apenas Português (Brasil)
3. **Escalabilidade**: Limitada ao plano do Lovable Cloud contratado

---

# CRONOGRAMA

## Fase 1 - Impacto Imediato: ✅ Concluída
**Duração**: Sprint 1-2
- Sistema de Metas Financeiras
- Melhorias Visuais e Responsividade
- Onboarding Interativo
- Comparações Mensais

## Fase 2 - Inteligência: ✅ Concluída
**Duração**: Sprint 3-4
- Integração com Lovable AI
- Predições de Gastos
- Alertas Personalizados
- Desafios Gamificados com EduCoins

## Fase 3 - Performance & Social: ✅ Concluída
**Duração**: Sprint 5-6
- Implementação PWA
- Compartilhamento Social
- Otimizações de Performance
- Sistema de Analytics

## Fase Atual - QA & Estabilização: 🔄 Em Andamento
**Duração**: Contínua
- Correção de bugs reportados
- Testes de responsividade (mobile/desktop)
- Validação de funcionalidades
- Melhorias de UX baseadas em feedback

---

# PROTÓTIPO

## Estrutura de Navegação:

```
Landing Page (/)
│
├── Seção Hero (com mascote)
├── Recursos e Funcionalidades
├── Demonstração Visual
├── Call-to-Action
└── Rodapé com Suporte e Instagram

Aplicação (/app)
│
├── Header
│   ├── Logo EduCA$H
│   ├── Botão Voltar (circular, gradiente verde)
│   └── Toggle Modo Escuro
│
├── Dashboard Principal
│   ├── Upload/Download Excel
│   ├── Configuração de Salário
│   ├── Toggle Ocultar Valores
│   └── Filtro de Período (Semana/Mês/Ano)
│
└── Abas de Conteúdo
    ├── Análise Educativa
    │   ├── Gráfico de Pizza (50/30/20)
    │   ├── Status Financeiro
    │   ├── Dicas Educacionais
    │   └── Insights de IA
    │
    ├── Metas & Gamificação
    │   ├── Metas Financeiras
    │   ├── EduCoins e Conquistas
    │   ├── Desafios Semanais
    │   └── Compartilhamento Social
    │
    └── Dados & Predições
        ├── Tabela de Transações
        ├── Comparações Mensais
        ├── Predições de Gastos
        ├── Gráficos Temporais
        └── FloatingActionButton (adicionar transação rápida)
```

## Fluxo de Uso Principal:

1. Usuário acessa Landing Page → CTA "Começar"
2. Onboarding Interativo (4 passos)
3. Upload de Planilha Excel OU entrada manual de dados
4. Sistema categoriza automaticamente com IA
5. Visualização em dashboards interativos
6. Criação de metas financeiras
7. Participação em desafios semanais
8. Recebimento de insights e predições
9. Compartilhamento de conquistas
10. Exportação de dados atualizados

---

# FERRAMENTAS

## Frontend:
- **React** (v18.3.1) - Framework principal
- **Vite** - Build tool e dev server
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework de estilo
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## Backend:
- **Lovable Cloud** - Plataforma backend completa
- **Supabase** - Banco de dados PostgreSQL
- **Edge Functions** - Serverless functions (Deno)
- **Row Level Security (RLS)** - Segurança de dados

## IA & Machine Learning:
- **Lovable AI** - Modelos de IA integrados
  - google/gemini-2.5-flash (categorização)
  - openai/gpt-5-mini (insights e predições)

## Bibliotecas Específicas:
- **@tanstack/react-query** - Cache e estado de servidor
- **react-router-dom** - Roteamento
- **date-fns** - Manipulação de datas
- **xlsx** - Processamento de arquivos Excel
- **canvas-confetti** - Celebrações visuais
- **sonner** - Sistema de toast/notificações
- **vite-plugin-pwa** - Progressive Web App

## Infraestrutura:
- **GitHub** - Controle de versão
- **Lovable Deploy** - Hospedagem e deploy
- **Service Workers** - Funcionalidade offline (PWA)

## Design:
- **Fonts**: Poppins, Quicksand
- **Colors**: Paleta oficial EduCA$H (verde primário em HSL)
- **Assets**: Mascote (porquinho), logo com cifrão

---

# REFERÊNCIAS

## Documentação Oficial:
- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Contatos do Projeto:
- **Email**: educash.pe@gmail.com
- **Instagram**: [@educash.oficial](https://www.instagram.com/educash.oficial?igsh=bnF3cHZlMW9oM3ph)
- **Projeto Lovable**: https://lovable.dev/projects/a12e690a-33bf-4d95-85da-baec956f6c6f

## Educação Financeira:
- Regra 50/30/20 de Elizabeth Warren
- Princípios de Gamificação em Educação

---

**Versão**: 1.0  
**Data**: Novembro 2025  
**Status**: Sistema em produção com QA contínuo  

---

*Este documento representa a visão completa do sistema EduCA$H e deve ser atualizado conforme o projeto evolui.*
