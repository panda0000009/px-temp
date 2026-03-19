export function useClipboard() {
    const copy = async (text) => {
        if (!text) return false

        // 优先使用现代 API
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text)
                return true
            } catch {
                return false
            }
        }

        // 兜底方案（HTTP / 旧浏览器）
        try {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed'
            textarea.style.left = '-9999px'
            textarea.style.top = '-9999px'
            textarea.setAttribute('readonly', 'true')

            document.body.appendChild(textarea)
            textarea.select()
            const result = document.execCommand('copy')
            document.body.removeChild(textarea)

            return result
        } catch {
            return false
        }
    }

    return { copy }
}
