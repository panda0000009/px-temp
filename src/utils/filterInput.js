export const formatUids = (val) => {
    if (!val) return []

    if (Array.isArray(val)) return val.map(String).filter((n) => !isNaN(n))

    return String(val)
        .replace(/，/g, ',') // 中文逗号转英文
        .split(/,|\n|\s+/) // 支持逗号 / 换行 / 空格
        .map((v) => String(v.trim()))
        .filter((n) => !isNaN(n))
}
