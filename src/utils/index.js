import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)
export const generateRandomCode = (length) => {
    if (length < 6) {
        throw new Error('密码长度至少为6')
    }

    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'

    // 确保密码中至少包含一个小写字母、一个大写字母和一个数字
    const allCharacters = lowerCaseLetters + upperCaseLetters + numbers
    let code = ''

    // 随机选取首字母（小写字母）和尾字母（大写字母）
    const firstChar = lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)]
    const lastChar = upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)]

    code += firstChar
    code += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)]
    code += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)]
    code += numbers[Math.floor(Math.random() * numbers.length)]

    // 如果指定的密码长度大于4，则继续随机选取字符直到达到指定长度
    for (let i = 4; i < length - 1; i++) {
        code += allCharacters[Math.floor(Math.random() * allCharacters.length)]
    }

    // 添加尾字母（大写字母）
    code += lastChar

    // 将密码字符串随机打乱顺序，但保持首尾字符不变
    let middlePart = code
        .slice(1, -1)
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')
    code = firstChar + middlePart + lastChar

    return code
}

// 使用示例：生成一个长度为6的随机密码
// console.log(generateRandomCode(6))
/** 当前周周一 00:00:00 */
export function getThisWeekStart() {
    return dayjs().startOf('isoWeek').format('YYYY-MM-DD 00:00:00')
}

/** 当前周周日 23:59:59 */
export function getThisWeekEnd() {
    return dayjs().endOf('isoWeek').format('YYYY-MM-DD 23:59:59')
}
export function getFileNameFromHeader(headers) {
    const disposition = headers['content-disposition']
    if (!disposition) return null

    // 兼容 filename / filename*
    const match = disposition.match(/filename\*=UTF-8''(.+)/) || disposition.match(/filename="?(.+?)"?$/)

    return match?.[1] ? decodeURIComponent(match[1]) : null
}
export const parseAgentPlayerIds = (value) => {
    const normalized = value.replace(/，/g, ',').replace(/；/g, ';')

    const rawList = normalized
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)

    const result = []
    const invalidItems = []

    rawList.forEach((item) => {
        const parts = item.split(',').map((v) => v.trim())

        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            invalidItems.push(item)
        } else {
            result.push({
                agentId: parts[0],
                agentPlayerId: parts[1]
            })
        }
    })

    return {
        result,
        invalidItems
    }
}
