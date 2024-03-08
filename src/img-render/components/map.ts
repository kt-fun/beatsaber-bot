import {defineComponent, PropType} from "vue";
import {BSMap} from "../../types";
import Icon from "./icon";
import {formatDuration, formatTime, formatNumber, getTag} from "../utils";
import CharacteristicIcon from "./charactersIcon";
import Progress from "./progress";
export default defineComponent({
  methods: {getTag, formatTime, formatDuration, formatNumber},
  components: {
    CharacteristicIcon,
    Icon,
    Progress
  },
  props: {
    bsmap: {
      type: Object as PropType<BSMap>,
      required: true
    }
  },
  setup(props, ctx) {

    const bg = "https://www.loliapi.com/acg/pe/"
    return {
      bsmap: props.bsmap,
      bg
    }
  },
  template: `
      <div :id="bsmap.id" class="flex flex-col bg-slate-100 justify-center items-center">
            <div class="h-auto w-[300px] rounded-lg"
                 :style="{
                    backgroundImage: 'url(\\'https://www.loliapi.com/acg/pe/\\')',
                    backgroundSize: 'cover',
                 }"
            >
              <div class="bg-blend-darken bg-black/[.8]  text-white h-full rounded-lg">
                <img :src="bsmap.versions[0].coverURL" class="rounded-lg  w-[300px]"/>
                <div class="flex items-center justify-center w-full h-full flex-col">

                  <div class="p-4">
                    <div class="text-ellipsis  line-clamp-2">
                      <span class="text-ellipsis  line-clamp-2 text-xl font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
                      {{ bsmap.name }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="author flex space-x-4 items-center ">
                        <img :src="bsmap.uploader.avatar" class="rounded-full w-8 h-8"/>
                        <span class="text-xl">{{ bsmap.uploader.name }}</span>
                      </div>
                    </div>
                    <div class="meta  flex space-x-4 text-xs py-2 items-center">
                      <div class="flex space-x-1 items-center justify-between">
                        <Icon :size="12" name="HeartPulse" class="w-3 h-3"/>
                        <span>{{ bsmap.metadata.bpm }}</span>
                      </div>
                      <div class="flex space-x-1 items-center justify-between">
                        <Icon :size="12" name="Clock3" class="w-3 h-3"/>
                        <span>{{formatDuration(bsmap.metadata.duration)}}</span>
                      </div>
                      <div class="flex space-x-1 items-center justify-between">
                        <Icon :size="12" name="Key" class="w-3 h-3"/>
                        <span class="font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
                          {{bsmap.id}}
                        </span>
                      </div>
                      <div class="flex space-x-2 text-xs">
                            <Icon  name="Calendar" :size="12" class="w-3 h-3"/>
                            <span>{{formatTime(bsmap.lastPublishedAt)}}</span>
                          </div>
                    </div>
                    <div class="tags flex flex-wrap justify-start">
                      <span
                        v-for="item in bsmap.tags?.sort(((a,b)=>b.length - a.length))??[]"
                        :key="item"
                        class="text-xs mx-1 text-white bg-red-500 rounded px-1"
                      >
                        {{ getTag(item) }}
                      </span>
                    </div>
                    <div class="flex space-x-2">
                      <div class="percentage w-42 py-2 flex text-xs items-center space-x-4">
                        <Progress :value="bsmap.stats.score * 100"/>
                        <span>{{ (bsmap.stats.score * 100).toFixed(1) }}%</span>
                      </div>
                      <div class="flex space-x-1 items-center text-xs">
                        <span><Icon :size="12" name="ThumbsUp" className="h-3 w-3"/></span>
                        <span>{{ formatNumber(bsmap.stats.upvotes) }}</span>
                      </div>
                      <div class="flex space-x-1 items-center text-xs">
                        <span><Icon :size="12" name="ThumbsDown" className="h-3 w-3" /></span>
                        <span>{{ formatNumber(bsmap.stats.downvotes) }}</span>
                      </div>
                    </div>
                    <span class="font-bold">难度</span>
                    <div class="grid grid-cols-2">
                      <div v-for="diff in bsmap.versions[0].diffs" :key="diff.difficulty+diff.characteristic" class="text-xs flex space-x-1">
                        <span class="h-3 w-3 shrink-0"><CharacteristicIcon :characteristic="diff.characteristic"/></span>
                        <span>{{diff.difficulty}}</span>
                        <span>{{(diff.nps).toFixed(2)}}</span>
                      </div>
                    </div>

                    <span class="font-bold">描述</span>
                    <p class="text-xs">
                      {{bsmap.description}}
                    </p>
                  </div>

                </div>
              </div>
            </div>
      </div>
  `
})
