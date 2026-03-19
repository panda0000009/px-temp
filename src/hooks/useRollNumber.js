import { ref, watch } from 'vue'

export function useRollNumber(
  target,
  options = {
    duration: 800,
    precision: 0 // 默认整数，RTP 传 2
  }
) {
  const display = ref(0)
  let raf = null

  const animate = (from, to) => {
    cancelAnimationFrame(raf)
    const start = performance.now()

    const run = (now) => {
      const progress = Math.min((now - start) / options.duration, 1)

      const value = from + (to - from) * easeOut(progress)

      // ✅ 只在这里控制精度，不吞小数
      display.value = Number(value.toFixed(options.precision))

      if (progress < 1) {
        raf = requestAnimationFrame(run)
      }
    }

    raf = requestAnimationFrame(run)
  }

  watch(
    target,
    (val, old = 0) => {
      animate(old, val)
    },
    { immediate: true }
  )

  return display
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}
