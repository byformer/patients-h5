import useUserStore from './modules/user'
import usetConsultStore from './modules/consult'
export default function useStore() {
  return {
    user: useUserStore(),
    consult: usetConsultStore()
  }
}
