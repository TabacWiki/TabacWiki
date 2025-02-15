import os
import json

# Define input and output directories
input_dir = "/users/m/trev/blend_json/"
output_dir = "/users/m/trev/data_data/"

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Initialize sets to store unique values
blenders = set()
blend_types = set()
contents = set()
cut_types = set()
packaging_types = set()
countries = set()

# Process each JSON file
for filename in os.listdir(input_dir):
    if filename.endswith(".json"):
        input_path = os.path.join(input_dir, filename)
        
        with open(input_path, "r", encoding="utf-8") as infile:
            data = json.load(infile)
            
            blenders.add(data.get("brand", "Unknown"))
            blend_types.add(data["details"].get("Blend Type", "Unknown"))
            contents.update(map(str.strip, data["details"].get("Contents", "Unknown").split(",")))
            cut_types.add(data["details"].get("Cut", "Unknown"))
            packaging_types.add(data["details"].get("Packaging", "Unknown"))
            countries.add(data["details"].get("Country", "Unknown"))

# Function to save unique values as JSON lists
def save_json_list(filename, data_set):
    output_path = os.path.join(output_dir, filename)
    with open(output_path, "w", encoding="utf-8") as outfile:
        json.dump(sorted(data_set), outfile, indent=4)

# Save each unique list
save_json_list("blenders.json", blenders)
save_json_list("blend_types.json", blend_types)
save_json_list("contents.json", contents)
save_json_list("cut_types.json", cut_types)
save_json_list("packaging_types.json", packaging_types)
save_json_list("countries.json", countries)

print("Extraction complete. Unique lists are saved in the output directory.")
