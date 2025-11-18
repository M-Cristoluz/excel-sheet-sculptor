import { useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const trackPageView = (page: string) => {
    // Armazena visualizações de página no localStorage para analytics
    const views = JSON.parse(localStorage.getItem('educash-analytics-views') || '{}');
    views[page] = (views[page] || 0) + 1;
    views.lastVisit = new Date().toISOString();
    localStorage.setItem('educash-analytics-views', JSON.stringify(views));
    
    console.log('📊 Analytics - Page View:', page);
  };

  const trackEvent = ({ event, category, label, value }: AnalyticsEvent) => {
    // Armazena eventos no localStorage
    const events = JSON.parse(localStorage.getItem('educash-analytics-events') || '[]');
    events.push({
      event,
      category,
      label,
      value,
      timestamp: new Date().toISOString()
    });
    
    // Mantém apenas os últimos 100 eventos
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem('educash-analytics-events', JSON.stringify(events));
    console.log('📊 Analytics - Event:', { event, category, label, value });
  };

  const trackFileUpload = (fileSize: number, fileType: string) => {
    trackEvent({
      event: 'file_upload',
      category: 'engagement',
      label: fileType,
      value: fileSize
    });
  };

  const trackGoalCreated = () => {
    trackEvent({
      event: 'goal_created',
      category: 'engagement',
      label: 'financial_goal'
    });
  };

  const trackChallengeCompleted = (challengeId: string, reward: number) => {
    trackEvent({
      event: 'challenge_completed',
      category: 'gamification',
      label: challengeId,
      value: reward
    });
  };

  const trackInsightGenerated = () => {
    trackEvent({
      event: 'ai_insight_generated',
      category: 'ai_usage',
      label: 'insights'
    });
  };

  const trackPredictionGenerated = () => {
    trackEvent({
      event: 'ai_prediction_generated',
      category: 'ai_usage',
      label: 'predictions'
    });
  };

  const getAnalyticsSummary = () => {
    const views = JSON.parse(localStorage.getItem('educash-analytics-views') || '{}');
    const events = JSON.parse(localStorage.getItem('educash-analytics-events') || '[]');
    
    return {
      totalPageViews: Object.values(views).reduce((a: any, b: any) => 
        typeof b === 'number' ? a + b : a, 0
      ),
      totalEvents: events.length,
      lastVisit: views.lastVisit,
      views,
      events
    };
  };

  return {
    trackPageView,
    trackEvent,
    trackFileUpload,
    trackGoalCreated,
    trackChallengeCompleted,
    trackInsightGenerated,
    trackPredictionGenerated,
    getAnalyticsSummary
  };
};

// Hook para rastreamento automático de página
export const usePageView = (pageName: string) => {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
};
