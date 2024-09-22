import { AddCreature } from '../AddCreature'
import { CreatureItem } from '../CreatureItem'
import { sendEvent } from '@/app/lib/analytics'
import {ALLY_CREATURE_TOGGLE, calculateOccurrences, PARTY_MEMBER_CREATURE_TOGGLE} from "@/app/utils";

type Props = {
  partySize: number
  partyAverageLevel: number
  allies: number[]
  setAllies: (ns: number[]) => void
  partyMembers: number[]
  setPartyMembers: (ns: number[]) => void
  setPartyAverageLevel: (n: number) => void
  setPartySize: (n: number) => void
}

export function Allies({
    allies,
    setAllies,
    partyMembers,
    setPartyMembers,}: Props) {
  const allyCrOccurrences = calculateOccurrences(allies)

  const partyLevelOccurrences = calculateOccurrences(partyMembers)

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
  function addPartyMember(challengeRating: number) {
    sendEvent('party_member_added', { value: challengeRating, type: 'party' })
    setPartyMembers([...partyMembers, challengeRating])
  }

  // Function to remove a specific party member (by CR)
  function removePartyMember(challengeRating: number) {
    const index = partyMembers.indexOf(challengeRating);  // Find index of the CR
    if (index > -1) {
      const newPartyMembers = partyMembers.filter((_, idx) => idx !== index); // Filter out
      setPartyMembers([...newPartyMembers]);  // Update the state
    }
  }

// Function to clear all occurrences of a specific CR from party members
  function clearPartyOccurrences(cr: number, creatureToggle: 1) {
    const predicate = (creatures: number[]) =>
        creatures.filter((creature) => creature !== cr);  // Predicate to filter out all CRs

    return function () {
      return setPartyMembers(predicate(partyMembers));  // Update partyMembers using the predicate
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 my-4 grow">
        <AddCreature addCreature={addPartyMember} creatureToggle={2} />

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
                      increaseCount={(cr) => addPartyMember(cr)}
                      decreaseCount={(cr) => removePartyMember(cr)}
                      onClear={clearPartyOccurrences(cr, 1)}
                      creatureToggle={PARTY_MEMBER_CREATURE_TOGGLE}
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
