import ChallengeRatingOptions from '@/app/lib/ChallengeRatingOptions'
import IconPlus from '@/app/ui/icons/IconPlus'
import { useState } from 'react'

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
          onChange={(event) => setCreature(event.target.value)}
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
        <button
          className="btn btn-sm btn-square join-item"
          onClick={() => {
            addCreature(Number(creature!), creatureToggle)
            setCreature(EMPTY)
          }}
          disabled={creature === EMPTY}
        >
          <IconPlus />
        </button>
      </div>
    </div>
  )
}
