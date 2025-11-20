# 📋 COMPLETE PROMPT - EDUCASH APPLICATION

## 🎯 OVERVIEW
Create a complete PWA web application for gamified financial education called **EduCA$H** with the tagline "Rich Mind, Bright Future". The platform teaches young people to manage their finances through gamification, intelligent AI analysis, and educational challenges.

---

## 🛠️ TECHNOLOGY STACK

- **Frontend**: React 18.3.1 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM v6
- **Backend**: Supabase (Lovable Cloud)
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Query + Local Storage
- **PWA**: vite-plugin-pwa + workbox
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Tailwind Animate + Custom CSS animations
- **Excel**: XLSX library for import/export

---

## 🎨 COLOR SYSTEM (HSL - MANDATORY)

### EduCA$H Brand Colors
```css
--educash-green-dark: 158 100% 20%;    /* #00653A - Dark green */
--educash-green-base: 150 55% 42%;     /* #209058 - Base green */
--educash-green-medium: 155 60% 50%;   /* Medium green */
--educash-yellow: 48 100% 65%;         /* Bright yellow */
--educash-gold: 48 99% 68%;            /* #FEE15F - Gold */
--educash-slogan: 0 0% 90%;            /* #E5E5E5 - Slogan gray */
```

### Light Mode
```css
--background: 0 0% 100%;
--foreground: 155 100% 20%;
--primary: 155 65% 35%;                /* Base green */
--primary-foreground: 0 0% 100%;
--secondary: 155 100% 20%;             /* Dark green */
--accent: 50 98% 68%;                  /* Golden yellow */
--card: 0 0% 100%;
--muted: 155 15% 95%;
--border: 155 20% 85%;
```

### Dark Mode
```css
--background: 222 47% 11%;
--foreground: 210 40% 98%;
--card: 222 47% 14%;
--primary: 155 70% 50%;
--secondary: 155 60% 35%;
--muted: 217 33% 17%;
--border: 217 33% 24%;
```

### Educational Colors
```css
--success: 122 39% 49%;    /* Success - Green */
--warning: 45 100% 51%;    /* Warning - Yellow */
--danger: 4 90% 58%;       /* Danger - Red */
--info: 207 90% 54%;       /* Info - Blue */
```

### Gradients
```css
--gradient-educash: linear-gradient(135deg, hsl(155 100% 20%), hsl(155 65% 45%));
--gradient-gold: linear-gradient(135deg, hsl(50 98% 68%), hsl(48 100% 50%));
--gradient-hero: linear-gradient(135deg, hsl(155 100% 20%) 0%, hsl(155 65% 45%) 100%);
--gradient-primary: linear-gradient(135deg, hsl(155 70% 50%), hsl(155 80% 60%));
```

---

## 📁 ROUTE STRUCTURE

1. **`/`** - Landing Page (presentation page)
2. **`/app`** - Main Dashboard (application)
3. **`/install`** - PWA installation page
4. **`/*`** - 404 Page (NotFound)

---

## 🎨 FONTS

```css
font-family: {
  sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
  display: ['Quicksand', 'Poppins', 'sans-serif'],
  ios: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
}
```

---

## 🏗️ MAIN COMPONENT ARCHITECTURE

### 1. **Landing Page** (`/`)
Fixed header with:
- EduCA$H Logo (PNG without frame)
- Tagline "Rich Mind, Bright Future"
- "Access Platform" button (green gradient)
- "Install App" button

**Sections**:
1. **Hero Section**: 
   - Headline: "Do you struggle to make your money last until the end of the month?"
   - Subheadline addressing audience pain points
   - Main CTA
   - PeppaCash mascot animated (piggy bank with removed background)

2. **Financial Problems**:
   - Cards with audience pain points (money runs out fast, impulse purchases, no control)

3. **EduCA$H Solution**:
   - Gamified journey in 5 phases
   - EduCoins system (virtual currency)
   - PeppaCash mascot as guide
   - Monthly rewards

4. **Platform Features**:
   - Excel spreadsheet upload
   - Automatic analysis
   - Graphical visualizations
   - Goal system
   - Debt management
   - Weekly challenges
   - AI insights

5. **PWA Section**:
   - Installable app benefits
   - Works offline
   - Native experience

6. **Mission, Vision and Values**:
   - Cards with company information

7. **Team**:
   - Team photo
   - PeppaCash mascot introduction

