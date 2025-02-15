import os
import shlex
import shutil
from PIL import Image, ImageOps

def clear_console():
    """Clears the console screen for better visibility."""
    os.system('cls' if os.name == 'nt' else 'clear')

def display_ascii_art():
    """Displays ASCII art in the center of the console."""
    ascii_art = """  
   ╔════════════════════════════════════════════════════════════════════════╗
   ║                     Tabac Wiki Blend Picture Formatter                 ║
   ╠════════════════════════════════════════════════════════════════════════╣
   ║                                                                        ║
   ║                                                                        ║
   ║                                                                        ║
   ║             Ensure your images are square and good quality!            ║
   ║                                                                        ║
   ║                                                                        ║
   ║                                                                        ║
   ║         Simply drag and drop a folder of images and press enter!       ║
   ║                                                                        ║
   ║                                                                        ║
   ║                                                                        ║
   ║                                                                        ║
   ╚════════════════════════════════════════════════════════════════════════╝                                                    
    """
    print(ascii_art)

def select_directory(prompt: str) -> str:
    """
    Prompts the user to drag and drop a directory into the Terminal.
    Processes the input to handle escaped spaces and returns the directory path.
    """
    dir_input = input(prompt).strip()
    try:
        parts = shlex.split(dir_input)
        dir_path = parts[0] if parts else ""
    except Exception:
        dir_path = dir_input
    return dir_path.strip('"').strip("'") if os.path.isdir(dir_path) else ""

def resize_and_crop(input_path: str, output_path: str, size=(262, 262)):
    """Resize image to fill the given size while maintaining aspect ratio (crop excess)."""
    with Image.open(input_path) as img:
        img = img.convert("RGB")  # Ensure compatibility with JPEG format
        img = ImageOps.fit(img, size, method=Image.Resampling.LANCZOS)
        img.save(output_path, "JPEG", quality=85, optimize=True)

if __name__ == "__main__":
    clear_console()
    display_ascii_art()
    print("\n")
    input_dir = select_directory("")
    if not input_dir:
        exit("Invalid input directory provided. Exiting.")

    root_dir = os.path.expanduser("~/Documents/GitHub/TabacWiki")
    output_dir = os.path.join(root_dir, "site_tools_output", "blend_pictures")
    os.makedirs(output_dir, exist_ok=True)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(("jpg", "jpeg", "png", "webp", "bmp", "gif")):
            input_path = os.path.join(input_dir, filename)
            output_filename = os.path.splitext(filename)[0] + ".jpg"
            output_path = os.path.join(output_dir, output_filename)
            resize_and_crop(input_path, output_path)

    print("\n✅ All images have been resized and saved in:", output_dir)
