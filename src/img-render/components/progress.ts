import {computed, defineComponent} from "vue";
import { ProgressIndicator, ProgressRoot } from 'radix-vue'
export default defineComponent({
  components: {
    ProgressIndicator,
    ProgressRoot
  },
  props: {
    value: Number
  },
  setup(props, ctx) {
      const style = computed(()=>{
        return `transform:translateX(-`+(100-props.value)+`%)`
      })
      return {
        style,
        value: props.value
      }
  },
  template:`
  <ProgressRoot v-model="value" class="relative overflow-hidden rounded-full min-w-24 w-36 max-w-48 h-2 bg-gray-100">
    <ProgressIndicator
      className=" h-2 rounded-full bg-gradient-to-r from-red-500 to-blue-500"
      :style="style"
    />
  </ProgressRoot>
`
})
