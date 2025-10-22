#!/usr/bin/env python3
import json
import os
from pathlib import Path

def extract_flavorings():
    blend_data_dir = Path('blend_data')
    flavorings = set()

    # Iterate through all JSON files
    for json_file in blend_data_dir.glob('*.json'):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

                # Get the first (and only) key's value
                blend_key = list(data.keys())[0]
                blend_data = data[blend_key]

                # Extract flavoring field
                flavoring = blend_data.get('flavoring', '')
                if flavoring and flavoring.strip():
                    # Split by common delimiters and clean up
                    for item in flavoring.replace(',', '/').split('/'):
                        item = item.strip()
                        if item and item.lower() != 'none' and item.lower() != 'unflavored':
                            flavorings.add(item)
        except Exception as e:
            print(f"Error processing {json_file}: {e}")

    # Sort and print
    sorted_flavorings = sorted(flavorings, key=str.lower)

    print(f"Found {len(sorted_flavorings)} unique flavorings:\n")
    for flavoring in sorted_flavorings:
        print(f"  - {flavoring}")

    # Also save to a file
    with open('flavorings_list.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(sorted_flavorings))

    print(f"\nList saved to flavorings_list.txt")

    # Generate JavaScript array
    js_array = '[\n    ' + ',\n    '.join(f'"{f}"' for f in sorted_flavorings) + '\n]'
    print(f"\nJavaScript array:\n{js_array}")

if __name__ == '__main__':
    extract_flavorings()
