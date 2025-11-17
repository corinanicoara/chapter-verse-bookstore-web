import { supabase } from './supabase';

export type AnalyticsEventType = 
  | 'hero_shop_click'
  | 'hero_visit_click'
  | 'pre_order_submission'
  | 'contact_submission'
  | 'nav_click';

interface TrackEventParams {
  eventType: AnalyticsEventType;
  brandVariant: 'poetic' | 'modern';
  metadata?: Record<string, any>;
}

export const trackEvent = async ({ eventType, brandVariant, metadata = {} }: TrackEventParams) => {
  try {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_type: eventType,
        brand_variant: brandVariant,
        session_id: sessionId,
        metadata,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};
