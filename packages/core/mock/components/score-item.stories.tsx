import ScoreItem, {getScorePropsBySSScore, getScorePropsByBLScore} from '@/components/components/score-item'
import {beatleaderScores} from "../bl-score";
import {ssScores} from "../ss-score";

export default {
  title: 'Components/ScoreItem',
  component: ScoreItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    difficulty: {
      options: ['E', 'N', 'H', 'EX', 'EX+'],
      control: { type: 'select' },
    }
  }
};

export const BeatLeaderScore = {
  args: getScorePropsByBLScore(beatleaderScores[0] as any),
};

export const ScoreSaberScore = {
  args: getScorePropsBySSScore(ssScores[0]),
};
