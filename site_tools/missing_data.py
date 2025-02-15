from pathlib import Path
import json
import sys

def check_required_fields(data):
    """Check for empty required fields in the tobacco blend data."""
    required_fields = {
    "imagePath",                
        "name",                 #   Should always exist
        "blender",              #   Should always exist
        "blendedBy",            #   May be different from blender
        "manufacturedBy",       #   May be different from blender
        "production",           #   PRIORITY
        "country",              #   PRIORITY
        "blendType",            #   PRIORITY
        "contents",             #   PRIORITY
        "cut",                  #   PRIORITY
        "packaging",            #   PRIORITY
        "flavoring",            #   PRIORITY - Flavoring as per blenders admission of use in the blend - NOT PERCEIVED FLAVORING!! IMPORTANT!! AAHH!!
        "description"           #   PRIORITY - A batch email to blenders effort is in the thought-tank stage
    }
    
    missing_fields = {}
    
    # Get the blend name (first key in the JSON)
    blend_key = next(iter(data))
    blend_data = data[blend_key]
    
    # Check each required field
    for field in required_fields:
        if field not in blend_data or blend_data[field] == "":
            missing_fields[field] = ""
            
    return missing_fields if missing_fields else None

def process_json_files(input_dir, output_dir):
    """Process all JSON files in the input directory and create reports for missing data."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Track files with missing data
    files_with_missing_data = 0
    total_files = 0
    
    # Process each JSON file
    for json_file in input_path.glob("*.json"):
        total_files += 1
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            missing_fields = check_required_fields(data)
            
            if missing_fields:
                files_with_missing_data += 1
                # Create output file with missing fields
                output_file = output_path / json_file.name
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(missing_fields, f, indent=4)
                print(f"Created report for {json_file.name}")
                
        except json.JSONDecodeError:
            print(f"Error: Could not parse JSON file: {json_file}", file=sys.stderr)
        except Exception as e:
            print(f"Error processing {json_file}: {str(e)}", file=sys.stderr)
    
    # Print summary
    print(f"\nProcessing complete!")
    print(f"Total files processed: {total_files}")
    print(f"Files with missing data: {files_with_missing_data}")

def main():
    # Define paths relative to root
    root = Path(__file__).parent.parent  # Assuming script is in site_tools directory
    input_dir = root / "blend_data"
    output_dir = root / "site_tools_output" / "missing_data"
    
    # Process the files
    process_json_files(input_dir, output_dir)

if __name__ == "__main__":
    main()