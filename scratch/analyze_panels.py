import os
import subprocess
import numpy as np
from PIL import Image

def main():
    video_path = "/home/Zarchy/projekakhir/Frontend/src/app/dashboard/2026-05-20-22-54-54.mp4"
    
    # We will sample frames at 15 fps and find the sharpest horizontal edges that represent panel split lines.
    sample_fps = 15.0
    ffmpeg_cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vf", "fps=15",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"
    ]
    
    proc = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    frame_size = 1920 * 1080 * 3
    
    frame_idx = 0
    trajectories = []
    
    while True:
        raw_data = proc.stdout.read(frame_size)
        if not raw_data or len(raw_data) < frame_size:
            break
        
        # Convert frame to numpy array
        img = np.frombuffer(raw_data, dtype=np.uint8).reshape((1080, 1920, 3))
        
        # Compute horizontal row differences (gradient along vertical direction)
        # We can sum/mean along the width (axis 1) of the absolute differences
        diffs = np.mean(np.abs(img[1:].astype(float) - img[:-1].astype(float)), axis=(1, 2))
        
        # Let's filter diffs to find peaks.
        # We ignore boundaries near the header (top 60px) and footer (bottom 60px)
        diffs[:60] = 0
        diffs[-60:] = 0
        
        peaks = []
        # Find peaks that have a local maximum and are above a threshold
        for y in range(10, 1070):
            if diffs[y] > 15 and diffs[y] == max(diffs[max(0, y-15):min(1079, y+16)]):
                peaks.append((y, diffs[y]))
                
        # Sort by peak value and keep top 4 peaks
        peaks = sorted(peaks, key=lambda x: x[1], reverse=True)[:4]
        # Sort by Y coordinate
        peaks_y = sorted([p[0] for p in peaks])
        
        trajectories.append((frame_idx, frame_idx / sample_fps, peaks_y))
        frame_idx += 1
        
    proc.wait()
    
    # Let's print the trajectories where peaks are active
    print(f"Total analyzed frames: {len(trajectories)}")
    print("Frame index | Time (s) | Split Lines (Y coordinates)")
    print("-" * 50)
    for idx, t, peaks in trajectories:
        # Only print frames where we detect at least one split line in the middle
        if len(peaks) > 0:
            print(f"{idx:11d} | {t:8.2f}s | {peaks}")

if __name__ == "__main__":
    main()
