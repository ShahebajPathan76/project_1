#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void nextPermutation(vector<int>& arr) {
    int n = arr.size();
    int i = n - 2;

    // Step 1: Find the first decreasing element from the end
    while (i >= 0 && arr[i] >= arr[i + 1]) {
        i--;
    }

    if (i >= 0) {
        // Step 2: Find the element just greater than arr[i]
        int j = n - 1;
        while (arr[j] <= arr[i]) {
            j--;
        }
        swap(arr[i], arr[j]); // Step 3: Swap
    }

    // Step 4: Reverse the suffix starting at i+1
    reverse(arr.begin() + i + 1, arr.end());
}

int main() {
    vector<int> arr = {2, 4, 1, 7, 5, 0};

    nextPermutation(arr);

    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    return 0;
}
