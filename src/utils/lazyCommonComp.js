import SearchBar from '@/components/SearchBar/index.vue'
import SearchBarLabel from '@/components/SearchBar/SearchBarLabel.vue'

const components = [SearchBar, SearchBarLabel]

export const lazyCommonComp = (app) => {
    components.forEach((component) => {
        app.component(component.name, component)
    })
}
