import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const requestPath = 'D:/FF_Project/新建文件夹/px-temp/src/utils/request.js'
const loginApiPath = 'D:/FF_Project/新建文件夹/px-temp/src/apis/login.ts'

test('request.js exports a named request instance for generated apis', () => {
    const source = fs.readFileSync(requestPath, 'utf8')

    assert.match(source, /export\s+const\s+request\s*=\s*service/)
})

test('generated apis import the named request symbol', () => {
    const source = fs.readFileSync(loginApiPath, 'utf8')

    assert.match(source, /import\s+\{\s*request\s*\}\s+from\s+"@\/utils\/request"/)
    assert.match(source, /request\.post<\w+/)
})
