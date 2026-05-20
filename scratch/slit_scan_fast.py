import os
import subprocess
import numpy as np
from PIL import Image

def main():
    video_path = "/home/Zarchy/projekakhir/Frontend/src/app/dashboard/2026-05-20-22-54-54.mp4"
    output_dir = "/home/Zarchy/projekakhir/scratch"
    os.makedirs(output_dir, exist_ok=True)
    
    # We will run ffmpeg once to extract all cropped center columns at 15 fps.
    # We crop 1 pixel wide column from x = 960 (center)
    # The output format is rawvideo with rgb24 pixel format
    sample_fps = 15.0
    ffmpeg_cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vf", f"crop=w=10:h=1080:x=960:y=0,fps={sample_fps}",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"
    ]
    
    print("Running ffmpeg stream...")
    proc = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    frame_size = 10 * 1080 * 3  # 10px wide, 1080 rows, 3 channels (RGB)
    slices = []
    
    while True:
        raw_data = proc.stdout.read(frame_size)
        if not raw_data or len(raw_data) < frame_size:
            break
        # Reshape to (1080, 10, 3) and average across width (axis 1)
        col = np.frombuffer(raw_data, dtype=np.uint8).reshape((1080, 10, 3))
        col_avg = np.mean(col, axis=1).astype(np.uint8)
        slices.append(col_avg)
        
    proc.wait()
    stderr_output = proc.stderr.read().decode()
    
    num_samples = len(slices)
    print(f"Extracted {num_samples} frames.")
    
    if num_samples > 0:
        # Stack columns horizontally
        slit_scan = np.stack(slices, axis=1)
        img = Image.fromarray(slit_scan)
        img_path = os.path.join(output_dir, "slit_scan.jpg")
        img.save(img_path)
        print(f"Slit scan saved to {img_path} with size {img.size}")
        
        # Analyze boundaries
        seams_per_column = []
        for col_idx in range(slit_scan.shape[1]):
            col_data = slit_scan[:, col_idx, :]
            diffs = np.mean(np.abs(col_data[1:].astype(float) - col_data[:-1].astype(float)), axis=1)
            peaks = []
            sorted_indices = np.argsort(diffs)[::-1]
            for idx in sorted_indices:
                if diffs[idx] < 20:
                    break
                if len(peaks) >= 4:
                    break
                if not any(abs(idx - p) < 25 for p in peaks):
                    peaks.append(idx)
            seams_per_column.append(sorted(peaks))
            
        print("\nDetected horizontal boundary coordinates (Y-values) in the viewport over time:")
        step = max(1, len(seams_per_column) // 15)
        for idx in range(0, len(seams_per_column), step):
            t = idx / sample_fps
            print(f"Time {t:.2f}s (Frame {idx}): Y-boundaries = {seams_per_column[idx]}")
    else:
        print("Error: No slices extracted. FFMPEG output:")
        print(stderr_output)

if __name__ == "__main__":
    main()