8. **Final CTAs**:
   - Buttons to login/install

9. **Support**:
   - Email: educash.pe@gmail.com
   - Instagram: @educash.oficial
   - Encourage bug reporting

10. **Footer**:
    - All rights reserved
    - Contact links

---

### 2. **Main Dashboard** (`/app`)

#### Header:
- EduCA$H Logo (clickable, no frame)
- Circular button with arrow icon (back to `/`)
- Dark Mode toggle
- Online/Offline indicator
- "New Spreadsheet" button (when data exists)

#### Onboarding System:
Modal with 5 steps explaining:
1. Spreadsheet upload
2. Data visualization
3. Financial goals
4. Gamification system
5. AI analysis

Buttons: "Previous", "Next", "Skip", "Start"

#### No data area (initial):
Informative cards with:
- Upload Icon: "Upload Your Spreadsheet"
- Download Icon: "Download Template" (generates clean Excel template)
- FileSpreadsheet Icon: Expected spreadsheet format

#### Data area:
**Top Components**:
1. **SalaryConfig**: Base salary + incremental extra income configuration
2. **EducationalTips**: Rotating educational tips
3. **MicroAchievements**: Small achievements (first transaction, first goal, etc)
4. **FinancialRuleCard**: Explanation of 50-30-20 rule
5. **GamificationPanel**: EduCoins, level, XP, streak
6. **AIInsights**: AI-generated insights (Gemini/GPT)
7. **ExpensePredictions**: Expense predictions

**Stat Cards** (4 cards):
- Total Income (TrendingUp icon, success color)
- Total Expenses (TrendingDown icon, danger color)
- Current Balance (DollarSign icon, primary color)
- Total Transactions (BarChart3 icon, accent color)

All with toggle to hide/show values (Eye/EyeOff icon)

**Tab System** (3x2 Grid on mobile):
1. **Charts** (BarChart3):
   - Pie chart: Expense Distribution by Category (Essential/Desire/Savings)
   - Bar chart: Monthly Evolution
   - Financial analysis cards (% spent, % saved, category analysis)

2. **Comparison** (TrendingUpIcon):
   - Month-to-month comparison
   - Income/expense evolution
   - Trend analysis

3. **Goals** (Target):
   - Financial goals list
   - Progress bars
   - Add/edit/delete goals
   - Database integration

4. **Debts** (CreditCard):
   - Debts/installments list
   - Payment progress
   - Next due date
   - Installment payment recording
   - Categories (Credit Card, Loan, Financing, etc)
   - Interest calculation

5. **Challenges** (Sparkles):
   - Gamified weekly challenges
   - EduCoins rewards
   - Completion status

6. **Table** (Table):
   - Complete DataTable with all transactions
   - Columns: Date, Month, Year, Type, Description, Value, Category
   - Inline editing
   - Row deletion
   - FloatingActionButton (only in this tab)

**Period Filter**:
- Dropdown with options: All, This Week, This Month, This Year
- Applies filter to all components

**TransactionForm**:
- Form to add transactions manually
- Fields: Date, Type (Income/Expense), Description, Value, Category
- Automatic AI categorization (suggestions)
- Field validation

**MascotCelebration**:
- Appears on special achievements
- Celebration animation
- Confetti effect

---

## 📊 EXCEL SPREADSHEET FORMAT (MANDATORY)

**Sheet**: "LANÇAMENTOS" (ENTRIES)
**Headers on row 13**:

| Data | mês | Ano | Tipo | Descrição | Valor |
|------|-----|-----|------|-----------|-------|

**Data format**:
- **Data** (Date): D/M/YY (ex: 1/1/25)
- **mês** (month): 3-letter uppercase abbreviation (JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC)
- **Ano** (Year): Number (ex: 2025)
- **Tipo** (Type): "Entrada" (Income) or "Saída" (Expense)
- **Descrição** (Description): Free text
- **Valor** (Value): Brazilian format "R$ 1.000,00"

**Generated template must include**:
- Example row with zero values
- Format fully compatible for re-import
- Clean spreadsheet (only headers + example row)

---

## 🗄️ DATABASE (SUPABASE)

### Tables:

#### 1. **transactions**
```sql
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- data: string (transaction date)
- mes: string (3-letter month)
- ano: number
- tipo: string (Income/Expense/Installment Payment)
- descricao: string
- valor: number
- categoria: string (Essential/Desire/Savings)
- created_at: timestamp
- updated_at: timestamp
```

