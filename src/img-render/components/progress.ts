import {defineComponent} from "vue";
export default defineComponent({
  props: {
    value: Number
  },
  setup(props, ctx) {
      return {
        value: props.value
      }
  },
  template:`
    <progress
      class="[&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-bar]:h-2 [&::-webkit-progress-value]:from-blue-300 [&::-webkit-progress-value]:to-red-300 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gradient-to-r  [&::-webkit-progress-bar]:bg-gray-100"
      max="100"
      :value="value"/>
`
})
