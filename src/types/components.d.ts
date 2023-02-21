// 给components下的全局组件，设置类型
import CpNavBar from '@/components/cpNavBar.vue'
import CpIcon from '@/components/cpIcon.vue'
import cpRdioBtn from '@/components/cpRdioBtn.vue'
declare module 'vue' {
  interface GlobalComponents {
    // 指定组件类型
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    cpRdioBtn: typeof cpRdioBtn
  }
}
