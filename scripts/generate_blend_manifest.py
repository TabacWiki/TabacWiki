import json
import os

blend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'blend_data')
manifest_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'data', 'blend_manifest.json')

# Get all JSON files in the blend_data directory
blend_files = [f for f in os.listdir(blend_dir) if f.endswith('.json')]

# Write the list as JSON
with open(manifest_path, 'w') as f:
    json.dump(blend_files, f, indent=2)
