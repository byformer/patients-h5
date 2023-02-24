import useHomeStore from './modules/home'
import useUserStore from './modules/user'
import usetConsultStore from './modules/consult'
export default function useStore() {
  return {
    home: useHomeStore(),
    user: useUserStore(),
    consult: usetConsultStore()
  }
}