#### 2. **financial_goals**
```sql
- id: uuid (PK)
- user_id: uuid
- title: string
- description: string
- target_amount: number
- current_amount: number
- deadline: date
- category: string
- icon: string
- color: string
- is_completed: boolean
- completed_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

#### 3. **debts**
```sql
- id: uuid (PK)
- user_id: uuid
- title: string
- description: string
- total_amount: number
- installments_total: number
- installments_paid: number
- installment_value: number
- due_day: number
- interest_rate: number
- start_date: date
- category: string (Credit Card, Loan, etc)
- creditor: string
- is_paid_off: boolean
- paid_off_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

#### 4. **user_onboarding**
```sql
- id: uuid (PK)
- user_id: uuid
- has_completed: boolean
- step_completed: number
- completed_at: timestamp
- created_at: timestamp
```

**RLS Policies**: All tables must have RLS enabled with policies that allow users to access only their own data.

---

## 🎮 GAMIFICATION SYSTEM

### EduCoins (Virtual Currency):
- +10 coins: first transaction added
- +50 coins: first goal created
- +100 coins: first goal completed
- +20 coins: spreadsheet upload
- +15 coins: complete weekly challenge
- +5 coins: use app 3 days in a row

### Levels:
- Level 1: 0-100 XP (Beginner)
- Level 2: 101-250 XP (Apprentice)
- Level 3: 251-500 XP (Knowledgeable)
- Level 4: 501-1000 XP (Expert)
- Level 5: 1001+ XP (Master)

### Streak (Consecutive Days):
- Counter of days using the app
- Bonus every 7 days

### Weekly Challenges:
1. "Save $50 this week"
2. "Record all your expenses"
3. "Stay within budget"
4. "Complete a goal"
5. "Reduce desire spending by 20%"

---

## 🤖 AI FEATURES

### Lovable AI (no API key required):
**Supported models**:
- google/gemini-2.5-pro
- google/gemini-2.5-flash
- openai/gpt-5
- openai/gpt-5-mini

**Functionalities**:
1. **AIInsights**: Spending pattern analysis, personalized suggestions
2. **ExpensePredictions**: Future expense prediction based on history
3. **CategoryCacheManager**: Automatic transaction categorization

**Edge Functions**:
- `/categorize-transaction`: Categorizes transaction into Essential/Desire/Savings
- `/generate-insights`: Generates personalized financial insights
- `/predict-expenses`: Makes expense predictions

---

## 🎨 ANIMATIONS AND EFFECTS

### Tailwind Animations:
```css
- fade-in: 0.5s ease-out
- slide-up: 0.5s ease-out
- bounce-in: 0.6s cubic-bezier
- scale-in: 0.3s ease-out
- celebrate: 0.6s ease-in-out
- confetti: 1.5s ease-out
- float: 3s infinite
- glow-pulse: 2s infinite
- shake: 0.5s ease-in-out
- pop-in: 0.4s cubic-bezier
```

### Glassmorphism:
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
```

### iOS-style Shadows:
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
--shadow-educash: 0 10px 30px -10px hsl(155 65% 35% / 0.3);
```

---

## 📱 PWA (Progressive Web App)

