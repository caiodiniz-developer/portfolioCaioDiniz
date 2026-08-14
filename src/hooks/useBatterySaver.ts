import { useState, useEffect } from 'react'

/**
 * Reports when the device is low on battery and not charging.
 *
 * The site already honours `prefers-reduced-motion`; this is the same courtesy
 * extended to a condition the user never gets to declare. Heavy animation on a
 * phone at 12% is a real cost to someone, and the browser will tell us if we
 * ask.
 *
 * The Battery Status API is Chromium-only and gated to secure contexts. Where
 * it is missing this hook simply never fires, so nothing degrades.
 */

const LOW = 0.2   // 20%

interface BatteryLike extends EventTarget {
  level: number
  charging: boolean
}

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryLike>
}

export interface BatteryState {
  /** True when below the threshold AND unplugged. */
  saving: boolean
  /** 0–1, or null when unknown. */
  level: number | null
}

export function useBatterySaver(): BatteryState {
  const [state, setState] = useState<BatteryState>({ saving: false, level: null })

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery
    if (typeof nav.getBattery !== 'function') return

    let battery: BatteryLike | null = null
    let cancelled = false

    function update() {
      if (!battery || cancelled) return
      setState({
        saving: battery.level <= LOW && !battery.charging,
        level:  battery.level,
      })
    }

    nav.getBattery()
      .then(b => {
        if (cancelled) return
        battery = b
        update()
        b.addEventListener('levelchange', update)
        b.addEventListener('chargingchange', update)
      })
      .catch(() => {
        // Permissions policy can reject this — treat as "unknown", not an error.
      })

    return () => {
      cancelled = true
      battery?.removeEventListener('levelchange', update)
      battery?.removeEventListener('chargingchange', update)
    }
  }, [])

  return state
}
