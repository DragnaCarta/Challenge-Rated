import Fraction from 'fraction.js'

import IconMinus from '@/app/ui/icons/IconMinus'
import IconPlus from '@/app/ui/icons/IconPlus'
import { IconTrash } from '@/app/ui/icons/IconTrash'

type CreatureListItemProps = {
  challengeRating: number
  count: number
  increaseCount: (challengeRating: number) => void
  decreaseCount: (challengeRating: number) => void
  onClear: () => void
}

export function CreatureItem({
  challengeRating,
  count,
  increaseCount,
  decreaseCount,
  onClear,
}: CreatureListItemProps) {
  const crDisplay = new Fraction(challengeRating).toFraction(true)

  return (
    <div
      className="grid justify-between gap-2"
      style={{ gridTemplateColumns: '1fr 0fr' }}
    >
      <p className="inline-flex items-center rounded-md grow gap-2">
        CR: {crDisplay}
        <button
          className="btn btn-xs btn-square btn-neutral text-error"
          onClick={() => onClear()}
        >
          <IconTrash width={16} height={16} />
        </button>
      </p>
      <div className="items-center join grow-0 shrink">
        <button
          className="btn btn-sm btn-square btn-error join-item"
          onClick={() => decreaseCount(challengeRating)}
        >
          <IconMinus />
        </button>
        <button className="btn btn-sm join-item" tabIndex={-1}>
          {count}
        </button>
        <button
          className="btn btn-sm btn-square btn-success join-item"
          onClick={() => increaseCount(challengeRating)}
        >
          <IconPlus />
        </button>
      </div>
    </div>
  )
}
