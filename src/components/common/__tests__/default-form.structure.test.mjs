import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const componentPath = 'D:/FF_Project/xp_code/src/components/common/default-form.vue'
const demoPath = 'D:/FF_Project/xp_code/src/views/demo/default-form-demo.vue'
const routerConfigPath = 'D:/FF_Project/xp_code/src/router/config.js'

test('default-form component exists under components/common', () => {
    assert.equal(fs.existsSync(componentPath), true)
})

test('default-form does not contain removed business component imports', () => {
    const source = fs.readFileSync(componentPath, 'utf8')

    assert.equal(source.includes("from '@/components/business/form-item/cms'"), false)
    assert.equal(source.includes("from '@/components/business/form-item/common'"), false)
    assert.equal(source.includes("from '@/components/company'"), false)
})

test('default-form demo file exists', () => {
    assert.equal(fs.existsSync(demoPath), true)
})

test('router config contains the default-form demo route', () => {
    const source = fs.readFileSync(routerConfigPath, 'utf8')

    assert.match(source, /\/demo\/default-form/)
})
