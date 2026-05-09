import curses
import time

def main(stdscr):
    # Setup the screen and cursor
    curses.curs_set(0)
    stdscr.nodelay(1)
    stdscr.timeout(100)
    sh, sw = stdscr.getmaxyx()

    # Initial positions
    p1_y, p2_y = sh // 2, sh // 2
    ball_y, ball_x = sh // 2, sw // 2
    dy, dx = 1, 1
    p1_score, p2_score = 0, 0

    while True:
        stdscr.clear()
        
        # Draw paddles and ball
        stdscr.addstr(p1_y, 2, "█")
        stdscr.addstr(p2_y, sw - 3, "█")
        stdscr.addstr(ball_y, ball_x, "●")
        stdscr.addstr(0, sw // 2 - 5, f"{p1_score} | {p2_score}")

        # Handle input
        key = stdscr.getch()
        if key == ord('q'): break
        if key == ord('w') and p1_y > 0: p1_y -= 1
        if key == ord('s') and p1_y < sh - 1: p1_y += 1
        if key == curses.KEY_UP and p2_y > 0: p2_y -= 1
        if key == curses.KEY_DOWN and p2_y < sh - 1: p2_y += 1

        # Move ball
        ball_y += dy
        ball_x += dx

        # Wall collisions (top/bottom)
        if ball_y <= 0 or ball_y >= sh - 1:
            dy *= -1

        # Paddle collisions
        if ball_x == 3 and ball_y == p1_y:
            dx *= -1
        elif ball_x == sw - 4 and ball_y == p2_y:
            dx *= -1

        # Scoring
        if ball_x <= 0:
            p2_score += 1
            ball_y, ball_x = sh // 2, sw // 2
        elif ball_x >= sw - 1:
            p1_score += 1
            ball_y, ball_x = sh // 2, sw // 2

        stdscr.refresh()

if __name__ == "__main__":
    curses.wrapper(main)
