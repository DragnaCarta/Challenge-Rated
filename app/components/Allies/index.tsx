import { AddCreature } from '../AddCreature'
import { CreatureItem } from '../CreatureItem'
import { sendEvent } from '@/app/lib/analytics'
import {ALLY_CREATURE_TOGGLE, calculateOccurrences, PLAYER_CREATURE_TOGGLE} from "@/app/lib/utils";

type Props = {
  partySize: number
  partyAverageLevel: number
  allies: number[]
  setAllies: (ns: number[]) => void
  players: number[]
  setPlayers: (ns: number[]) => void
  setPartyAverageLevel: (n: number) => void
  setPartySize: (n: number) => void
}

export function Allies({
    allies,
    setAllies,
    players,
    setPlayers,}: Props) {
  const allyCrOccurrences = calculateOccurrences(allies)

  const partyLevelOccurrences = calculateOccurrences(players)

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

  // Add function to manage party members, similar to allies
  function addPlayer(challengeRating: number) {
    sendEvent('player_added', { value: challengeRating, type: 'party' })
    setPlayers([...players, challengeRating])
  }

  // Function to remove a specific party member (by CR)
  function removePlayer(challengeRating: number) {
    const index = players.indexOf(challengeRating);  // Find index of the CR
    if (index > -1) {
      const newPlayers = players.filter((_, idx) => idx !== index); // Filter out
      setPlayers([...newPlayers]);  // Update the state
    }
  }

// Function to clear all occurrences of a specific CR from party members
  function clearPartyOccurrences(cr: number, creatureToggle: 0 | 1 | 2) {
    const predicate = (creatures: number[]) =>
        creatures.filter((creature) => creature !== cr);  // Predicate to filter out all CRs

    return function () {
      return setPlayers(predicate(players));  // Update players using the predicate
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 my-4 grow">
        <AddCreature addCreature={addPlayer} creatureToggle={2} />

        {/* Render party members */}
        {Object.keys(partyLevelOccurrences)
            .map((x) => parseFloat(x))
            .slice()
            .sort((a, b) => b - a)
            .map((cr) => {
              const crCount = partyLevelOccurrences[cr]
              return (
                  <CreatureItem
                      key={cr}
                      challengeRating={cr}
                      count={crCount}
                      increaseCount={(cr) => addPlayer(cr)}
                      decreaseCount={(cr) => removePlayer(cr)}
                      onClear={clearPartyOccurrences(cr, PLAYER_CREATURE_TOGGLE)}
                      creatureToggle={PLAYER_CREATURE_TOGGLE}
                  />
              )
            })}
      </div>


      <AddCreature addCreature={addAlly} creatureToggle={ALLY_CREATURE_TOGGLE} />

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
                creatureToggle={ALLY_CREATURE_TOGGLE}
              />
            )
          })}
      </div>
    </>
  )
}
