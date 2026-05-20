import os
import subprocess
import numpy as np
from PIL import Image

def main():
    video_path = "/home/Zarchy/projekakhir/Frontend/src/app/dashboard/2026-05-20-22-54-54.mp4"
    output_dir = "/home/Zarchy/projekakhir/scratch"
    os.makedirs(output_dir, exist_ok=True)
    
    # Get total frames and frame rate
    cmd_fps = ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate,nb_frames", "-of", "csv=p=0", video_path]
    res = subprocess.check_output(cmd_fps).decode().strip().split(",")
    # nb_frames might be N/A, let's check
    fps_num, fps_den = map(int, res[0].split("/"))
    fps = fps_num / fps_den
    
    # We can extract frames at a lower rate, say 10 fps, to build a 2D slit-scan image.
    # Video duration is ~17.4s, so 174 columns.
    duration = 17.44
    sample_fps = 15.0
    num_samples = int(duration * sample_fps)
    print(f"FPS: {fps}, Duration: {duration}s, Sampling at {sample_fps} FPS: {num_samples} frames")
    
    # Extract slices
    slices = []
    for i in range(num_samples):
        t = i / sample_fps
        # Extract 1 pixel wide column from the center (x = 960)
        # Using ffmpeg crop filter: crop=1:1080:960:0
        cmd_slice = [
            "ffmpeg", "-y", "-ss", f"{t:.3f}", "-i", video_path,
            "-vf", "crop=1:1080:960:0", "-vframes", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"
        ]
        proc = subprocess.Popen(cmd_slice, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        raw_data, _ = proc.communicate()
        if len(raw_data) == 1080 * 3:
            col = np.frombuffer(raw_data, dtype=np.uint8).reshape((1080, 3))
            slices.append(col)
            
    if slices:
        # Stack columns horizontally to create a 2D image (height=1080, width=num_samples, channels=3)
        slit_scan = np.stack(slices, axis=1)
        img = Image.fromarray(slit_scan)
        img_path = os.path.join(output_dir, "slit_scan.jpg")
        img.save(img_path)
        print(f"Slit scan saved to {img_path} with size {img.size}")
        
        # Let's analyze the saved slit-scan to find boundaries.
        # Boundaries will appear as lines in the slit scan image.
        # We can calculate the vertical color differences in the slit-scan to find where the transition seams are at each time slice.
        seams_per_column = []
        for col_idx in range(slit_scan.shape[1]):
            col_data = slit_scan[:, col_idx, :]
            # row-to-row diff
            diffs = np.mean(np.abs(col_data[1:].astype(float) - col_data[:-1].astype(float)), axis=1)
            # Find peaks that are > 20 and not within 10 pixels of each other
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
            
        # Print a subset of the detected seams to see their movement
        print("\nDetected horizontal boundary coordinates (Y-values) in the viewport over time:")
        for idx in range(0, len(seams_per_column), len(seams_per_column) // 10):
            t = idx / sample_fps
            print(f"Time {t:.2f}s: Y-boundaries = {seams_per_column[idx]}")
            
if __name__ == "__main__":
    main()
