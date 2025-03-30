function twoSumHashTable(arr, target) {
  let m = {};
  for (let i = 0; i < arr.length; i++) {
    if (m[target - arr[i]] != undefined) {
      return [m[target - arr[i]], i];
    }
    m[arr[i]] = i;
  }
}
console.log('🚀 ~ twoSumHashTable([1, 2, 3], 5):', twoSumHashTable([1, 2, 3], 5));
