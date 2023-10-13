// number
export function useNumber (number) { 
  let regExp = /^[0-9]+$/;
  if(!regExp.test(String(number))) return 0
  return Number(number)
}