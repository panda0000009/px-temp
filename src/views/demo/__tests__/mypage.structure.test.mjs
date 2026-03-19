import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const myPagePath = 'D:/FF_Project/xp_code/src/views/demo/mypage.vue'
const routerConfigPath = 'D:/FF_Project/xp_code/src/router/config.js'

test('mypage demo file exists', () => {
    assert.equal(fs.existsSync(myPagePath), true)
})

test('mypage imports all four common components', () => {
    const source = fs.readFileSync(myPagePath, 'utf8')

    assert.equal(source.includes("import DefaultForm from '@/components/common/default-form.vue'"), true)
    assert.equal(source.includes("import DefaultTable from '@/components/common/default-table.vue'"), true)
    assert.equal(source.includes("import PageBox from '@/components/common/page-box.vue'"), true)
    assert.equal(source.includes("import PageBoxTitle from '@/components/common/page-box-title.vue'"), true)
})

test('router config contains the mypage demo route', () => {
    const source = fs.readFileSync(routerConfigPath, 'utf8')

    assert.match(source, /\/demo\/mypage/)
})
