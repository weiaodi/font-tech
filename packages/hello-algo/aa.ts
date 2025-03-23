function binarySearch1<T>(arr: T[], target: T): number {
  let left: number = 0
  let right: number = arr.length - 1
  while (left <= right) {
    const mid: number = left + Math.floor((right - left) / 2)
    if (arr[mid] === target) {
      return mid
    }
    if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
}
binarySearch1([1], 1)
