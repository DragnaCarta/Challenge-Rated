import ChallengeRatingOptions from '@/app/lib/ChallengeRatingOptions'
import IconPlus from '@/app/ui/icons/IconPlus'
import { useState } from 'react'

type Props = {
  addCreature: (value: number, toggle: 0 | 1) => void
  creatureToggle: 0 | 1
  unit?: string
}

export function AddCreature({ addCreature, creatureToggle, unit }: Props) {
  const [creature, setCreature] = useState(ChallengeRatingOptions[0].value)

  return (
    <div className="form-control">
      <div className="join w-full flex">
        <div
          className="btn btn-sm join-item cursor-default animate-none"
          tabIndex={-1}
        >
          {creatureToggle ? 'ALLY' : 'ENEMY'}{' '}
        </div>

        <select
          className="select select-sm join-item grow"
          value={creature}
          onChange={(event) => setCreature(Number(event.target.value))}
        >
          {ChallengeRatingOptions.map((cr) => (
            <option
              key={cr.displayText}
              value={cr.value}
              selected={cr.value == creature}
            >
              CR {cr.displayText}
            </option>
          ))}
        </select>
        <button
          className="btn btn-sm btn-square join-item"
          onClick={() => addCreature(Number(creature!), creatureToggle)}
        >
          <IconPlus />
        </button>
      </div>
    </div>
  )
}
