export function createDistanceWeightFunction(
  bellWidth: number,
  steepnessPower: number
) {
  return {
    divider: -(2 * Math.pow(bellWidth, steepnessPower)),
    halfPower: steepnessPower / 2,
    getWeight: function (distance: number) {
      const sqr = distance * distance
      const expPower = Math.pow(sqr, this.halfPower) / this.divider
      return Math.exp(expPower)
    },
  }
}

export function createMinMaxCounter(
  clampMin: number,
  clampMax: number,
  step: number
) {
  return {
    minValue: 1e10,
    maxValue: -1e10,
    clampMin: clampMin,
    clampMax: clampMax,
    step: step,
    update: function (value: number) {
      let tmp = Math.floor(value / this.step) * this.step
      if (tmp < this.minValue) this.minValue = tmp
      tmp = Math.ceil(value / this.step) * this.step
      if (tmp > this.maxValue) this.maxValue = tmp

      if (this.minValue < this.clampMin) this.minValue = this.clampMin
      if (this.maxValue > this.clampMax) this.maxValue = this.clampMax
    },
  }
}
