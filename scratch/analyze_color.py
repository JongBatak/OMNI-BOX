import os
import subprocess
import numpy as np
from PIL import Image

def main():
    video_path = "/home/Zarchy/projekakhir/Frontend/src/app/dashboard/2026-05-20-22-54-54.mp4"
    
    # Extract one frame in the middle (t = 8.0s) and inspect its borders
    cmd = [
        "ffmpeg", "-y", "-ss", "8.0", "-i", video_path,
        "-vframes", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw_data = proc.stdout.read(1920 * 1080 * 3)
    proc.wait()
    
    if len(raw_data) == 1920 * 1080 * 3:
        img = np.frombuffer(raw_data, dtype=np.uint8).reshape((1080, 1920, 3))
        
        # Check colors at the left column (x = 0) and right column (x = 1919)
        left_col = img[:, 0, :]
        right_col = img[:, 1919, :]
        
        left_mean = np.mean(left_col, axis=1)
        right_mean = np.mean(right_col, axis=1)
        
        # Check if left or right borders are black (mean < 5 for instance)
        is_left_black = np.all(left_mean < 5)
        is_right_black = np.all(right_mean < 5)
        
        print(f"Left edge is black: {is_left_black} (average brightness: {np.mean(left_mean):.2f})")
        print(f"Right edge is black: {is_right_black} (average brightness: {np.mean(right_mean):.2f})")
        
        # Print a sample of brightness along the top, middle and bottom rows
        print(f"Top row mean: {np.mean(img[0, :, :]):.2f}")
        print(f"Middle row mean: {np.mean(img[540, :, :]):.2f}")
        print(f"Bottom row mean: {np.mean(img[1079, :, :]):.2f}")
        
    else:
        print("Error: Could not extract frame.")

if __name__ == "__main__":
    main()
