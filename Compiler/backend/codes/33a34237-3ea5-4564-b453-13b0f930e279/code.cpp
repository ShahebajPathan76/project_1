#include <iostream>
using namespace std;


// Write your code here
int main() {
    int x;
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= 5; j++) {
            cin >> x;
            if (x == 1) {
                cout << abs(i - 3) + abs(j - 3) << endl;
            }
        }
    }
    return 0;
}



