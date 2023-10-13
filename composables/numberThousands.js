// 千分位
export function useNumberThousands (number) { 
  return String(number).replace( /(\d)(?=(?:\d{3})+$)/g, '$1,')
}