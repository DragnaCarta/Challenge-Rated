import { useId } from 'react'
import { AddCreature } from '../AddCreature'
import { CreatureItem } from '../CreatureItem'

type Props = {
  enemies: number[]
  setEnemies: (ns: number[]) => void
  addCreature: (value: number, toggle: 0 | 1) => void
}

export function Wave({ enemies, setEnemies, addCreature }: Props) {
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

  function clearOccurences(cr: number) {
    const predicate = (creatures: number[]) =>
      creatures.filter((creature) => creature !== cr)

    return setEnemies(predicate(enemies))
  }

  const enemyCrOccurrences = enemies.reduce(function (
    acc: Record<number, number>,
    curr
  ) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  },
  {})

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
