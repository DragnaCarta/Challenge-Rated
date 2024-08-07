import PartyLevelOptions from '@/app/lib/PartyLevelOptions'
import PartySizeOptions from '@/app/lib/PartySizeOptions'
import { AddCreature } from '../AddCreature'
import { CreatureItem } from '../CreatureItem'
import { sendEvent } from '@/app/lib/analytics'

type Props = {
  partySize: number
  partyAverageLevel: number
  allies: number[]
  setAllies: (ns: number[]) => void
  setPartyAverageLevel: (n: number) => void
  setPartySize: (n: number) => void
  addCreature: (cr: number, toggle: 0 | 1) => void
}

export function Allies({
  partySize,
  setPartySize,
  allies,
  setAllies,
  partyAverageLevel,
  setPartyAverageLevel,
  addCreature,
}: Props) {
  const allyCrOccurrences = allies.reduce(function (
    acc: Record<number, number>,
    curr
  ) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  },
  {})

  function addAlly(challengeRating: number) {
    sendEvent('creature_added', { value: challengeRating, type: 'ally' })
    setAllies([...allies, challengeRating])
  }

  function removeAlly(challengeRating: number) {
    const index = allies.indexOf(challengeRating)
    if (index > -1) {
      const newAllies = allies.filter((_, idx) => idx !== index)
      setAllies([...newAllies])
    }
  }

  function clearOccurences(cr: number, creatureToggle: 1) {
    const predicate = (creatures: number[]) =>
      creatures.filter((creature) => creature !== cr)

    return function () {
      return setAllies(predicate(allies))
    }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <label className="form-control">
          <select
            value={partySize}
            className="select select-sm"
            onChange={(event) => {
              sendEvent('party_size_changed', { value: event.target.value })
              setPartySize(Number(event.target.value))
            }}
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
              sendEvent('party_level_changed', { value: event.target.value })
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

      <div className="flex flex-col gap-2 my-4 grow">
        {Object.keys(allyCrOccurrences)
          .map((x) => parseFloat(x))
          .slice()
          .sort((a, b) => b - a)
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
    </>
  )
}
