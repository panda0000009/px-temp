import { onActivated, onDeactivated, onUnmounted } from 'vue'
export function usePolling(task, options = {}) {
    const { interval = 30000, immediate = true } = options

    let timer = null
    let running = false

    const loop = async () => {
        if (running) return
        running = true

        try {
            await task()
        } finally {
            running = false
            timer = setTimeout(loop, interval)
        }
    }

    const start = () => {
        if (timer) return
        if (immediate) loop()
        else timer = setTimeout(loop, interval)
    }

    const stop = () => {
        clearTimeout(timer)
        timer = null
    }

    const restart = () => {
        stop()
        start()
    }
    onActivated(start)
    onDeactivated(stop)

    return { start, stop, restart }
}
