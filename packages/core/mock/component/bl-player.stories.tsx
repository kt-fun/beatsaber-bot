// @ts-ignore
import BLPlayerPage from '../../src/components/pages/bl-player'
import { beatleaderScores } from '../bl-score'
import { blUser } from '../bl-user'

export default {
  component: BLPlayerPage,
}

export const BLPlayerPageStory = {
  args: {
    beatleaderItems: beatleaderScores,
    user: blUser,
    bg: 'https://loliapi.com/acg/pc',
  },
}
