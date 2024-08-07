import { sendGAEvent } from '@next/third-parties/google'

type AnalyticsEvent =
  | 'party_level_changed'
  | 'creature_added'
  | 'creature_removed'
  | 'party_size_changed'
  | 'click'

export function sendEvent(name: AnalyticsEvent, params: Object) {
  sendGAEvent('event', name, params)
}
