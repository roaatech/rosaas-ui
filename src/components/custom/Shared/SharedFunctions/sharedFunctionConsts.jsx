export const arraysEqual = (arr1, arr2) => {
  if (arr1 && arr1.length !== arr2 && arr2.length) return false

  for (let i = 0; i < arr1 && arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }

  return true
}
