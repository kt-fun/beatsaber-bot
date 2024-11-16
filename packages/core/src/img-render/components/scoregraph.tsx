import { processAccGraphs, processUnderswings } from '../utils/bl/bsorReplayAcc'
import {
  createDistanceWeightFunction,
  createMinMaxCounter,
} from '../utils/bl/beatleader'
import getStatistic from '../utils/bl/stastic'
import Chart from 'chart.js/auto'
import { canvasHelper } from '../utils/canvas'
import { BSOR, Score } from '@/api/interfaces/beatleader'

export function formatNumber(
  num: number,
  digits = 2,
  addSign = false,
  notANumber = null
) {
  if (!Number.isFinite(num)) {
    return notANumber
  }

  return (
    (addSign && num > 0 ? '+' : '') +
    num.toLocaleString('zh-CN', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  )
}

function timeToLabel(time: any) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return minutes + ':' + seconds.toString().padStart(2, '0')
}

function processChartData(
  chartData: any,
  resolution: any,
  smoothPeriodPercentage: any,
  weightFunctionSteepness: any
) {
  const data = [] as any[]
  if (chartData.length === 0 || resolution === 0) return data

  const songDuration = chartData[chartData.length - 1][1]
  const distanceWeightFunction = createDistanceWeightFunction(
    songDuration * smoothPeriodPercentage,
    weightFunctionSteepness
  )

  for (let i = 0.0; i < resolution; i += 1.0) {
    const songTime = (songDuration * i) / (resolution - 1)

    let sum = 0
    let divider = 0

    for (let j = 0.0; j < chartData.length; j += 1.0) {
      const item = chartData[j]
      const weight = distanceWeightFunction.getWeight(item[1] - songTime)

      sum += item[0] * weight
      divider += weight
    }

    if (divider === 0) continue
    const value = 100 + (sum / divider) * 15
    data.push(value)
  }

  return data
}

