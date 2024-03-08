import {defineComponent,defineProps} from "vue";
import { computed } from 'vue';
import * as icons from "lucide-vue-next";

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    size: Number,
    color: String,
    strokeWidth: Number,
    defaultClass: String
  },
  setup(props) {
    const icon = computed(() => icons[props.name]);
    return {
      icon,
      ...props
    }
  },

  template:`
    <component
      :is="icon"
      :size="size"
      :color="color"
      :stroke-width="strokeWidth" :default-class="defaultClass"
    />
  `
})
