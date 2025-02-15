from pathlib import Path
import json
import sys
import os

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def get_required_fields():
    """Return the list of available fields to check."""
    return [
        "imagePath",
        "name",
        "blender",
        "blendedBy",
        "manufacturedBy",
        "production",
        "country",
        "blendType",
        "contents",
        "cut",
        "packaging",
        "flavoring",
        "description"
    ]

def display_menu(fields, selected_idx=0):
    """Display a simple terminal menu."""
    clear_screen()
    print("\n" + "╔" + "═"*48 + "╗")
    print("║         Tabac Wiki Database Flaw Finder        ║")
    print("╠" + "═"*48 + "╣")
    print("║   UP/DOWN arrows to select, ENTER to confirm   ║")
    print("╚" + "═"*48 + "╝\n")
    
    for idx, field in enumerate(fields):
        if idx == selected_idx:
            print(f"  ┌{'─' * (len(field) + 4)}┐")
            print(f"  │ ▶ {field} ◀ │")
            print(f"  └{'─' * (len(field) + 4)}┘")
        else:
            print(f"     {field}")
    
    return selected_idx

def get_user_selection():
    """Get user's field selection using arrow keys."""
    fields = get_required_fields()
    selected = 0
    
    # Handle different keyboard inputs
    if os.name == 'nt':  # Windows
        import msvcrt
        
        while True:
            display_menu(fields, selected)
            key = msvcrt.getch()
            if key == b'\r':  # Enter key
                return fields[selected]
            elif key == b'\xe0':  # Special keys
                key = msvcrt.getch()
                if key == b'H':  # Up arrow
                    selected = (selected - 1) % len(fields)
                elif key == b'P':  # Down arrow
                    selected = (selected + 1) % len(fields)
    
    else:  # Unix-like systems
        import tty
        import termios
        
        def get_key():
            fd = sys.stdin.fileno()
            old_settings = termios.tcgetattr(fd)
            try:
                tty.setraw(sys.stdin.fileno())
                ch = sys.stdin.read(1)
                if ch == '\x1b':
                    ch = sys.stdin.read(2)
                    return ch
            finally:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
            return ch
        
        while True:
            display_menu(fields, selected)
            key = get_key()
            if key == '\r':  # Enter key
                return fields[selected]
            elif key == '[A':  # Up arrow
                selected = (selected - 1) % len(fields)
            elif key == '[B':  # Down arrow
                selected = (selected + 1) % len(fields)

def check_specific_field(data, field_to_check):
    """Check if a specific field is empty in the tobacco blend data."""
    blend_key = next(iter(data))
    blend_data = data[blend_key]
    
    if field_to_check not in blend_data or blend_data[field_to_check] == "":
        return True
    return False

def process_json_files(input_dir, output_dir, field_to_check):
    """Process all JSON files in the input directory and create a single report for missing data."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    output_path.mkdir(parents=True, exist_ok=True)
    
    files_with_missing_data = []
    total_files = 0
    
    clear_screen()
    print("\nScanning files...\n")
    
    for json_file in input_path.glob("*.json"):
        total_files += 1
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if check_specific_field(data, field_to_check):
                # Remove .json extension from filename before adding to list
                base_name = json_file.stem
                files_with_missing_data.append(base_name)
                print(f"Found missing {field_to_check} in {base_name}")
                
        except json.JSONDecodeError:
            print(f"Error: Could not parse JSON file: {json_file}", file=sys.stderr)
        except Exception as e:
            print(f"Error processing {json_file}: {str(e)}", file=sys.stderr)
    
    if files_with_missing_data:
        # Sort the list alphabetically before saving
        files_with_missing_data.sort()
        output_file = output_path / f"missing_{field_to_check}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(files_with_missing_data, f, indent=4)
        print(f"\nCreated report at: {output_file}")
    
    print("\n" + "╔" + "═"*48 + "╗")
    print("║                     Summary                    ║")
    print("╚" + "═"*48 + "╝")
    print(f"       Total files processed: {total_files:<24}")
    print(f"       Files missing {field_to_check}: {len(files_with_missing_data):<17}   ")

def main():
    # Define paths relative to root
    root = Path(__file__).parent.parent
    input_dir = root / "blend_data"
    output_dir = root / "site_tools_output"
    
    # Get field selection from interactive menu
    try:
        selected_field = get_user_selection()
        process_json_files(input_dir, output_dir, selected_field)
    except KeyboardInterrupt:
        clear_screen()
        print("\nOperation cancelled by user")
        sys.exit(0)

if __name__ == "__main__":
    main()