// get score Statics
export default function ScoreGraph({
  scoreId,
  scoreInfo,
  statistic,
  bsor,
  height,
  width,
}: {
  scoreId: number
  scoreInfo: Score
  statistic: any
  bsor: BSOR
  height: number
  width: number
}) {
  // 400 192
  const canvas = canvasHelper.createCanvas(width * 4, height * 4)

  const setupChart = (
    canvas: any,
    chartData: any,
    underswingsData: any,
    beatSavior: any
  ) => {
    if (!canvas || !chartData || !Object.keys(chartData).length) return

    const title =
      underswingsData?.noUnderswingsScore > underswingsData?.score
        ? `Lost by underswings: ${formatNumber(underswingsData.noUnderswingsScore - underswingsData.score, 0)}pts, ${formatNumber(
            underswingsData.noUnderswingsAcc - underswingsData.acc,
            2
          )}% acc` +
          (underswingsData?.noUnderswingsPp &&
          underswingsData?.noUnderswingsPp > underswingsData?.pp
            ? `, ${formatNumber(underswingsData.noUnderswingsPp - underswingsData.pp, 2)}pp`
            : '')
        : null

    const labels = chartData.times.map(timeToLabel)

    const minMaxCounter = createMinMaxCounter(0, 115, 1.0)

    const hands = [] as any
    if (beatSavior?.stats?.accLeft) {
      hands.push('red')
    }
    if (beatSavior?.stats?.accRight) {
      hands.push('blue')
    }
    if (hands.length == 2) {
      hands.push('total')
    }

    for (let i = 0; i < chartData.times.length; i++) {
      hands.forEach((saberType: any) => {
        minMaxCounter.update(chartData.realScoreBySaber[saberType][i])
        minMaxCounter.update(chartData.fullSwingBySaber[saberType][i])
      })
    }
    let datasets = [] as any[]
    if (beatSavior?.stats?.accLeft) {
      datasets.push({
        yAxisID: 'score',
        label: 'Accuracy (left)',
        data: chartData.fullSwingBySaber.red,
        type: 'line',
        borderColor: '#ee5555',
        backgroundColor: '#ee5555',
        borderWidth: 8,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        spanGaps: true,
        order: 3,
      })
      datasets.push({
        yAxisID: 'score',
        label: 'Underswing (left)',
        data: chartData.realScoreBySaber.red,
        type: 'line',
        fill: '-1',
        borderColor: '#ee555555',
        backgroundColor: '#ee555555',
        borderWidth: 2,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        spanGaps: true,
        order: 4,
      })
    }

    if (beatSavior?.stats?.accRight) {
      datasets.push({
        yAxisID: 'score',
        label: 'Accuracy (right)',
        data: chartData.fullSwingBySaber.blue,
        type: 'line',
        borderColor: '#5555ee',
        backgroundColor: '#5555ee',
        borderWidth: 8,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        spanGaps: true,
        order: 5,
      })
      datasets.push({
        yAxisID: 'score',
        label: 'Underswing (right)',
        data: chartData.realScoreBySaber.blue,
        type: 'line',
        fill: '-1',
        borderColor: '#5555ee55',
        backgroundColor: '#5555ee55',
        borderWidth: 2,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        spanGaps: true,
        order: 6,
      })
    }

    datasets = datasets.concat([
      {
        yAxisID: 'score',
        label: 'Accuracy',
        data: chartData.fullSwingBySaber.total,
        type: 'line',
        borderColor: 'white',
        backgroundColor: 'white',
        borderWidth: 8,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        spanGaps: true,
        order: 1,
      },
      {
        yAxisID: 'score',
        label: 'Underswing',
        data: chartData.realScoreBySaber.total,
        type: 'line',
        fill: '-1',
        borderColor: '#aaaaaa55',
        backgroundColor: '#aaaaaa55',
        borderWidth: 2,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        spanGaps: true,
        order: 2,
      },
      {
        yAxisID: 'score',
        label: 'Score',
        data: chartData.realScoreBySaber.total,
        type: 'line',
        borderColor: '#aaaaaa',
        backgroundColor: '#aaaaaa',
        borderWidth: 8,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        spanGaps: true,
        order: 0,
      },
    ])

    new Chart(canvas, {
      data: { labels, datasets },
      options: {
        responsive: false,
        devicePixelRatio: 1,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: !!title?.length,
            text: title as any,
            color: 'white',
            font: {
              weight: 'normal',
              size: 60,
            },
            position: 'bottom',
            padding: { top: 5, bottom: 0 },
          },
          tooltip: {
            callbacks: {
              title(tooltipItems) {
                const item = tooltipItems[0]
                const labels = item.chart.data.labels as any[]
                return labels[item.dataIndex] + ' (10 seconds average)'
              },
              label(ctx: any) {
                const datasetLabel = ctx.dataset.label

                let percentage
                let value

                switch (datasetLabel) {
                  case 'Underswing (left)':
                    value =
                      ctx.raw - chartData.fullSwingBySaber.red[ctx.dataIndex]
                    percentage = value / 115.0
                    return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`
                  case 'Underswing (right)':
                    value =
                      ctx.raw - chartData.fullSwingBySaber.blue[ctx.dataIndex]
                    percentage = value / 115.0
                    return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`
                  case 'Underswing':
                    value =
                      ctx.raw - chartData.fullSwingBySaber.total[ctx.dataIndex]
                    percentage = value / 115.0
                    return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`
                  case 'Score':
                    value = ctx.raw
                    percentage = value / 115.0
                    return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`
                  default:
                    value = ctx.raw
                    percentage = value / 115.0
                    return `${datasetLabel}: ${formatNumber(value - 100.0, 1)} (${formatNumber(percentage * 100, 2)}%)`
                }
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              autoSkipPadding: 4,
              color: 'white',
              font: {
                weight: 'normal',
                size: 60,
              },
            },
          },
          y: {
            display: true,
            min: minMaxCounter.minValue,
            max: minMaxCounter.maxValue,
            ticks: {
              autoSkip: true,
              autoSkipPadding: 4,
              color: 'white',
              font: {
                weight: 'normal',
                size: 60,
              },
            },
          },
          score: {
            display: false,
            min: minMaxCounter.minValue,
            max: minMaxCounter.maxValue,
            ticks: {
              autoSkip: true,
              autoSkipPadding: 4,
              color: 'white',
            },
          },
        },
      },
    })
  }
  const beatSavior = getStatistic(scoreInfo, scoreId, statistic)
  const replayAccGraphs = processAccGraphs(bsor)
  const underswingsData = processUnderswings(bsor)
  setupChart(canvas, replayAccGraphs, underswingsData, beatSavior)
  const dataURL = canvasHelper.canvasToDataURL(canvas)
  return (
    <>
      <div>
        {/*style={{ height: '12em' }}*/}
        <img src={dataURL} width={width} height={height} />
      </div>
    </>
  )
}
