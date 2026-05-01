export interface Footprint {
  id: string
  title: string
  description: string
  lng: number
  lat: number
  fromLng?: number
  fromLat?: number
  date: string
  image?: string
}

export const footprints: Footprint[] = [
  {
    id: '1',
    title: '北京',
    description: '从故宫到国贸，历史与现代在同一条中轴线上碰撞。',
    lng: 116.4074,
    lat: 39.9042,
    fromLng: 104.0665, // 从成都出发
    fromLat: 30.5723,
    date: '2021-10-01',
    image:
      'https://images.unsplash.com/photo-1508804185872-d7bade9babe3?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '2',
    title: '上海',
    description: '外滩的霓虹闪烁着这座不夜城的繁华，陆家嘴的天际线展现着未来的脉动。',
    lng: 121.4737,
    lat: 31.2304,
    fromLng: 116.4074, // 从北京出发
    fromLat: 39.9042,
    date: '2022-05-18',
    image:
      'https://images.unsplash.com/photo-1548248823-ce16a73b6dd5?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    title: '成都，四川',
    description: '在人民公园喝碗盖碗茶，夜晚的九眼桥是属于这座城独有的赛博市井气。',
    lng: 104.0665,
    lat: 30.5723,
    fromLng: 108.9398, // 从西安出发
    fromLat: 34.3416,
    date: '2023-08-12',
    image:
      'https://images.unsplash.com/photo-1594411136018-8f55e0c5a278?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    title: '广州，广东',
    description: '珠江新城的夜景与老城区的早茶交相辉映，烟火气与现代感在此完美融合。',
    lng: 113.2644,
    lat: 23.1291,
    fromLng: 104.0665, // 从成都出发
    fromLat: 30.5723,
    date: '2023-11-20',
    image:
      'https://images.unsplash.com/photo-1583248352195-d3a8e766edf2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '5',
    title: '西安，陕西',
    description: '十三朝古都，大雁塔下的长安风情仿佛能让人轻易穿越回盛唐。',
    lng: 108.9398,
    lat: 34.3416,
    fromLng: 112.9823, // 从长沙出发
    fromLat: 28.1941,
    date: '2024-04-05',
    image:
      'https://images.unsplash.com/photo-1625904944810-74cc2989de18?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '6',
    title: '深圳，广东',
    description: '这座年轻的创新之都，每时每刻都在上演着科技与未来的激情碰撞。',
    lng: 114.0579,
    lat: 22.5431,
    fromLng: 113.2644, // 从广州出发
    fromLat: 23.1291,
    date: '2024-09-10',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '7',
    title: '长沙，湖南',
    description: '橘子洲头的晚风与坡子街的夜市，一起体会属于星城不眠的青春火热。',
    lng: 112.9823,
    lat: 28.1941,
    fromLng: 121.4737, // 从上海出发
    fromLat: 31.2304,
    date: '2025-05-01',
    image:
      'https://images.unsplash.com/photo-1616086705601-3e408dbea7c1?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '8',
    title: '东京，日本',
    description: '在秋叶原朝圣，夜晚的霓虹灯让人迷失在赛博朋克的初夏梦境中。',
    lng: 139.6917,
    lat: 35.6895,
    fromLng: 121.4737, // 从上海出发
    fromLat: 31.2304,
    date: '2024-04-12',
    image:
      'https://images.unsplash.com/photo-1542051812899-222a00accab1?q=80&w=600&auto=format&fit=crop',
  },
]
