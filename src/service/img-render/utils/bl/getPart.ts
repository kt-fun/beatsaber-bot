import { BeatLeaderUser } from '../../interfaces'

const DEFAULT_MAX_TECH_PP = 1300
const DEFAULT_MAX_ACC_PP = 15000
const DEFAULT_MAX_PASS_PP = 6000

const getPart = (playerInfo: BeatLeaderUser) => {
  const techPp = playerInfo.techPp
  const accPp = playerInfo.accPp
  const passPp = playerInfo.passPp
  const techScale =
    techPp > DEFAULT_MAX_TECH_PP ? techPp / DEFAULT_MAX_TECH_PP : 1
  const accScale = accPp > DEFAULT_MAX_ACC_PP ? accPp / DEFAULT_MAX_ACC_PP : 1
  const passScale =
    passPp > DEFAULT_MAX_PASS_PP ? passPp / DEFAULT_MAX_PASS_PP : 1
  const triangleScale = Math.max(techScale, Math.max(accScale, passScale))

  const maxTechPp = DEFAULT_MAX_TECH_PP * triangleScale
  const maxAccPp = DEFAULT_MAX_ACC_PP * triangleScale
  const maxPassPp = DEFAULT_MAX_PASS_PP * triangleScale

  const totalNormalizedPp =
    techPp * (maxAccPp / maxTechPp) + accPp + passPp * (maxAccPp / maxPassPp)
  const normalizedTechPp = techPp / maxTechPp
  const normalizedAccPp = accPp / maxAccPp
  const normalizedPassPp = passPp / maxPassPp

  const techPpPart = (techPp * (maxAccPp / maxTechPp)) / totalNormalizedPp
  const accPpPart = accPp / totalNormalizedPp
  const passPpPart = (passPp * (maxAccPp / maxPassPp)) / totalNormalizedPp

  return {
    techPpPart,
    accPpPart,
    passPpPart,
  }
}

export default getPart
