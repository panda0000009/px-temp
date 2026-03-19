import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const pageBoxPath = 'D:/FF_Project/xp_code/src/components/common/page-box.vue'
const pageBoxTitlePath = 'D:/FF_Project/xp_code/src/components/common/page-box-title.vue'
const demoPath = 'D:/FF_Project/xp_code/src/views/demo/page-box-demo.vue'
const routerConfigPath = 'D:/FF_Project/xp_code/src/router/config.js'

test('page-box component exists under components/common', () => {
    assert.equal(fs.existsSync(pageBoxPath), true)
})

test('page-box-title component exists under components/common', () => {
    assert.equal(fs.existsSync(pageBoxTitlePath), true)
})

test('page-box components keep key comments and explicit pageBoxRef API', () => {
    const pageBoxSource = fs.readFileSync(pageBoxPath, 'utf8')
    const pageBoxTitleSource = fs.readFileSync(pageBoxTitlePath, 'utf8')

    assert.match(pageBoxSource, /通用 page-box 组件 通用内容容器/)
    assert.match(pageBoxSource, /是否折叠起来了 - 配合page-box-title组件控制/)
    assert.match(pageBoxTitleSource, /通用 page-box 标题栏组件/)
    assert.match(pageBoxTitleSource, /pageBoxRef/)
    assert.equal(pageBoxTitleSource.includes('default-button'), false)
})

test('page-box demo file exists', () => {
    assert.equal(fs.existsSync(demoPath), true)
})

test('router config contains the page-box demo route', () => {
    const source = fs.readFileSync(routerConfigPath, 'utf8')

    assert.match(source, /\/demo\/page-box/)
})