### Settings:
- **Icons**: 192x192, 512x512 (normal and maskable)
- **Theme Color**: EduCA$H Green (#209058)
- **Background Color**: White (#FFFFFF)
- **Display**: standalone
- **Orientation**: any
- **Screenshots**: Desktop and Mobile

### Service Worker:
- Static asset caching
- Network First strategy for data
- Background sync for offline operations (future)

### Offline Functionality:
- PWA opens offline
- Cached data
- Synchronization when online (planned)

---

## 🎯 SPECIFIC FEATURES

### 1. **Privacy Toggle**:
Eye/EyeOff button that masks all financial values for privacy

### 2. **Brazilian Formatting**:
- Values: R$ 1.234,56
- Dates: DD/MM/YYYY
- Input with automatic mask

### 3. **Full Responsiveness**:
- Mobile-first
- 3x2 Grid for tabs on mobile
- Adaptive charts
- Stackable cards

### 4. **Dark Mode**:
Persistent toggle in localStorage
All colors adjusted for adequate contrast

### 5. **Educational Analysis**:
Cards explaining:
- % of budget spent
- % saved
- Category analysis (Essential/Desire/Savings)
- Comparison with 50-30-20 rule

### 6. **Data Export**:
Button to export current data to Excel in standard format

---

## 🔐 SECURITY AND VALIDATION

- RLS enabled on all tables
- Input validation with Zod
- Data sanitization
- Auth state management with Supabase
- SQL injection protection

---

## 📞 CONTACTS AND LINKS

- **Email**: educash.pe@gmail.com
- **Instagram**: @educash.oficial (https://www.instagram.com/educash.oficial?igsh=bnF3cHZlMW9oM3ph)
- **Support Message**: "Found a bug? Help us improve!"

---

## 🎭 VISUAL ASSETS

### Required images:
1. `educash-logo.png` - Logo without background
2. `mascot-educash.png` - Piggy bank with removed background (static, no jumping animations)
3. `hero-banner.jpeg` - Hero section banner
4. `team-photo.jpeg` - Team photo
5. `mascot.jpeg` - PeppaCash mascot photo

### PeppaCash Mascot:
- Friendly piggy bank
- User guide
- Appears in celebrations
- Motivational messages

---

## 🚀 USER FLOW

1. User accesses landing page (`/`)
2. Clicks "Access Platform"
3. Sees onboarding (if first time)
4. Uploads Excel spreadsheet OR downloads template
5. System processes and displays data in charts
6. User configures base salary
7. Creates financial goals
8. Records debts/installments
9. Follows weekly challenges
10. Receives AI insights
11. Earns EduCoins and levels up
12. Exports updated data

---

## ⚙️ BUSINESS RULES

### 50-30-20 Rule:
- 50% Essential (housing, food, transportation)
- 30% Desires (leisure, non-essential purchases)
- 20% Savings (investments, emergency fund)

### Calculations:
- **Total Income**: sum of all income + base salary + extra income
- **Total Expenses**: sum of all expenses + installment payments
- **Balance**: Income - Expenses
- **% Spent**: (Expenses / Income) × 100
- **% Saved**: ((Income - Expenses) / Income) × 100

### Automatic Categorization:
Uses AI to suggest category based on transaction description

### Debt Payments:
When paying installment, record as "Installment Payment" (not "expense")

---

## 🎨 VISUAL STYLE

**Characteristics**:
- Dynamic and friendly design
- Fluid letters (Poppins/Quicksand)
- Vibrant but harmonious colors
- Rounded elements (generous border-radius)
- Subtle gradients
- Soft shadows (iOS-style)
- Micro-interactions
- Constant visual feedback

**Avoid**:
- Colors that clash with official palette
- Square/rigid elements
- Abrupt transitions
- Static/boring layouts

---

## 📱 RESPONSIVENESS

### Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Adjustments:
- 3x2 Grid for tabs
- Stackable cards
- Reduced fonts
- Charts with 300px height
- Buttons with smaller padding
- Simplified navigation

---

## 🔄 SYNCHRONIZATION AND STATE

### Local Storage:
- `educash-dark-mode`: boolean
- `educash-salary`: number
- `educash-consecutive-days`: number
- `educash-onboarding-completed`: boolean
- `educash-goals`: JSON array
- `educash-show-values`: boolean

### Supabase:
- Persistent data in cloud
- Automatic synchronization
- Queries with React Query

---

## 📐 COMPONENT STRUCTURE DETAILS

### IOSCard Component:
```typescript
interface IOSCardProps {
  variant?: "default" | "glass" | "elevated";
  hoverable?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}
```

Variants:
- **default**: Standard card with border and shadow
- **glass**: Glassmorphism effect with backdrop blur
- **elevated**: Enhanced shadow without border

### IOSButton Component:
iOS-style button with smooth transitions, rounded corners, and haptic-feel interactions.

### StatCard Component:
Displays financial statistics with:
- Icon (Lucide React)
- Title
- Value (with mask toggle)
- Color variant (success/danger/primary/accent)
- Animated number changes

### FloatingActionButton:
Fixed position button (bottom-right) that:
- Only appears on Table tab
- Opens TransactionForm
- Smooth scale animation on hover
- Accessible with keyboard

---

## 🎨 DESIGN TOKENS

### Border Radius:
```css
--radius: 0.75rem;          /* 12px - Standard */
--radius-lg: 1rem;          /* 16px - Large */
--radius-xl: 1.25rem;       /* 20px - Extra Large */
--radius-2xl: 1.5rem;       /* 24px - 2X Large */
```

### Transitions:
```css
--transition-smooth: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
--transition-spring: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Effects:
```css
--glow-success: 0 0 20px hsl(var(--success) / 0.4);
--glow-educash: 0 0 30px hsl(var(--educash-green-base) / 0.5);
--confetti-duration: 1.5s;
```

---

## 🧩 KEY LIBRARIES AND DEPENDENCIES

### Core:
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^6.30.1
- `@tanstack/react-query`: ^5.83.0

### UI:
- `@radix-ui/*`: Various v1.x (for shadcn components)
- `lucide-react`: ^0.462.0
- `tailwindcss`: Latest
- `tailwind-merge`: ^2.6.0
- `class-variance-authority`: ^0.7.1

### Forms & Validation:
- `react-hook-form`: ^7.61.1
- `@hookform/resolvers`: ^3.10.0
- `zod`: ^3.25.76

### Charts:
- `recharts`: ^3.2.1

### Backend:
- `@supabase/supabase-js`: ^2.58.0

### Utilities:
- `date-fns`: ^3.6.0
- `xlsx`: ^0.18.5
- `canvas-confetti`: ^1.9.4

### PWA:
- `vite-plugin-pwa`: ^1.1.0
- `workbox-window`: ^7.3.0

---

## 🎯 ACCESSIBILITY (A11Y)

### Requirements:
- All interactive elements keyboard accessible
- Proper ARIA labels on icons and buttons
- Focus indicators visible
- Color contrast ratios meet WCAG AA standards
- Screen reader friendly
- Alt text on all images
- Semantic HTML structure

### Implementation:
```typescript
// Example button with accessibility
<button
  aria-label="Add new transaction"
  aria-describedby="transaction-help"
  className="..."
>
  <Plus className="w-5 h-5" aria-hidden="true" />
  <span className="sr-only">Add Transaction</span>
</button>
```

---

## 🔔 NOTIFICATION SYSTEM (Future Enhancement)

### Planned notifications:
1. **Debt Reminders**: 3 days before due date
2. **Budget Alerts**: When exceeding category limits
3. **Goal Progress**: Milestones reached (25%, 50%, 75%)
4. **Weekly Challenges**: New challenge available
5. **Achievement Unlocked**: New level or coins earned
6. **Streak Reminder**: Daily login reminder

---

## 📊 ANALYTICS & TRACKING

### Events to Track:
- Page views
- File uploads
- Transaction additions
- Goal creations/completions
- Challenge completions
- Level ups
- Feature usage patterns
- Error occurrences

### Implementation:
```typescript
// Custom hook: useAnalytics
const { trackEvent, trackPageView } = useAnalytics();

trackEvent('goal_created', {
  category: goalCategory,
  amount: targetAmount
});
```

---

## 🌐 INTERNATIONALIZATION (Future)

### Supported Languages (Planned):
- Portuguese (BR) - Default
- English (US)
- Spanish (ES)

### Implementation Strategy:
- Use `react-i18next` or similar
- Separate translation files per language
- Dynamic locale switching
- Number/currency format per locale
- Date format per locale

---

## 🧪 TESTING GUIDELINES

### Unit Tests:
- Utility functions (calculations, formatting)
- Custom hooks
- Pure components

### Integration Tests:
- User flows (upload → view → export)
- Form submissions
- API interactions

### E2E Tests:
- Critical paths
- Authentication flows
- Data persistence

### Testing Tools:
- Vitest (unit/integration)
- React Testing Library
- Playwright or Cypress (E2E)

---

## 🚀 DEPLOYMENT

### Build Configuration:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Environment Variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Optimization:
- Code splitting by route
- Lazy loading for heavy components
- Image optimization
- Tree shaking
- Minification
- Compression (gzip/brotli)

---

## 📈 PERFORMANCE TARGETS

### Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size:
- Initial JS bundle: < 200KB (gzipped)
- CSS bundle: < 50KB (gzipped)
- Total page weight: < 500KB

### Loading Strategy:
- Critical CSS inlined
- Fonts preloaded
- Images lazy loaded
- Route-based code splitting

---

## 🔒 PRIVACY & DATA PROTECTION

### Data Collection:
- Only necessary user data
- Transparent about what's collected
- User can export all data
- User can delete account

### Security Measures:
- HTTPS enforced
- CSP (Content Security Policy) headers
- XSS prevention
- CSRF protection
- Regular security audits

### Compliance:
- LGPD (Brazilian General Data Protection Law)
- GDPR-ready (for future expansion)

---

## 🐛 ERROR HANDLING

### Error Boundaries:
```typescript
class ErrorBoundary extends React.Component {
  // Catches React errors
  // Displays fallback UI
  // Logs to monitoring service
}
```

### API Error Handling:
- Network errors
- Authentication errors
- Validation errors
- Rate limiting
- User-friendly error messages

### Offline Handling:
- Show offline indicator
- Queue operations
- Retry mechanism
- Inform user of sync status

---

## 📝 CODE STANDARDS

### TypeScript:
- Strict mode enabled
- Explicit types for function params and returns
- No `any` types (use `unknown` if necessary)
- Interfaces for object shapes

### React:
- Functional components only
- Custom hooks for logic reuse
- Props destructuring
- Proper key props in lists
- Memoization where appropriate

### CSS/Tailwind:
- Use semantic tokens from design system
- No hardcoded colors
- Responsive utilities
- Dark mode variants
- Consistent spacing scale

### File Organization:
```
src/
├── components/
│   ├── ui/           # shadcn components
│   └── *.tsx         # Feature components
├── hooks/            # Custom React hooks
├── lib/              # Utilities
├── pages/            # Route pages
├── utils/            # Helper functions
├── assets/           # Images, fonts
└── integrations/     # Third-party integrations
```

---

## 🎓 EDUCATIONAL CONTENT

### Financial Tips Categories:
1. **Budgeting Basics**
2. **Saving Strategies**
3. **Debt Management**
4. **Investment Introduction**
5. **Emergency Fund**
6. **Financial Independence**

### Tip Rotation:
- Daily random tip
- Category-based on user data
- Progressive complexity

---

## 🏆 ACHIEVEMENT SYSTEM

### Achievement Types:
1. **First Steps**
   - Upload first spreadsheet
   - Add first transaction
   - Create first goal

2. **Consistency**
   - 7-day streak
   - 30-day streak
   - 100-day streak

3. **Goals**
   - First goal completed
   - 5 goals completed
   - 10 goals completed

4. **Financial Mastery**
   - Stay within budget 1 month
   - Pay off first debt
   - Save R$ 1,000

5. **Engagement**
   - Complete 10 challenges
   - Reach level 5
   - Earn 1,000 coins

---

## 📱 MOBILE-SPECIFIC FEATURES

### Gestures:
- Swipe to delete (transaction rows)
- Pull to refresh (data sync)
- Tap to mask/unmask values

### Haptic Feedback:
- Success vibrations
- Error alerts
- Button presses

### Mobile Navigation:
- Bottom navigation bar
- Thumb-friendly zones
- Large touch targets (min 44x44px)

---

## 🎨 THEMING SYSTEM

### Theme Variables:
All colors defined as CSS custom properties in `:root` and `.dark`

### Theme Switching:
```typescript
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('educash-dark-mode', !isDarkMode);
};
```

### Custom Themes (Future):
- Allow users to customize primary color
- Preset themes (Ocean, Forest, Sunset, etc.)

---

## 🔄 DATA SYNC STRATEGY

### Current (Local Storage):
- Data stored locally
- No cross-device sync
- Export/import for backup

### Future (Supabase):
- Real-time sync across devices
- Automatic backups
- Version history
- Conflict resolution

---

## 🎯 KEY PERFORMANCE INDICATORS (KPIs)

### User Engagement:
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average session duration
- Feature usage rates

### Financial Health:
- Average savings rate
- Debt reduction rate
- Budget adherence rate
- Goal completion rate

### Gamification:
- Average level reached
- Total coins earned
- Challenge completion rate
- Streak longevity

---

## 🛠️ DEVELOPMENT WORKFLOW

### Git Strategy:
- Main branch: production-ready
- Develop branch: integration
- Feature branches: individual features
- Conventional commits

### Code Review:
- Required for all PRs
- Automated tests must pass
- Design review for UI changes

### CI/CD:
- Automated testing
- Automated deployment
- Environment preview
- Rollback capability

---

## 📚 DOCUMENTATION

### Required Documentation:
1. **README.md**: Setup instructions
2. **CONTRIBUTING.md**: Contribution guidelines
3. **API.md**: Backend API documentation
4. **COMPONENTS.md**: Component library docs
5. **CHANGELOG.md**: Version history

---

## 🌟 UNIQUE SELLING POINTS (USPs)

1. **100% Free**: No premium features or paywalls
2. **Gamified Learning**: Makes finance education fun
3. **AI-Powered**: Intelligent insights and predictions
4. **Offline Capable**: Works without internet
5. **Privacy First**: Data stays private
6. **Brazilian Focus**: Tailored for Brazilian market
7. **Youth-Oriented**: Designed for young adults
8. **No Financial Jargon**: Simple, clear language

---

## 🎯 TARGET AUDIENCE

### Demographics:
- Age: 16-30 years old
- Location: Brazil (initial), Latin America (expansion)
- Education: High school to university
- Income: Entry-level or student

### Psychographics:
- Wants to learn financial management
- Struggles with budgeting
- Tech-savvy
- Responds to gamification
- Values privacy

---

## 🚦 PROJECT ROADMAP

### Phase 1: MVP (Complete)
- ✅ Landing page
- ✅ Excel upload/export
- ✅ Basic visualizations
- ✅ Goal system
- ✅ Debt management
- ✅ Gamification
- ✅ PWA

### Phase 2: Intelligence (Complete)
- ✅ AI insights
- ✅ Expense predictions
- ✅ Auto-categorization
- ✅ Weekly challenges

### Phase 3: Social & Polish (Complete)
- ✅ Social sharing
- ✅ Performance optimization
- ✅ Analytics
- ✅ Offline improvements

### Phase 4: Scale (Future)
- 🔜 User authentication
- 🔜 Cloud sync
- 🔜 Mobile apps (iOS/Android)
- 🔜 Community features

### Phase 5: Monetization (Future)
- 🔜 Premium insights
- 🔜 Financial product partnerships
- 🔜 B2B educational licenses

---

## 📞 SUPPORT CHANNELS

### Primary:
- Email: educash.pe@gmail.com
- Instagram DM: @educash.oficial

### Secondary (Future):
- Discord community
- Live chat
- FAQ section
- Video tutorials

---

## 🎉 SUCCESS METRICS

### User Success:
- 70% of users stay within budget
- 50% of users complete at least one goal
- 60% of users use app 3+ times per week
- 80% user satisfaction rating

### Technical Success:
- 99.9% uptime
- < 2s page load time
- < 5% error rate
- 90+ Lighthouse score

---

## 🔮 FUTURE ENHANCEMENTS

### Short-term (3-6 months):
- Push notifications
- Advanced filtering
- Custom categories
- Budget templates
- Recurring transactions

### Mid-term (6-12 months):
- Investment tracking
- Multiple currency support
- Bank integration (Open Banking)
- Family accounts
- Financial advisor chat

### Long-term (12+ months):
- AI financial coach
- Cryptocurrency tracking
- Tax planning tools
- Credit score monitoring
- Insurance recommendations

---

## 📖 GLOSSARY

### Financial Terms:
- **Essential**: Necessary expenses (50% of budget)
- **Desires**: Non-essential expenses (30% of budget)
- **Savings**: Money saved/invested (20% of budget)
- **Installment**: Partial payment of a debt
- **Creditor**: Person/institution owed money
- **Interest Rate**: Cost of borrowing money

### Technical Terms:
- **PWA**: Progressive Web App
- **RLS**: Row Level Security
- **HSL**: Hue, Saturation, Lightness (color format)
- **Edge Function**: Serverless function
- **Realtime**: Live data synchronization

---

## 🎬 CONCLUSION

This document provides a complete specification to replicate the EduCA$H application. Every feature, design element, business rule, and technical requirement is detailed to ensure consistency and completeness.

**Key Principles**:
1. **User-First**: Always prioritize user experience
2. **Education Focus**: Make financial literacy accessible
3. **Privacy**: Protect user data at all costs
4. **Quality**: High standards for code and design
5. **Innovation**: Continuously improve and add value

**Next Steps**:
1. Set up development environment
2. Initialize React + Vite project
3. Configure Tailwind and shadcn/ui
4. Set up Supabase project
5. Implement core features
6. Test thoroughly
7. Deploy and iterate

---

**Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: EduCA$H Team  
**License**: Proprietary  

---

*"Rich Mind, Bright Future" - EduCA$H 💚💛*
