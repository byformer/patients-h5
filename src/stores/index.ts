import useHomeStore from './modules/home'
import useUserStore from './modules/user'
export default function useStore() {
  return {
    home: useHomeStore(),
    user: useUserStore()
  }
}
