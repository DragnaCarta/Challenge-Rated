import { AddCreature } from '../AddCreature'
import { CreatureItem } from '../CreatureItem'
import { sendEvent } from '@/app/lib/analytics'
import {calculateOccurrences} from "@/app/utils";

type Props = {
  enemies: number[]
  setEnemies: (ns: number[]) => void
  addCreature: (value: number, toggle: 0 | 1 | 2) => void
}

export function Wave({ enemies, setEnemies, addCreature }: Props) {
  function addEnemy(challengeRating: number) {
    sendEvent('creature_added', { value: challengeRating, type: 'enemy' })
    setEnemies([...enemies, challengeRating])
  }

  function removeEnemy(challengeRating: number) {
    const index = enemies.indexOf(challengeRating)

    if (index > -1) {
      const newEnemies = enemies.filter((_, idx) => idx !== index)
      setEnemies([...newEnemies])
    }
  }

  function clearOccurences(cr: number) {
    const predicate = (creatures: number[]) =>
      creatures.filter((creature) => creature !== cr)

    return setEnemies(predicate(enemies))
  }

  const enemyCrOccurrences = calculateOccurrences(enemies)

  const keys = Object.keys(enemyCrOccurrences)
    .slice()
    .sort((a, b) => Number(b) - Number(a))

  return (
    <>
      <div className="flex flex-col gap-2">
        {keys
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
                onClear={() => clearOccurences(cr)}
              />
            )
          })}
      </div>
      {Boolean(keys.length) && <div className="mt-4" />}
      <AddCreature addCreature={addCreature} creatureToggle={0} unit="Power" />
    </>
  )
}
