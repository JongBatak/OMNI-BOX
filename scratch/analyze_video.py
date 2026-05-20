import os
import subprocess
import numpy as np
from PIL import Image

def main():
    video_path = "/home/Zarchy/projekakhir/Frontend/src/app/dashboard/2026-05-20-22-54-54.mp4"
    output_dir = "/home/Zarchy/projekakhir/scratch/frames"
    os.makedirs(output_dir, exist_ok=True)
    
    # Get video duration
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", video_path]
    duration = float(subprocess.check_output(cmd).decode().strip())
    print(f"Video Duration: {duration}s")
    
    # Extract 10 frames at regular intervals
    num_frames = 15
    for i in range(num_frames):
        t = (i / (num_frames - 1)) * duration * 0.95 # avoid the very end if it fades out
        frame_name = f"frame_{i:02d}.jpg"
        frame_path = os.path.join(output_dir, frame_name)
        
        # ffmpeg command to extract a single frame at time t
        ffmpeg_cmd = [
            "ffmpeg", "-y", "-ss", str(t), "-i", video_path,
            "-vframes", "1", "-q:v", "2", frame_path
        ]
        subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Open frame and analyze
        if os.path.exists(frame_path):
            img = Image.open(frame_path)
            w, h = img.size
            arr = np.array(img)
            
            # Let's find horizontal boundaries by computing the difference between adjacent rows.
            # A split line between two different images will have a very large row-to-row color difference.
            # We compute the mean absolute difference between adjacent rows across columns.
            row_diffs = np.mean(np.abs(arr[1:].astype(float) - arr[:-1].astype(float)), axis=(1, 2))
            
            # Find the top 3 row indices with the largest differences (potential split seams)
            # Filter out adjacent rows to avoid duplicates
            peaks = []
            sorted_indices = np.argsort(row_diffs)[::-1]
            for idx in sorted_indices:
                if len(peaks) >= 5:
                    break
                if not any(abs(idx - p) < 15 for p in peaks):
                    peaks.append(idx)
                    
            print(f"Frame {i:02d} at {t:.2f}s: dimensions={w}x{h}, top row-diff peaks at indices: {sorted(peaks)}")

if __name__ == "__main__":
    main()
