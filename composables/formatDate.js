export function useFormatDate (date, comma) { 
  return `${date.getFullYear()}${comma}${date.getMonth() + 1 < 10  ? '0' : '' }${date.getMonth() + 1}${comma}${date.getDate() < 10  ? '0' : '' }${date.getDate()}` 
}