export function getHeadsetForHMD(hmd: number) {
  const res = Object.getPrototypeOf(headset)
  return headset?.[hmd]?.name ?? null
}
export const headset = {
  256: {
    name: 'Quest 2',
    icon: 'oculus.svg',
    color:
      'invert(49%) sepia(26%) saturate(5619%) hue-rotate(146deg) brightness(93%) contrast(86%)',
    priority: 1,
  },
  512: {
    name: 'Quest 3',
    icon: 'meta.svg',
    color:
      'invert(49%) sepia(26%) saturate(5619%) hue-rotate(260deg) brightness(93%) contrast(86%)',
    priority: 2,
  },
  64: {
    name: 'Valve Index',
    icon: 'index.svg',
    color:
      'invert(81%) sepia(27%) saturate(6288%) hue-rotate(344deg) brightness(103%) contrast(103%)',
    priority: 2,
  },
  1: {
    name: 'Rift CV1',
    icon: 'oculus.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 3,
  },
  2: {
    name: 'Vive',
    icon: 'vive.svg',
    color:
      'invert(54%) sepia(78%) saturate(2598%) hue-rotate(157deg) brightness(97%) contrast(101%)',
    priority: 4,
  },
  60: {
    name: 'Pico 4',
    icon: 'piconeo.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 5,
  },
  61: {
    name: 'Quest Pro',
    icon: 'meta.svg',
    color: '',
    priority: 6,
  },
  8: {
    name: 'Windows Mixed Reality',
    icon: 'wmr.svg',
    color:
      'invert(34%) sepia(67%) saturate(7482%) hue-rotate(193deg) brightness(103%) contrast(101%)',
    priority: 7,
  },
  16: {
    name: 'Rift S',
    icon: 'oculus.svg',
    color:
      'invert(96%) sepia(9%) saturate(5456%) hue-rotate(170deg) brightness(100%) contrast(107%)',
    priority: 8,
  },
  65: {
    name: 'Controllable',
    icon: 'controllable.svg',
    color: '',
    priority: 8,
  },
  32: {
    name: 'Quest',
    icon: 'oculus.svg',
    color:
      'invert(73%) sepia(55%) saturate(5479%) hue-rotate(271deg) brightness(106%) contrast(107%)',
    priority: 9,
  },
  4: {
    name: 'Vive Pro',
    icon: 'vive.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 10,
  },
  35: {
    name: 'Vive Pro 2',
    icon: 'vive.svg',
    color:
      'invert(79%) sepia(68%) saturate(5755%) hue-rotate(232deg) brightness(90%) contrast(109%)',
    priority: 11,
  },
  128: {
    name: 'Vive Cosmos',
    icon: 'vive.svg',
    color:
      'invert(11%) sepia(100%) saturate(7426%) hue-rotate(297deg) brightness(85%) contrast(109%)',
    priority: 12,
  },
  36: {
    name: 'Vive Elite',
    icon: 'vive.svg',
    color:
      'invert(25%) sepia(89%) saturate(5057%) hue-rotate(278deg) brightness(108%) contrast(85%)',
    priority: 13,
  },
  47: {
    name: 'Vive Focus',
    icon: 'vive.svg',
    color:
      'invert(48%) sepia(91%) saturate(4410%) hue-rotate(340deg) brightness(94%) contrast(97%)',
    priority: 14,
  },
  38: {
    name: 'Pimax 8K',
    icon: 'pimax.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 15,
  },
  39: {
    name: 'Pimax 5K',
    icon: 'pimax.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 16,
  },
  40: {
    name: 'Pimax Artisan',
    icon: 'pimax.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 17,
  },
  33: {
    name: 'Pico Neo 3',
    icon: 'piconeo.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 18,
  },
  34: {
    name: 'Pico Neo 2',
    icon: 'piconeo.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 19,
  },
  41: {
    name: 'HP Reverb',
    icon: 'hp.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 20,
  },
  42: {
    name: 'Samsung WMR',
    icon: 'samsung.webp',
    color: '',
    priority: 21,
  },
  43: {
    name: 'Qiyu Dream',
    icon: 'iqiyi.webp',
    color: '',
    priority: 22,
  },
  45: {
    name: 'Lenovo Explorer',
    icon: 'lenovo.webp',
    color: '',
    priority: 23,
  },
  46: {
    name: 'Acer WMR',
    icon: 'acer.svg',
    color: '',
    priority: 24,
  },
  66: {
    name: 'Bigscreen Beyond',
    icon: 'bigscreen.svg',
    color: '',
    priority: 24,
  },
  67: {
    name: 'NOLO Sonic',
    icon: 'nolo.webp',
    color: '',
    priority: 24,
  },
  68: {
    name: 'Hypereal',
    icon: 'hypereal.jpg',
    color: '',
    priority: 24,
  },

  48: {
    name: 'Arpara',
    icon: 'arpara.webp',
    color: '',
    priority: 25,
  },
  49: {
    name: 'Dell Visor',
    icon: 'dell.svg',
    color: '',
    priority: 26,
  },
  55: {
    name: 'Huawei VR',
    icon: 'huawei.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 27,
  },
  56: {
    name: 'Asus WMR',
    icon: 'asus.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 28,
  },
  51: {
    name: 'Vive DVT',
    icon: 'vive.svg',
    color:
      'invert(69%) sepia(52%) saturate(501%) hue-rotate(107deg) brightness(98%) contrast(86%)',
    priority: 29,
  },
  52: {
    name: 'glasses20',
    icon: 'unknown.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 30,
  },
  53: {
    name: 'Varjo',
    icon: 'varjo.svg',
    color: '',
    priority: 14,
  },
  69: {
    name: 'Varjo Aero',
    icon: 'varjo.svg',
    color: '',
    priority: 14,
  },
  54: {
    name: 'Vaporeon',
    icon: 'unknown.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 32,
  },
  57: {
    name: 'Cloud XR',
    icon: 'unknown.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 33,
  },
  58: {
    name: 'VRidge',
    icon: 'unknown.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 34,
  },
  50: {
    name: 'e3',
    icon: 'unknown.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 35,
  },
  59: {
    name: 'Medion Eraser',
    icon: 'unknown.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 36,
  },

  37: {
    name: 'Miramar',
    icon: 'unknown.svg',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 37,
  },
  0: {
    name: 'Unknown headset',
    icon: 'unknown.svg',
    color:
      'invert(70%) sepia(65%) saturate(4492%) hue-rotate(354deg) brightness(96%) contrast(91%)',
    priority: 38,
  },
  44: {
    name: 'Disco',
    icon: 'disco.webp',
    color:
      'invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)',
    priority: 39,
  },
}
