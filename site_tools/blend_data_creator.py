import os
import json
from collections import OrderedDict
from typing import Dict, Any
from PIL import Image, ImageOps

# Define paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(ROOT_DIR, "site_tools_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_image_path(brand: str, blend_name: str) -> str:
    """Generates the standardized image path for a blend."""
    return f"../blend_pictures/{brand} - {blend_name}.jpg"

def resize_and_crop(input_path, output_path, size=(262, 262)):
    """Resize image to fill the given size while maintaining aspect ratio (crop excess)."""
    with Image.open(input_path) as img:
        img = img.convert("RGB")
        img = ImageOps.fit(img, size, method=Image.Resampling.LANCZOS)
        img.save(output_path, "JPEG", quality=85, optimize=True)

def detailed_ratings_data(level: str, scale: str, distribution: Dict[str, float]) -> OrderedDict:
    """Returns detailed rating data."""
    return OrderedDict({
        "level": level,
        "scale": scale,
        "distribution": distribution
    })

def extract_ratings_data() -> OrderedDict:
    """Returns fully detailed rating data."""
    return OrderedDict({
        "strength": detailed_ratings_data(
            level="0",
            scale="Extremely Mild -> Overwhelming",
            distribution={
                "Extremely Mild": 0.0, "Very Mild": 0.0, "Mild": 0.0, "Mild to Medium": 0.0, "Medium": 0.0,
                "Medium to Strong": 0.0, "Strong": 0.0, "Very Strong": 0.0, "Extremely Strong": 0.0, "Overwhelming": 0.0
            }
        ),
        "flavoring": detailed_ratings_data(
            level="0",
            scale="None Detected -> Extra Strong",
            distribution={
                "None Detected": 0.0, "Extremely Mild": 0.0, "Very Mild": 0.0, "Mild": 0.0, "Mild to Medium": 0.0,
                "Medium": 0.0, "Medium to Strong": 0.0, "Strong": 0.0, "Very Strong": 0.0, "Extra Strong": 0.0
            }
        ),
        "roomNote": detailed_ratings_data(
            level="0",
            scale="Unnoticeable -> Overwhelming",
            distribution={
                "Unnoticeable": 0.0, "Pleasant": 0.0, "Very Pleasant": 0.0, "Pleasant to Tolerable": 0.0,
                "Tolerable": 0.0, "Tolerable to Strong": 0.0, "Strong": 0.0, "Very Strong": 0.0,
                "Extra Strong": 0.0, "Overwhelming": 0.0
            }
        ),
        "taste": detailed_ratings_data(
            level="0",
            scale="Extremely Mild (Flat) -> Overwhelming",
            distribution={
                "Extremely Mild (Flat)": 0.0, "Very Mild": 0.0, "Mild": 0.0, "Mild to Medium": 0.0,
                "Medium": 0.0, "Medium to Full": 0.0, "Full": 0.0, "Very Full": 0.0,
                "Extra Full": 0.0, "Overwhelming": 0.0
            }
        )
    })

def transform_blend_data(data: Dict[str, Any], image_filename: str) -> OrderedDict:
    """Transforms raw blend data into standardized format."""
    blend_key = data["blend_name"].replace(" ", "").lower()
    details = data["details"]
    
    return OrderedDict({
        blend_key: OrderedDict({
            "imagePath": generate_image_path(data["brand"], data["blend_name"]),
            "name": data.get("blend_name", "Unknown"),
            "blender": data.get("brand", "Unknown"),
            "blendedBy": details.get("Blended By", "Unknown"),
            "manufacturedBy": details.get("Manufactured By", "Unknown"),
            "production": details.get("Production", "Unknown"),
            "country": details.get("Country", "Unknown"),
            "blendType": details.get("Blend Type", "Unknown"),
            "contents": details.get("Contents", "Unknown"),
            "cut": details.get("Cut", "Unknown"),
            "packaging": details.get("Packaging", "Unknown"),
            "flavoring": details.get("Flavoring", ""),
            "description": data.get("tin_description", ""),
            "notes": data.get("notes", ""),
            "reviewCount": 0,
            "totalReviews": 0,
            "averageRating": 0,  # Defaulting averageRating to 0
            "maxRating": 0,      # Defaulting maxRating to 0
            "ratingDistribution": {
                "4_star": 0,
                "3_star": 0,
                "2_star": 0,
                "1_star": 0
            },
            "ratings": extract_ratings_data()
        })
    })

