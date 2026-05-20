import os
import subprocess
import numpy as np
from PIL import Image

def main():
    video_path = "/home/Zarchy/projekakhir/Frontend/src/app/dashboard/2026-05-20-22-54-54.mp4"
    
    # We will extract 30 frames at 120fps starting at 0.3s.
    # 0.3s at 120fps is frame 36. Let's extract 15 frames starting at frame 36.
    # We'll use ffmpeg to pipe the frames.
    sample_fps = 120
    ffmpeg_cmd = [
        "ffmpeg", "-y", "-ss", "0.3", "-i", video_path,
        "-vframes", "15",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"
    ]
    
    proc = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    frame_size = 1920 * 1080 * 3
    
    frames = []
    while True:
        raw_data = proc.stdout.read(frame_size)
        if not raw_data or len(raw_data) < frame_size:
            break
        # Convert to gray scale for simplicity
        img = np.frombuffer(raw_data, dtype=np.uint8).reshape((1080, 1920, 3))
        gray = 0.2989 * img[:,:,0] + 0.5870 * img[:,:,1] + 0.1140 * img[:,:,2]
        frames.append(gray)
        
    proc.wait()
    print(f"Read {len(frames)} frames for analysis")
    
    crop_x1, crop_x2 = 800, 1100
    crop_y1, crop_y2 = 200, 500
    
    for i in range(len(frames) - 1):
        prev = frames[i][crop_y1:crop_y2, crop_x1:crop_x2]
        curr = frames[i+1][crop_y1:crop_y2, crop_x1:crop_x2]
        
        # Test vertical shifts from -15 to 15 pixels
        min_diff = float('inf')
        best_dy = 0
        for dy in range(-15, 16):
            if dy < 0:
                diff = np.mean(np.abs(prev[-dy:] - curr[:dy]))
            elif dy > 0:
                diff = np.mean(np.abs(prev[:-dy] - curr[dy:]))
            else:
                diff = np.mean(np.abs(prev - curr))
            if diff < min_diff:
                min_diff = diff
                best_dy = dy
        print(f"Frame {i} -> {i+1}: Best vertical pixel displacement (dy): {best_dy} pixels (min diff: {min_diff:.2f})")

if __name__ == "__main__":
    main()
