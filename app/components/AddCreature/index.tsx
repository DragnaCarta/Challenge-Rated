import ChallengeRatingOptions from '@/app/lib/ChallengeRatingOptions'
import { sendGAEvent, sendGTMEvent } from '@next/third-parties/google'
import IconPlus from '@/app/ui/icons/IconPlus'
import { useState } from 'react'
import { sendEvent } from '@/app/lib/analytics'

type Props = {
  addCreature: (value: number, toggle: 0 | 1) => void
  creatureToggle: 0 | 1
  unit?: string
}
const EMPTY = 'empty'
export function AddCreature({ addCreature, creatureToggle, unit }: Props) {
  const [creature, setCreature] = useState(EMPTY)

  return (
    <div className="form-control">
      <div className="join w-full flex">
        <div
          className="btn btn-sm join-item cursor-default animate-none"
          tabIndex={-1}
        >
          Add {creatureToggle ? 'Ally' : 'Enemy'}{' '}
        </div>

        <select
          className="select select-sm join-item grow"
          value={creature}
          onChange={(event) => {
            addCreature(Number(event.target.value), creatureToggle)
            setCreature(EMPTY)
            sendEvent('creature_added', {
              value: event.target.value,
              type: creatureToggle ? 'ally' : 'enemy',
            })
          }}
        >
          <option value={EMPTY}>
            Choose {creatureToggle ? 'Ally' : 'Enemy'} CR
          </option>
          {ChallengeRatingOptions.map((cr) => (
            <option key={cr.displayText} value={cr.value}>
              CR {cr.displayText}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
