import { defineStore } from 'pinia'
import type { PartialConsult } from '@/types/consuit'
import type { ConsultType } from '@/enums'
import { ref } from 'vue'
export default defineStore(
  'consult',
  () => {
    {
      // 问诊记录状态
      const consult = ref<PartialConsult>({})
      // 1.修改问题类型函数
      const setType = (type: ConsultType) => (consult.value.type = type)
      // 2. 修改极速问诊类型函数
      const setIllnesType = (type: 0 | 1) => (consult.value.illnessType = type)
      // 3. 修改科室函数
      const setDep = (id: string) => (consult.value.depId = id)
      // 4. 修改病情描述函数
      const setIllness = (
        illness: Pick<
          PartialConsult,
          'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
        >
      ) => {
        consult.value.illnessDesc = illness.illnessDesc
        consult.value.illnessTime = illness.illnessTime
        consult.value.consultFlag = illness.consultFlag
        consult.value.pictures = illness.pictures
      }
      // 5. 修改患者函数
      const setPatinet = (id: string) => (consult.value.patientId = id)
      // 6. 修改优惠券函数
      const setCoupon = (id: string) => (consult.value.couponId = id)
      // 7. 清空信息
      const clear = () => {
        consult.value = {}
      }
      return {
        consult,
        setType,
        setIllnesType,
        setDep,
        setIllness,
        setPatinet,
        setCoupon,
        clear
      }
    }
  },
  {
    persist: true
  }
)
