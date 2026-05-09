#include <iostream>
#include <sys/ioctl.h>
#include <termios.h>
#include <unistd.h>
#include <fcntl.h>

using namespace std;

// Konfigurasi Game
const int lebar = 40, tinggi = 20;
int bolaX, bolaY, bolaDX, bolaDY;
int pad1Y, pad2Y;
int skor1, skor2;
bool gameRunning = true;

// Fungsi untuk membaca keyboard tanpa Enter di Linux
int kbhit() {
    struct termios oldt, newt;
    int ch, oldf;
    tcgetattr(STDIN_FILENO, &oldt);
    newt = oldt;
    newt.c_lflag &= ~(ICANON | ECHO);
    tcsetattr(STDIN_FILENO, TCSANOW, &newt);
    oldf = fcntl(STDIN_FILENO, F_GETFL, 0);
    fcntl(STDIN_FILENO, F_SETFL, oldf | O_NONBLOCK);
    ch = getchar();
    tcsetattr(STDIN_FILENO, TCSANOW, &oldt);
    fcntl(STDIN_FILENO, F_SETFL, oldf);
    if(ch != EOF) { ungetc(ch, stdin); return 1; }
    return 0;
}

void Setup() {
    bolaX = lebar / 2; bolaY = tinggi / 2;
    bolaDX = 1; bolaDY = 1;
    pad1Y = pad2Y = tinggi / 2;
    skor1 = skor2 = 0;
}

void Gambar() {
    // Escape sequence untuk membersihkan layar dan reset kursor
    cout << "\033[H"; 
    
    for (int i = 0; i < lebar + 2; i++) cout << "#";
    cout << endl;

    for (int i = 0; i < tinggi; i++) {
        for (int j = 0; j < lebar; j++) {
            if (j == 0) cout << "#"; // Tembok kiri

            if (i == bolaY && j == bolaX) cout << "O"; // Bola
            else if (j == 1 && i >= pad1Y - 1 && i <= pad1Y + 1) cout << "|"; // Paddle 1
            else if (j == lebar - 2 && i >= pad2Y - 1 && i <= pad2Y + 1) cout << "|"; // Paddle 2
            else cout << " ";

            if (j == lebar - 1) cout << "#"; // Tembok kanan
        }
        cout << endl;
    }

    for (int i = 0; i < lebar + 2; i++) cout << "#";
    cout << "\nSkor: P1 [" << skor1 << "] - [" << skor2 << "] P2" << endl;
    cout << "W/S: P1 | Arrow Up/Down: P2 | Q: Keluar" << endl;
}

void Input() {
    if (kbhit()) {
        char key = getchar();
        switch (key) {
            case 'w': if (pad1Y > 1) pad1Y--; break;
            case 's': if (pad1Y < tinggi - 2) pad1Y++; break;
            case 'A': if (pad2Y > 1) pad2Y--; break; // Arrow Up
            case 'B': if (pad2Y < tinggi - 2) pad2Y++; break; // Arrow Down
            case 'q': gameRunning = false; break;
        }
    }
}

void Logika() {
    bolaX += bolaDX;
    bolaY += bolaDY;

    // Pantulan Atas/Bawah
    if (bolaY <= 0 || bolaY >= tinggi - 1) bolaDY *= -1;

    // Pantulan Paddle 1
    if (bolaX == 2 && bolaY >= pad1Y - 1 && bolaY <= pad1Y + 1) bolaDX *= -1;

    // Pantulan Paddle 2
    if (bolaX == lebar - 3 && bolaY >= pad2Y - 1 && bolaY <= pad2Y + 1) bolaDX *= -1;

    // Skor
    if (bolaX <= 0) { skor2++; bolaX = lebar/2; bolaY = tinggi/2; bolaDX *= -1; }
    if (bolaX >= lebar - 1) { skor1++; bolaX = lebar/2; bolaY = tinggi/2; bolaDX *= -1; }
}

int main() {
    // Sembunyikan kursor
    cout << "\033[?25l";
    Setup();
    while (gameRunning) {
        Gambar();
        Input();
        Logika();
        usleep(50000); // Delay 50ms agar tidak terlalu cepat
    }
    // Tampilkan kembali kursor saat keluar
    cout << "\033[?25h";
    return 0;
}
