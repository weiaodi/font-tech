function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = parseInt(left + (right - left) / 2);
    if (arr[mid] > target) {
      left = mid + 1;
    } else if (arr[mid] < target) {
      right = mid - 1;
    } else {
      return mid;
    }
  }
}

function hashSearch(arr, target) {
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (obj[target - arr[i]] !== undefined) {
      return [i, obj[target - arr[i]]];
    }
    obj[arr[i]] = i;
  }
  return [];
}
