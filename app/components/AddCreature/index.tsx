import { useState } from 'react'
import { sendEvent } from '@/app/lib/analytics'
import {creatureHasCRorLevel, getCreatureType, PLAYER_MEMBER_CREATURE_TYPE} from "@/app/lib/utils";
import {RadioOption} from "@/app/lib/types";
import PartyLevelOptions from "@/app/lib/PartyLevelOptions";
import ChallengeRatingOptions from "@/app/lib/ChallengeRatingOptions";

type Props = {
  addCreature: (value: number, toggle: 0 | 1 | 2) => void
  creatureToggle: 0 | 1 | 2
  unit?: string
}


function getCreatureOptions(creatureType: string): RadioOption[] {
    switch (creatureType) {
        case PLAYER_MEMBER_CREATURE_TYPE:
            return PartyLevelOptions
        default:
            return ChallengeRatingOptions
    }
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
            Choose {getCreatureType(creatureToggle)} {creatureHasCRorLevel(creatureToggle)}
          </option>
          {getCreatureOptions(getCreatureType(creatureToggle)).map((cr) => (
            <option key={cr.displayText} value={cr.value}>
                {creatureHasCRorLevel(creatureToggle)} {cr.displayText}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
