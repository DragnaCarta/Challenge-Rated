import { useState } from 'react'

import IconPlus from '@/app/ui/icons/IconPlus'
import { IconRefresh } from '@/app/ui/icons/IconRefresh'

import ChallengeRatingOptions from '@/app/lib/ChallengeRatingOptions'
import PartyLevelOptions, {
  INITIAL_PARTY_LEVEL,
} from '@/app/lib/PartyLevelOptions'
import PartySizeOptions, {
  INITIAL_PARTY_SIZE,
} from '@/app/lib/PartySizeOptions'

import { CreatureItem } from '../CreatureItem'

type CardBuildYourEncounterProps = {
  partySize: number
  setPartySize: (value: number) => void
  partyAverageLevel: number
  setPartyAverageLevel: (value: number) => void

  addCreature: (value: number, toggle: 0 | 1) => void
  enemies: number[]
  setEnemies: (value: number[]) => void
  allies: number[]
  setAllies: (value: number[]) => void
}

export function CardBuildYourEncounter({
  partySize,
  partyAverageLevel,
  setPartySize,
  setPartyAverageLevel,
  addCreature,
  enemies,
  setEnemies,
  allies,
  setAllies,
}: CardBuildYourEncounterProps) {
  function addAlly(challengeRating: number) {
    setAllies([...allies, challengeRating])
  }

  function removeAlly(challengeRating: number) {
    const index = allies.indexOf(challengeRating)
    if (index > -1) {
      allies.splice(index, 1)
      setAllies([...allies])
    }
  }

  function clearOccurences(cr: number, creatureToggle: 0 | 1) {
    const predicate = (creatures: number[]) =>
      creatures.filter((creature) => creature !== cr)

    return function () {
      return creatureToggle
        ? setAllies(predicate(allies))
        : setEnemies(predicate(enemies))
    }
  }

  function addEnemy(challengeRating: number) {
    setEnemies([...enemies, challengeRating])
  }

  function removeEnemy(challengeRating: number) {
    const index = enemies.indexOf(challengeRating)

    if (index > -1) {
      enemies.splice(index, 1)
      setEnemies([...enemies])
    }
  }

  //
  const enemyCrOccurrences = enemies.reduce(function (
    acc: Record<number, number>,
    curr
  ) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  },
  {})

  const allyCrOccurrences = allies.reduce(function (
    acc: Record<number, number>,
    curr
  ) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  },
  {})

  return (
    <>
      <div className="flex gap-2 items-center">
        <h2 className="text-lg">Your Encounter</h2>
        <button
          className="btn btn-square btn-sm"
          onClick={() => {
            setEnemies([])
            setAllies([])
            setPartyAverageLevel(INITIAL_PARTY_LEVEL)
            setPartySize(INITIAL_PARTY_SIZE)
          }}
        >
          <IconRefresh />
        </button>
      </div>

      <div
        className="w-full mt-6 md:grid"
        style={{ gridTemplateColumns: '1fr auto 1fr' }}
      >
        <div className="card border border-base-200 p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <label className="form-control">
              <select
                value={partySize}
                className="select select-sm"
                onChange={(event) => setPartySize(Number(event.target.value))}
              >
                {PartySizeOptions.map((pso) => (
                  <option key={pso.displayText} value={pso.value}>
                    {pso.displayText}
                  </option>
                ))}
              </select>
            </label>
            <div className="inline-flex items-center">
              {partySize === 1 ? 'player' : 'players'} of level&nbsp;
            </div>
            <label className="form-control">
              <select
                value={partyAverageLevel}
                className="select select-sm"
                onChange={(event) => {
                  if (!Boolean(partySize)) {
                    setPartySize(1)
                  }
                  setPartyAverageLevel(Number(event.target.value))
                }}
              >
                {PartyLevelOptions.map((pso) => (
                  <option key={pso.displayText} value={pso.value}>
                    {pso.displayText}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-2 my-4">
            {Object.keys(allyCrOccurrences)
              .map((x) => parseFloat(x))
              .map((cr) => {
                const crCount = allyCrOccurrences[cr]
                return (
                  <CreatureItem
                    key={cr}
                    challengeRating={cr}
                    count={crCount}
                    increaseCount={(cr) => addAlly(cr)}
                    decreaseCount={(cr) => removeAlly(cr)}
                    onClear={clearOccurences(cr, 1)}
                  />
                )
              })}
          </div>

          <AddCreature addCreature={addCreature} creatureToggle={1} />
        </div>

        <div className="divider divider-vertical md:divider-horizontal">VS</div>

        <div className="card border border-base-200 textarea-info p-4 flex flex-col justify-between shadow-lg">
          <div className="flex flex-col gap-2 mb-4">
            {Object.keys(enemyCrOccurrences)
              .map((x) => parseFloat(x))
              .map((cr) => {
                const crCount = enemyCrOccurrences[cr]

                return (
                  <CreatureItem
                    key={cr}
                    challengeRating={cr}
                    count={crCount}
                    increaseCount={(cr) => addEnemy(cr)}
                    decreaseCount={(cr) => removeEnemy(cr)}
                    onClear={clearOccurences(cr, 0)}
                  />
                )
              })}
          </div>

          <AddCreature
            addCreature={addCreature}
            creatureToggle={0}
            unit="Power"
          />
        </div>
      </div>
    </>
  )
}

function AddCreature({
  addCreature,
  creatureToggle,
  unit,
}: Pick<CardBuildYourEncounterProps, 'addCreature'> & {
  creatureToggle: 0 | 1
  unit?: string
}) {
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

function _numberSort(a: number, b: number) {
  return a - b
}
