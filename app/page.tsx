'use client'
import clsx from 'clsx'
import { useState } from 'react'
import Big from 'big.js'
import { v4 } from 'uuid'
import { Allies } from './components/Allies'
import { Wave } from './components/Wave'
import EncounterCalculator from './lib/EncounterCalculator'
import { INITIAL_PARTY_LEVEL } from './lib/PartyLevelOptions'
import { INITIAL_PARTY_SIZE } from './lib/PartySizeOptions'

import IconPlus from './ui/icons/IconPlus'
import { IconRefresh } from './ui/icons/IconRefresh'
import { IconTrash } from './ui/icons/IconTrash'
import { IconCopy } from './ui/icons/IconCopy'

const _encounterCalculator = new EncounterCalculator()

const powerToTextColor = [
  { max: 20, label: 'text-red-100' },
  { max: 40, label: 'text-red-200' },
  { max: 60, label: 'text-red-300' },
  { max: 80, label: 'text-red-400' },
  { max: 100, label: 'text-red-500' },
  { max: 130, label: 'text-red-600' },
  { max: 170, label: 'text-red-700' },
  { max: 250, label: 'text-red-800' },
  { max: Infinity, label: 'text-red-900' },
]

export default function Home({
  searchParams,
}: {
  searchParams:
    | {
        partySize?: string
        partyAverageLevel?: string
        enemies?: string
        allies?: string
      }
    | undefined
}) {
  const [waves, setWaves] = useState<{ [key: string]: number[] }>({
    [v4()]: [],
  })

  const [partySize, setPartySize] = useState(
    searchParams?.partySize !== undefined
      ? Number(searchParams?.partySize)
      : INITIAL_PARTY_SIZE
  )
  const [partyAverageLevel, setPartyAverageLevel] = useState(
    searchParams?.partyAverageLevel !== undefined
      ? Number(searchParams?.partyAverageLevel)
      : INITIAL_PARTY_LEVEL
  )

  const [allies, setAllies] = useState<number[]>([])

  function addCreature(challengeRating: number) {
    setAllies([...allies, challengeRating])
  }

  const setWaveEnemies = (waveId: string, enemies: number[]) => {
    setWaves((waves) => ({ ...waves, [waveId]: enemies }))
  }

  const deleteWave = (waveId: string) => {
    setWaves((waves) => {
      return Object.keys(waves)
        .filter((currentWaveId) => waveId !== currentWaveId)
        .reduce((acc, key) => ({ ...acc, [key]: waves[key] }), {})
    })
  }

  const encounters = Object.values(waves)
    .map((enemies) => {
      return _encounterCalculator.recalculateDifficulty(
        partyAverageLevel,
        partySize,
        enemies,
        allies
      )
    })
    .reduce(
      (acc, encounter) => ({
        ...acc,
        hpLost: Big(acc.hpLost).plus(encounter.hpLost),
        resourcesSpent: Big(acc.resourcesSpent).plus(encounter.resourcesSpent),
      }),
      { hpLost: Big(0), resourcesSpent: Big(0) }
    )

  const difficultyLevels: {
    max: number
    label: string
  }[] = [
    { max: 20, label: 'Mild' },
    { max: 40, label: 'Bruising' },
    { max: 60, label: 'Bloody' },
    { max: 80, label: 'Brutal' },
    { max: 100, label: 'Oppressive' },
    { max: 130, label: 'Overwhelming' },
    { max: 170, label: 'Crushing' },
    { max: 250, label: 'Devastating' },
    { max: Infinity, label: 'Impossible' },
  ]
  const encounterDifficulty =
    difficultyLevels.find((level) => encounters.hpLost.toNumber() <= level.max)
      ?.label || 'Unknown'

  const textColor =
    powerToTextColor.find((ptc) => encounters.hpLost.toNumber() <= ptc.max)
      ?.label ?? 'text-neutral'

  return (
    <section className="max-w-screen-md mx-auto">
      <div className="p-4">
        {/* <Banner /> */}
        <h1 className="text-3xl mt-6">Challenge Rated</h1>
        <p className="text-lg mt-4">
          An encounter-building tool for determining combat difficulty in
          Dungeons & Dragons 5th Edition Based on the{' '}
          <a
            href="https://www.gmbinder.com/share/-N4m46K77hpMVnh7upYa"
            target="_blank"
            rel="noreferrer"
            className="link link-accent inline-flex items-center gap-1"
          >
            Challenge Ratings 2.0
          </a>
          &nbsp;system developed by DragnaCarta.
        </p>
        <aside className="mt-10">
          <section>
            <div className="flex gap-2 items-center">
              <h2>Your Encounter</h2>
              <button
                className="btn btn-square btn-sm"
                onClick={() => {
                  setWaves({ [v4()]: [] })
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
              <div
                className="flex flex-col items-center justify-center py-4"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 13px, var(--fallback-b2, oklch(var(--b1))) 13px, var(--fallback-b2, oklch(var(--b1))) 14px)',
                }}
              >
                <div className="card textarea-info flex flex-col border border-base-200 bg-neutral p-4 shadow-lg">
                  <Allies
                    allies={allies}
                    setAllies={setAllies}
                    partySize={partySize}
                    addCreature={addCreature}
                    setPartySize={setPartySize}
                    partyAverageLevel={partyAverageLevel}
                    setPartyAverageLevel={setPartyAverageLevel}
                  />
                </div>
              </div>

              <div className="divider divider-vertical md:divider-horizontal">
                VS
              </div>
              <div className="textarea-info flex flex-col justify-between  gap-6">
                {Object.keys(waves).map((waveId, _, array) => {
                  const wave = waves[waveId]
                  const canDelete = array.length > 1
                  const { hpLost, resourcesSpent } =
                    _encounterCalculator.recalculateDifficulty(
                      partyAverageLevel,
                      partySize,
                      wave,
                      allies
                    )

                  const canDuplicate = Boolean(wave.length)

                  return (
                    <div
                      key={waveId}
                      className="card flex flex-col justify-between border border-base-200 bg-neutral p-4 shadow-lg"
                    >
                      <Wave
                        enemies={wave}
                        setEnemies={(ns) => setWaveEnemies(waveId, ns)}
                        addCreature={(n) =>
                          setWaveEnemies(waveId, [...wave, n])
                        }
                      />
                      {(canDuplicate || canDelete) && (
                        <aside className="flex gap-1 items-center -mx-4 -mb-4 p-4 mt-4 border-t border-t-base-200">
                          {array.length > 1 && wave.length > 0 ? (
                            <div className="grow flex gap-2">
                              <span>
                                HP: <b>{Math.round(hpLost)}%</b>
                              </span>
                              <span>
                                Resources: <b>{Math.round(resourcesSpent)}%</b>
                              </span>
                            </div>
                          ) : (
                            <div className="grow" />
                          )}
                          <div className="flex gap-2 items-center">
                            {canDuplicate && (
                              <button
                                className="btn btn-sm btn-neutral btn-square rounded-lg text-info"
                                onClick={() =>
                                  setWaves((waves) => ({
                                    ...waves,
                                    [v4()]: [...wave],
                                  }))
                                }
                              >
                                <IconCopy width={16} height={16} />
                              </button>
                            )}

                            {canDelete && (
                              <button
                                className="btn btn-sm btn-square btn-neutral rounded-lg text-error"
                                onClick={() => deleteWave(waveId)}
                              >
                                <IconTrash width={16} height={16} />
                              </button>
                            )}
                          </div>
                        </aside>
                      )}
                    </div>
                  )
                })}
                <button
                  className="btn btn-sm"
                  onClick={() =>
                    setWaves((waves) => ({
                      ...waves,
                      [v4()]: [],
                    }))
                  }
                >
                  Add New Wave/Phase
                  <IconPlus style={{ height: '1.2rem', width: '1.2rem' }} />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-10 mb-4 shadow-xl">
            <div className="stats w-full hidden md:inline-grid">
              <div className="stat">
                <p className="stat-title inline-flex items-center gap-2">
                  Difficulty
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {encounterDifficulty}
                </p>
              </div>

              <div className="stat">
                <p className="stat-title inline-flex items-center gap-2">
                  HP Loss
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {encounters.hpLost.round(0).toNumber()}%
                </p>
              </div>
              <div className="stat">
                <p className="stat-title inline-flex items-center gap-2">
                  Resources Spent
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {encounters.resourcesSpent.round(0).toNumber()}%
                </p>
              </div>
            </div>

            <div className="join join-vertical w-full md:hidden">
              <div
                className="stat join-item bg-base-100 border-b border-base"
                style={{ borderBottomWidth: 1.5 }}
              >
                <p className="stat-title inline-flex items-center gap-2">
                  Difficulty
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {encounterDifficulty}
                </p>
              </div>
              <div className="stats bg-base-100 join-item md:w-full border-base-content">
                <div className="stat">
                  <p className="stat-title inline-flex items-center gap-2">
                    HP Loss
                  </p>
                  <p className={clsx('stat-value', textColor)}>
                    {encounters.hpLost.round(0).toNumber()}%
                  </p>
                </div>
                <div className="stat">
                  <p className="stat-title inline-flex items-center gap-2">
                    Resources Spent
                  </p>
                  <p className={clsx('stat-value', textColor)}>
                    {encounters.resourcesSpent.round(0).toNumber()}%
                  </p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  )
}