def select_image() -> str:
    """
    Prompts the user to drag and drop the image file into the Terminal.
    On macOS, dragging a file into Terminal pastes its full path.
    """
    file_path = input("Please drag and drop your image file here and press Enter:\n").strip()
    # Remove any surrounding quotes if present
    file_path = file_path.strip('"').strip("'")
    if not file_path or not os.path.exists(file_path):
        print("⚠️ The file does not exist or no file was provided.")
        return ""
    return file_path

def process_blend_input():
    """Prompts user for blend data and processes it into JSON format."""
    print(r"""
╔═════════════════════════════════════════════════════════════════════════════╗
║                         Tabac Wiki Blend Data Creation                      ║
╠═════════════════════════════════════════════════════════════════════════════╣
║ Capitalize appropriately, and ensure as little is missing as possible!      ║
║ Please have the following information ready, in this order:                 ║
║                                                                             ║
║                                                                             ║
║ • Blend Name          (e.g. "Cumberland")                                   ║
║ • Brand               (e.g. "G.L. Pease")                                   ║
║ • Blended By          (e.g. "G.L. Pease")                                   ║
║ • Manufactured By     (e.g. "Cornell & Diehl")                              ║
║ • Production Status   (e.g. "Currently Available, No Longer Available")     ║
║ • Country             (e.g. "United States")                                ║
║ • Blend Type          (e.g. "Aromatic, American, Straight Virginia, etc.")  ║
║ • Contents            (e.g. "Oriental/Latakia, Virginia, Perique, etc.")    ║
║ • Cut                 (e.g. "Ribbon, Plug, etc.")                           ║
║ • Packaging           (e.g. "1.5oz Pouch, 1.75oz Tin, 2oz Can, 16oz Bulk")  ║
║ • Flavoring           (e.g. "None, Plum, Cherry, Vanilla, etc.")            ║
║ • Tin Description     (Prioritize manufacturers descriptions if available)  ║
║ • Notes               (Extra info beneath description, tidbit information)  ║
║ • Blend Image         (Just drag and drop your image in when prompted!)     ║
╚═════════════════════════════════════════════════════════════════════════════╝
    """)


    blend_data = {
        "blend_name": input("Please enter the name of the blend: "),
        "brand": input("What brand is the blend released under? : "),
        "details": {
            "Blended By": input("Who is this blended by? (usually same as the brand) : "),
            "Manufactured By": input("Who is the blend manufactured by? (usually same as the brand) : "),
            "Production": input("Is it currently available, or no longer in production? : "),
            "Country": input("Country? : "),
            "Blend Type": input("Blend type: (Aromatic, American, Straight Virginia, etc.): "),
            "Contents": input("Enter contents: (Oriental/Latakia, Virginia, Perique, etc.): "),
            "Cut": input("Enter cut: (Ribbon, Plug, etc.): "),
            "Packaging": input("Enter packaging: (1.5oz Pouch, 1.75oz Tin, etc.): "),
            "Flavoring": input("Enter flavoring: (None, Plum, Cherry, Vanilla, etc.): ")
        },
        "tin_description": input("Please enter the blends description: "),
        "notes": input("Now any tidbit info to do with the blends history or production) : ")
    }

    # Use the brand and blend name to create a consistent file basename.
    file_basename = f"{blend_data['brand']} - {blend_data['blend_name']}"

    print("\n📂 Lastly, drag and drop your image file into the Terminal: ")
    image_path = select_image()

    if image_path:
        # Save the image with the constructed file_basename
        image_filename = f"{file_basename}.jpg"
        output_image_path = os.path.join(OUTPUT_DIR, image_filename)
        try:
            resize_and_crop(image_path, output_image_path)
            print(f"✅ Image processed and saved to: {output_image_path}")
        except Exception as e:
            print(f"Error processing image: {e}")
            image_filename = ""
    else:
        print("⚠️ No valid image provided. Skipping image processing.")
        image_filename = ""

    # Transform the blend data into a JSON-ready structure.
    transformed_data = transform_blend_data(blend_data, image_filename)
    
    # Save the JSON with the same file_basename.
    output_json_path = os.path.join(OUTPUT_DIR, f"{file_basename}.json")
    with open(output_json_path, "w", encoding="utf-8") as outfile:
        json.dump(transformed_data, outfile, indent=4)

    print(f"✅ Blend data saved to: {output_json_path}")

if __name__ == "__main__":
    process_blend_input()
