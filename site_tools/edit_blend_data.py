from pathlib import Path
import json
import sys
import os
from typing import List, Dict, Any

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def get_key():
    """Get a single keypress from the user."""
    if os.name == 'nt':  # Windows
        import msvcrt
        key = msvcrt.getch()
        if key == b'\r':  # Enter key
            return 'ENTER'
        elif key == b'\xe0':  # Special keys
            key = msvcrt.getch()
            if key == b'H':  # Up arrow
                return 'UP'
            elif key == b'P':  # Down arrow
                return 'DOWN'
    else:  # Unix-like systems
        import tty
        import termios
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
            if ch == '\r':
                return 'ENTER'
            elif ch == '\x1b':
                ch = sys.stdin.read(2)
                if ch == '[A':  # Up arrow
                    return 'UP'
                elif ch == '[B':  # Down arrow
                    return 'DOWN'
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    return None

def display_menu(title: str, items: List[str], selected_idx: int = 0, current_value: str = None) -> None:
    """Display a menu with the given title and items."""
    clear_screen()
    print("\n" + "╔" + "═"*48 + "╗")
    print(f"║{title:^48}║")
    print("╠" + "═"*48 + "╣")
    if current_value is not None:
        print("║ Current Value:                                ║")
        # Split long values into multiple lines if needed
        value_lines = [current_value[i:i+44] for i in range(0, len(current_value), 44)]
        for line in value_lines:
            print(f"║ {line:<46}║")
        print("╠" + "═"*48 + "╣")
    print("║  Use UP/DOWN arrows to select, ENTER to confirm  ║")
    print("╚" + "═"*48 + "╝\n")
    
    for idx, item in enumerate(items):
        if idx == selected_idx:
            print(f"  ┌{'─' * (len(item) + 4)}┐")
            print(f"  │ ▶ {item} ◀ │")
            print(f"  └{'─' * (len(item) + 4)}┘")
        else:
            print(f"     {item}")

def get_selection(items: List[str], title: str, current_value: str = None) -> str:
    """Get user selection from a list of items."""
    selected = 0
    while True:
        display_menu(title, items, selected, current_value)
        key = get_key()
        if key == 'ENTER':
            return items[selected]
        elif key == 'UP':
            selected = (selected - 1) % len(items)
        elif key == 'DOWN':
            selected = (selected + 1) % len(items)

def search_blend_files(search_term: str, blend_data_path: Path) -> List[str]:
    """Search for blend files matching the search term."""
    matching_files = []
    search_term = search_term.lower()
    
    for file_path in blend_data_path.glob("*.json"):
        if search_term in file_path.stem.lower():
            matching_files.append(file_path.name)
    
    return sorted(matching_files)

def get_user_input(prompt: str) -> str:
    """Get user input with a pretty prompt."""
    print("\n" + "╔" + "═"*48 + "╗")
    print(f"║{prompt:^48}║")
    print("╚" + "═"*48 + "╝")
    return input("\nEnter value: ").strip()

def confirm_edit(field: str, old_value: str, new_value: str) -> str:
    """Display edit confirmation prompt and get user choice."""
    clear_screen()
    print("\n" + "╔" + "═"*48 + "╗")
    print("║               Confirm Edit                   ║")
    print("╠" + "═"*48 + "╣")
    print(f"║ Field: {field:<41}║")
    print("╠" + "═"*48 + "╣")
    # Split long values into multiple lines if needed
    old_lines = [old_value[i:i+40] for i in range(0, len(old_value), 40)]
    new_lines = [new_value[i:i+40] for i in range(0, len(new_value), 40)]
    
    print("║ Old Value:                                  ║")
    for line in old_lines:
        print(f"║ {line:<46}║")
    print("╠" + "═"*48 + "╣")
    print("║ New Value:                                  ║")
    for line in new_lines:
        print(f"║ {line:<46}║")
    print("╚" + "═"*48 + "╝\n")
    
    choices = ["Yes", "No", "Edit"]
    choice = get_selection(choices, "Confirm Changes?")
    
    return choice

def edit_blend_data(file_path: Path) -> None:
    """Edit the selected blend data file."""
    # Define allowed fields
    ALLOWED_FIELDS = [
        "blendedBy",
        "manufacturedBy",
        "production",
        "country",
        "blendType",
        "contents",
        "cut",
        "packaging",
        "flavoring",
        "description",
        "notes"
    ]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Get the first (and only) key in the JSON object
        blend_key = next(iter(data))
        blend_data = data[blend_key]
        
        while True:
            # Filter fields to only show allowed fields
            available_fields = [field for field in ALLOWED_FIELDS if field in blend_data]
            
            # Get field to edit
            field = get_selection(available_fields, "Select Field to Edit", 
                                current_value=f"Currently editing: {blend_key}")
            
            # Get current value
            current_value = str(blend_data.get(field, ""))
            
            # Get new value
            new_value = get_user_input(f"Current {field}: {current_value}")
            
            # Confirm edit
            choice = confirm_edit(field, current_value, new_value)
            
            if choice == "Yes":
                blend_data[field] = new_value
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=4)
                print("\nChanges saved successfully!")
                break
            elif choice == "Edit":
                continue
            else:  # No
                print("\nEdit cancelled")
                break
            
    except Exception as e:
        print(f"Error editing file: {str(e)}")
        input("\nPress Enter to continue...")

def main():
    # Setup paths
    root = Path(__file__).parent.parent
    blend_data_path = root / "blend_data"
    
    while True:
        clear_screen()
        # Get search term
        search_term = get_user_input("Enter blend name to search (or 'quit' to exit)")
        
        if search_term.lower() == 'quit':
            break
        
        # Search for matching files
        matching_files = search_blend_files(search_term, blend_data_path)
        
        if not matching_files:
            print("\nNo matching blends found.")
            input("\nPress Enter to try again...")
            continue
        
        # Let user select a file
        selected_file = get_selection(matching_files, "Select Blend to Edit")
        
        # Edit the selected file
        edit_blend_data(blend_data_path / selected_file)
        
        # Ask if user wants to edit another file
        if get_selection(["Edit Another", "Quit"], "What Next?") == "Quit":
            break

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        clear_screen()
        print("\nOperation cancelled by user")
        sys.exit(0)