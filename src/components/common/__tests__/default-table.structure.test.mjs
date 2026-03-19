import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const componentPath = 'D:/FF_Project/xp_code/src/components/common/default-table.vue'
const demoPath = 'D:/FF_Project/xp_code/src/views/demo/default-table-demo.vue'

test('default-table.vue no longer depends on the helper module', () => {
    const source = fs.readFileSync(componentPath, 'utf8')

    assert.equal(source.includes("from './default-table.helpers'"), false)
})

test('default-table demo file exists', () => {
    assert.equal(fs.existsSync(demoPath), true)
})
