#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<pair<int, int>> mergeIntervals(vector<pair<int, int>>& intervals) {
    if (intervals.empty()) return {};

    // Sort by the start of intervals
    sort(intervals.begin(), intervals.end());
    vector<pair<int, int>> merged;
    
    merged.push_back(intervals[0]);
    for (size_t i = 1; i < intervals.size(); ++i) {
        if (merged.back().second >= intervals[i].first) {
            // Overlapping intervals, merge them
            merged.back().second = max(merged.back().second, intervals[i].second);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> intervals(n);
    for (int i = 0; i < n; ++i) {
        cin >> intervals[i].first >> intervals[i].second;
    }

    vector<pair<int, int>> result = mergeIntervals(intervals);
    for (auto& p : result) {
        cout << p.first << " " << p.second << " ";
    }
    cout << endl;
    return 0;
}
