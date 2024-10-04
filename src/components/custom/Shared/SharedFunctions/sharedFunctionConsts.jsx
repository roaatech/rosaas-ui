export const arraysEqual = (arr1, arr2) => {
  if (
    !Array.isArray(arr1) ||
    !Array.isArray(arr2) ||
    arr1.length !== arr2.length
  ) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i]
    const obj2 = arr2[i]

    if (obj1.field !== obj2.field || obj1.value !== obj2.value) {
      return false
    }
  }

  return true
}
