import { defineStore } from 'pinia';

export const commonStore = defineStore('common', {
  // state, getters, actions 等
  state: () => ({
    tab: sessionStorage.getItem('tab') ? JSON.parse(sessionStorage.getItem('tab')) : [], // 头部菜单栏
  }),
  actions: {
    // 设置tab 导航栏数据
    useTab(currentRoute) {
      const array = [...this.tab]
      if (!array.find(item => item.path === currentRoute.path)) {
        array.push(currentRoute);
      }
      this.tab = [...array];
      sessionStorage.setItem('tab', JSON.stringify(array));
    },
    // 删除标签 
    delTags(url){
      const array = [...this.tab].filter(item => item.path !== url)
      this.tab = [...array];
    },
    // 清除所有 tab
    clearTab() {
      this.tab = [];
      sessionStorage.removeItem('tab');
    },
  }
});
