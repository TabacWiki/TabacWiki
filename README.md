# Tabac Wiki - Community-Driven Pipe Tobacco Database


**Tabac Wiki** is a community-driven, open-source database dedicated to pipe tobacco enthusiasts. Our mission is to provide a comprehensive, searchable repository of pipe tobacco blends—empowering users to explore, discover, and contribute their knowledge in a collaborative environment.

> **Explore The Tabac Wiki:** [https://tabac.wiki](https://tabac.wiki)

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Bug Bounty Program](#bug-bounty-program)
- [Rewards & Payment Options](#rewards--payment-options)
- [How to Contribute](#how-to-contribute)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Blend Index Format Guide](#blend-index-format-guide)
- [License](#license)
- [Contact & Community](#contact--community)

---

## Introduction

Tabac Wiki is built for enthusiasts by enthusiasts. Whether you’re a seasoned pipe aficionado or a curious newcomer, our database allows you to explore detailed information about various pipe tobacco blends. Contributions—from coding and bug fixes to documentation and community discussions—are what make Tabac Wiki thrive.

---

## Features

- **Comprehensive Blend Database:** Easily search, sort, and filter through an extensive collection of pipe tobacco blends.
- **Community-Driven Content:** Add new blends or update existing ones with your expertise.
- **Detailed Ratings & Reviews:** View overall ratings along with granular rating breakdowns covering strength, flavor, room note, and taste.
- **Simple, Static Site:** A fully functional static site with no backend required, ensuring fast loading and easy maintenance.
- **Responsive & Accessible:** Designed with modern web standards and Tailwind CSS for a clean and responsive user interface.

---

## Bug Bounty Program

We encourage our community members to help improve Tabac Wiki. If you discover a bug, have an idea for a new feature, or want to improve user experience, check our [Issues](https://github.com/TabacWiki/TabacWiki/issues) page.

**Bug Bounty Highlights:**

- **Earn Rewards:** Contribute fixes and earn bounty prizes (e.g., *"Blend_Data Initialization Loading Error - $10 USD"*).
- **Fair Valuation:** Bounties are assigned fairly based on the complexity and impact.
- **Inclusive Contributions:** Whether you're a coder or a community member providing feedback, your contributions are valued.
- **Community Credit:** All contributors are recognized in our [Contributor List](https://github.com/TabacWiki/TabacWiki/contributors).

---

## Rewards & Payment Options

Bounty prizes will be paid out in the contributors preference of currency or that which Tabac Wiki is able to fulfill the bounty prize with - in this event Tabac Wiki will confirm the contributor is willing to accept the alternative currency; we will always strive to find a suitable compromise. Options include:

| Currency | Name                          | Key Features                                                                              |
|----------|-------------------------------|-------------------------------------------------------------------------------------------|
| **XMR**  | Monero                        | Decentralized, ring signatures, stealth addresses, Bulletproofs                           |
| **ICP**  | Internet Computer Protocol    | Decentralized, canister-based, chain-key verification                                      |
| **BTC**  | Bitcoin                       | Legacy, proof-of-work, 10-minute block times, SHA-256                                      |
| **ETH**  | Ethereum                      | Solidity, proof-of-stake, scalability via sharding, gas fees                               |
| **LTC**  | Litecoin                      | Proof-of-work, faster block times, Scrypt                                                  |

---

## How to Contribute

Contributions are the cornerstone of Tabac Wiki’s success. Here’s how you can help:

### 1. Pick an Issue or Feature
- Browse our [Issues](https://github.com/TabacWiki/TabacWiki/issues) page.
- Comment on an existing issue or create a new one for bugs or feature requests.

### 2. Development Process
- **Fork the Repository:** Click the "Fork" button at the top right of our GitHub page.
- **Create a Feature Branch:**  
  ```bash
  git checkout -b feature/amazing-feature
  ```
- **Make Your Changes:** Ensure you follow our coding guidelines.
- **Commit with Clear Messages:**  
  ```bash
  git commit -m "Add amazing feature"
  ```
- **Push to Your Fork:**  
  ```bash
  git push origin feature/amazing-feature
  ```
- **Open a Pull Request:** Provide a detailed description of your changes.

### 3. Code Guidelines
- Write clear, maintainable code.
- Comment where necessary.
- Follow the existing style and structure.
- Update documentation if applicable.
- Test your changes thoroughly (including browser compatibility and mobile responsiveness).

### 4. Testing
- Test across multiple browsers.
- Ensure responsiveness on various devices.
- Verify data integrity and handle edge cases.

Even if you're not a coder, you can still contribute by:
- **Reporting Bugs:** Use the [Issues](https://github.com/TabacWiki/TabacWiki/issues) tab.
- **Suggesting Features:** Participate in discussions and propose improvements.
- **Donating:** Help fund the project’s maintenance, upkeep, and bounty program.

---

## Technical Stack

- **Frontend:** HTML, JavaScript, Tailwind CSS
- **Data Storage:** JSON files for easy editing and version control
- **Static Site:** No backend required—ensuring simplicity and speed

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/TabacWiki/TabacWiki.git
cd TabacWiki
```

### Setup

- **No Build Process Required:** Simply open `index.html` in your browser.
- **Local Development:** For an optimal development experience, run a local server:

  ```bash
  python -m http.server 8000
  # or
  php -S localhost:8000
  ```

---

## File Structure

```plaintext
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

---

## Blend Index Format Guide

The `blend_index.json` file is the backbone of our blend loading, search, sorting, and filtering functionalities. It links to individual blend data files located in the `/blend_data/` directory.

### Top-Level Entry Structure

- **Basic Blend Information:**
  - `n`: Name (full name of the blend)
  - `b`: Blender (brand or company)
  - `bb`: Blended By (specific creator)
  - `mb`: Manufactured By (production company)
  - `t`: Blend Type
  - `c`: Contents (tobacco composition)
  - `ct`: Cut type (tobacco cut)
  - `y`: Country of origin
  - `p`: Packaging type
  - `f`: Flavoring details
  - `pr`: Production method/type

- **Rating Information:**
  - `r`: Average Rating
  - `mr`: Maximum Rating (usually 5)
  - `rc`: Review Count
  - `rd`: Rating Distribution (number of 1- to 4-star ratings)

- **Detailed Ratings Taxonomy:**
  - **Strength (`s`):** Levels range from *Extremely Mild (EM)* to *Overwhelming (O)*.
  - **Flavoring (`f`):** Levels range from *None Detected (ND)* to *Extra Strong (ES)*.
  - **Room Note (`r`):** Ranges from *Unnoticeable (UN)* to *Overwhelming (O)*.
  - **Taste (`t`):** Ranges from *Extremely Mild (Flat)* to *Overwhelming (O)*.

> **Example:**
>
> ```json
> {
>   "n": "Example Blend",
>   "b": "Tobacco Co",
>   "bb": "Master Blender",
>   "mb": "Global Tobacco Inc",
>   "t": "Virginia Blend",
>   "c": "Virginia, Burley",
>   "ct": "Ribbon Cut",
>   "y": "USA",
>   "p": "Tin",
>   "f": "Vanilla",
>   "pr": "Small Batch",
>   "r": 4.2,
>   "mr": 5,
>   "rc": 150,
>   "rd": {
>     "4": 90,
>     "3": 40,
>     "2": 15,
>     "1": 5
>   },
>   "rt": {
>     "s": {
>       "l": "Med",
>       "d": {
>         "MM": 50,
>         "Med": 40,
>         "MS": 10
>       }
>     }
>     // Additional structures for 'f', 'r', and 't' follow similarly...
>   }
> }
> ```

---

## License

Tabac Wiki is open-source. We're still determining the best licensing model, so if you have suggestions or insights into licensing options, please [open an issue](https://github.com/TabacWiki/TabacWiki/issues) or contact us directly.

---

## Contact & Community

- **Bug Reports / Feature Requests:** [GitHub Issues](https://github.com/TabacWiki/TabacWiki/issues)
- **Community Discussions:** [GitHub Discussions](https://github.com/TabacWiki/TabacWiki/discussions)
- **Contributors:** Check out our [Contributor List](https://github.com/TabacWiki/TabacWiki/contributors)

Join us on our journey to build the ultimate resource for pipe tobacco enthusiasts!

---

[![GitHub license](https://img.shields.io/github/license/TabacWiki/TabacWiki)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/TabacWiki/TabacWiki)](https://github.com/TabacWiki/TabacWiki/issues)
[![GitHub stars](https://img.shields.io/github/stars/TabacWiki/TabacWiki)](https://github.com/TabacWiki/TabacWiki/stargazers)