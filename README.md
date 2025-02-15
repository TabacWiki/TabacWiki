# Tabac Wiki - Community-Driven Pipe Tobacco Database

This is an entirely community-driven database for pipe tobacco enthusiasts! The Tabac Wiki mission is to provide a comprehensive, searchable database of pipe tobacco blends to help allow enthusiasts to explore and discover freely and seamlessly.

[Click here to explore Tabac Wiki!](https://tabac.wiki)

## Bug Bounty Program

Earn bug bounty prizes for contributions to Tabac Wiki! Whether you're fixing bugs, adding features, or improving the user experience, your help is valuable to the community and if a bug bounty prize has been allocated to the issue or task, you'll get paid for your work! 


*Not a coder?* You can still directly contribute to the wiki to help shape its future by donating toward its maintenance, upkeep and bug bounty program, reporting bugs or issues as they're found, commenting on existing issues and submitting pull requests! Without this, those that *can* code have nothing *to* code - yin and yang!


## Rewards

- As issues are raised, a bounty prize will be assigned
   - (e.g. "Blend_Data Initialization Loading Error - $10 USD")
- Bounty prizes will be determined as fairly as possible
- Contributions will be accepted in a "first to come and successfully serve, is served" manner.
- All contributors will be credited as a [Contributor](https://github.com/TabacWiki/TabacWiki/contributors)
- Bounty prizes will be paid in the currency of either the contributers preference;
   - or whichever currency Tabac Wiki is able to fulfill the bounty prize with.

| Currency | Name | Key Features |
|----------|------|---------------|
| XMR | Monero | Decentralized, ring signatures, stealth addresses, Bulletproofs |
| ICP | Internet Computer Protocol | Decentralized, canister-based, chain-key verification |
| BTC | Bitcoin | Legacy, proof-of-work - 10-minute block times, SHA-256 |
| ETH | Ethereum | Solidity, PoS, scalability via sharding, gas fees|
| LTC | Litecoin | Proof-of-work, faster block times, Scrypt |


## How to Contribute

1. **Pick an Issue or Feature**
   - Check our [Issues](https://github.com/TabacWiki/TabacWiki/issues) page
   - Comment on the issue you want to work on, let us know what your plan is!
   - Or create a new issue for bugs you've found

2. **Development Process**
   - Fork the repository
   - Create a feature branch: `git checkout -b feature/amazing-feature`
   - Make your changes
   - Test thoroughly
   - Commit with clear messages: `git commit -m "Add amazing feature"`
   - Push to your fork: `git push origin feature/amazing-feature`
   - Create a Pull Request

3. **Code Guidelines**
   - Keep it simple and maintainable
   - Comment your code when necessary
   - Follow existing code style
   - Test your changes thoroughly
   - Update documentation if needed

4. **Testing**
   - Test across different browsers
   - Check mobile responsiveness
   - Verify data integrity
   - Test edge cases


## Documentation

## Technical Stack

- Frontend: HTML, JavaScript, Tailwind CSS
- Data Storage: JSON files for easy editing and version control
- No backend required - static site for simplicity

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/TabacWiki/TabacWiki.git
   cd TabacWiki
   ```

2. **Setup**
   - No build process required
   - Open `index.html` in your browser
   - For development, we recommend using a local server:
     ```bash
     python -m http.server 8000
     # or
     php -S localhost:8000
     ```

3. **File Structure**
   ```
   TabacWiki/
   ├── blend_data/                       # Blend information database
   ├── blend_pictures/                   # Blend image database
   ├── assets/
   │   ├── data/                         # JSON data files
   │   │   ├── blend_index.json          # Initialisation Data (potentially being used)
   │   │   ├── blend_manifest.json       # Initialisation Data
   │   │   ├── blend_types.json          # Sorting/Filter Data
   │   │   ├── blenders.json             # Sorting/Filter Data
   │   │   ├── contents.json             # Sorting/Filter Data
   │   │   ├── countries.json            # Sorting/Filter Data
   │   │   ├── cut_types.json            # Sorting/Filter Data
   │   │   ├── known_issues.json         # Wiki Report Button Data
   │   │   ├── packaging_types.json      # Sorting/Filter Data
   │   │   ├── production.json           # Sorting/Filter Data (potentially being used)
   │   │   ├── production_status.json    # Sorting/Filter Data
   │   │   ├── upcoming_features.json    # Wiki Report Button Data
   │   │   └── wiki_status.json          # Wiki Report Button Data
   │   └── js/
   │       ├── donation-popup.js         # Donation Button Popup
   │       └── search.js                 # Search Function
   ├── site_tools_output/                # Output folder for Python tools
   ├── site_tools/                       # Python database tools
   │   ├── blend_data_creator.py         # Create a .JSON file for /blend_data/
   │   ├── database_indexer.py           # Index database (outdated, new is in /scripts/)
   │   ├── edit_blend_data.py            # Edit an existing blend in /blend_data/
   │   ├── image_formatter.py            # Format images to site-friendly size jpg
   │   ├── missing_data.py               # Find all missing values in /blend_data/
   │   └── missing_specific_data.py      # Find specific missing values in /blend_data/
   ├── scripts/
   │   ├── create_manifest.py            # AI did this so we don't know, need to figure out
   │   └── generate_blend_index.js       # AI did this so we don't know, need to figure out
   ├── blend_html/
   │   ├── package-lock.json
   │   ├── package.json
   │   ├── popup.js                      # Blend Card Popup Code
   │   └── search.html                   # 21+ Site Gateway
   ├── CNAME
   ├── _config.yml
   ├── favicon.ico                       # Site Icon
   ├── index.html                        # Main Index Code (THIS IS MOSTLY EVERYTHING)
   ├── package-lock.json
   ├── package.json
   └── README.md                         # You are here!
   
   ```

# Blend Index Format Guide

## Overview
This document explains the structure and abbreviations used in the `blend_index.json` file.

Blend card loading, search, sorting and filtering loads from database index - /assets/data/blend_index.json
Blend info popups load from individual blend data files - /blend_data/

## Top-Level Blend Entry Structure

### Basic Blend Information
- `n`: Name of the blend (full name)
- `b`: Blender (brand or company)
- `bb`: Blended By (specific blender/creator)
- `mb`: Manufactured By (production company)
- `t`: Blend Type 
- `c`: Contents (tobacco composition)
- `ct`: Cut (tobacco cut type)
- `y`: Country (of origin)
- `p`: Packaging
- `f`: Flavoring
- `pr`: Production method/type

### Rating Information
- `r`: Average Rating (numeric)
- `mr`: Maximum Rating (typically 5)
- `rc`: Review Count

### Rating Distribution
- `rd`: Rating Distribution
  - `'4'`: Number of 4-star ratings
  - `'3'`: Number of 3-star ratings
  - `'2'`: Number of 2-star ratings
  - `'1'`: Number of 1-star ratings

## Detailed Ratings Taxonomy

### Ratings Structure Overview
Each rating category follows a consistent structure:
- `l`: Level (primary characteristic)
- `d`: Distribution (detailed breakdown of characteristics)

### 1. Strength Ratings (`s`)

#### Levels
- `EM`: Extremely Mild
- `VM`: Very Mild
- `M`: Mild
- `MM`: Mild to Medium
- `Med`: Medium
- `MS`: Medium to Strong
- `S`: Strong
- `VS`: Very Strong
- `ES`: Extremely Strong
- `O`: Overwhelming

#### Distribution Levels
- `EM`: Extremely Mild
- `VM`: Very Mild
- `M`: Mild
- `MM`: Mild to Medium
- `Med`: Medium
- `MS`: Medium to Strong
- `S`: Strong
- `VS`: Very Strong
- `ES`: Extremely Strong
- `O`: Overwhelming

### 2. Flavoring Ratings (`f`)

#### Levels
- `ND`: None Detected
- `EM`: Extremely Mild
- `VM`: Very Mild
- `M`: Mild
- `MM`: Mild to Medium
- `Med`: Medium
- `MS`: Medium to Strong
- `S`: Strong
- `VS`: Very Strong
- `ES`: Extra Strong

#### Distribution Levels
- `ND`: None Detected
- `EM`: Extremely Mild
- `VM`: Very Mild
- `M`: Mild
- `MM`: Mild to Medium
- `Med`: Medium
- `MS`: Medium to Strong
- `S`: Strong
- `VS`: Very Strong
- `ES`: Extra Strong
- `O`: Overwhelming

### 3. Room Note Ratings (`r`)

#### Levels
- `UN`: Unnoticeable
- `P`: Pleasant
- `VP`: Very Pleasant
- `PT`: Pleasant to Tolerable
- `T`: Tolerable
- `TS`: Tolerable to Strong
- `S`: Strong
- `VS`: Very Strong
- `ES`: Extra Strong
- `O`: Overwhelming

#### Distribution Levels
- `UN`: Unnoticeable
- `P`: Pleasant
- `VP`: Very Pleasant
- `PT`: Pleasant to Tolerable
- `T`: Tolerable
- `TS`: Tolerable to Strong
- `S`: Strong
- `VS`: Very Strong
- `ES`: Extra Strong
- `O`: Overwhelming

### 4. Taste Ratings (`t`)

#### Levels
- `EMF`: Extremely Mild (Flat)
- `VM`: Very Mild
- `M`: Mild
- `MM`: Mild to Medium
- `Med`: Medium
- `MF`: Medium to Full
- `F`: Full
- `VF`: Very Full
- `EF`: Extra Full
- `O`: Overwhelming

#### Distribution Levels
- `EMF`: Extremely Mild (Flat)
- `VM`: Very Mild
- `M`: Mild
- `MM`: Mild to Medium
- `Med`: Medium
- `MF`: Medium to Full
- `F`: Full
- `VF`: Very Full
- `EF`: Extra Full
- `O`: Overwhelming

### Interpretation Guidelines

1. **Level (`l`)**: Represents the primary characteristic of the rating.
   - Indicates the overall intensity or quality of the attribute.
   - Typically a single, most representative descriptor.

2. **Distribution (`d`)**: Provides a detailed breakdown of the characteristic.
   - Each key represents a specific sub-level or nuance.
   - The value indicates the prevalence or intensity of that sub-level.
   - Values are absolute numbers, not percentages.

### Example Interpretation

```json
"rt": {
  "s": {
    "l": "Med",  // Overall strength is Medium
    "d": {
      "MM": 50,  // 50 reviews rate it Mild to Medium
      "Med": 40, // 40 reviews rate it Medium
      "MS": 10   // 10 reviews rate it Medium to Strong
    }
  }
}
```

In this example, while the overall strength is Medium, the distribution shows a nuanced view of how different reviewers perceived the blend's strength.

### Notes
- Not all blends will have entries for every sub-level.
- Zero values are common and indicate no reviews at that specific level.
- The distribution provides insight beyond the primary level descriptor.

## Example Entry
```json
{
  "n": "Example Blend",
  "b": "Tobacco Co",
  "bb": "Master Blender",
  "mb": "Global Tobacco Inc",
  "t": "Virginia Blend",
  "c": "Virginia, Burley",
  "ct": "Ribbon Cut",
  "y": "USA",
  "p": "Tin",
  "f": "Vanilla",
  "pr": "Small Batch",
  "r": 4.2,
  "mr": 5,
  "rc": 150,
  "rd": {
    "4": 90,
    "3": 40,
    "2": 15,
    "1": 5
  },
  "rt": {
    "s": {
      "l": "Medium",
      "d": {
        "MM": 50,
        "Med": 40,
        "MS": 10
      }
    },
    // Similar structures for f, r, t
  }
}
```

## Notes
- All entries are optional and may be empty or zero
- Percentages and distributions are represented as absolute numbers
- Levels and distributions provide a nuanced view of blend characteristics


## Contact

- Create an [Issue](https://github.com/TabacWiki/TabacWiki/issues) for bug reports or feature requests
- Join our community discussions in the [Discussions](https://github.com/TabacWiki/TabacWiki/discussions) tab

## License

This project is open source and we are confused about licensing and really the whole thing in general so if you are a person of the people that is in the know with things to do with stuff that you think we should be privy to please contact us!

---