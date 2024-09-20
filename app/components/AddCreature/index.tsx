import ChallengeRatingOptions from '@/app/lib/ChallengeRatingOptions'
import { sendGAEvent, sendGTMEvent } from '@next/third-parties/google'
import IconPlus from '@/app/ui/icons/IconPlus'
import { useState } from 'react'
import { sendEvent } from '@/app/lib/analytics'


function getCreatureType(creatureToggle: 0 | 1 | 2): string {
    switch (creatureToggle) {
        case 1:
            return 'Ally';
        case 0:
            return 'Enemy';
        case 2:
            return 'Party Member';
        default:
            return 'Unknown';
    }
}

type Props = {
  addCreature: (value: number, toggle: 0 | 1 | 2) => void
  creatureToggle: 0 | 1 | 2
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
          Add {getCreatureType(creatureToggle)}{' '}
        </div>

        <select
          className="select select-sm join-item grow"
          value={creature}
          onChange={(event) => {
            addCreature(Number(event.target.value), creatureToggle)
            setCreature(EMPTY)
            sendEvent('creature_added', {
              value: event.target.value,
              type: getCreatureType(creatureToggle),
            })
          }}
        >
          <option value={EMPTY}>
            Choose {getCreatureType(creatureToggle)} CR
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
