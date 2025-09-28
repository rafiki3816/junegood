# HISTORY.md - Project Progress Documentation

## Purpose
This document provides quick context for future CLI sessions to understand the current state of the junegood project, completed work, and important patterns/preferences.

---

## Current Project State (2025-09-28)

### Overview
- **Project**: Personal portfolio website with travel photos and journals
- **URL**: Deployed via Cloudflare Pages from GitHub
- **Repository**: https://github.com/rafiki3816/junegood.git
- **Main Technologies**: HTML, CSS, Vanilla JavaScript, JSON data storage

### Key User Preferences
- **하드코딩은 절대 금지** (Absolutely no hardcoding)
- **소프트 코딩이 기본 원칙** (Soft coding is the basic principle)
- **Always check both .jpg and .jpeg extensions**
- **All AI-generated content must be marked as such**

---

## Completed Work Summary

### 1. Paris Photo Gallery (143 photos)
- **Location**: `/photos/Paris/img/`
- **Photo Organization**:
  - Photos 1-78: Landscape (1920x1080)
  - Photos 79-143: Portrait (1080x1920)
  - All optimized at 85% quality for web
- **Sorting**: Landscape photos numbered first, then portraits
- **Lightbox**: Fixed to display all 143 photos (was only showing 38)

### 2. Travel Journals Created (22 total)
All journals are JSON files in `/data/journals/` with rich, detailed content:

#### Complete List by Year:
- **2014**: Okinawa (May), Kyoto (July)
- **2015**: Tokyo (August), **Paris (September)** ⭐ New
- **2016**: Barcelona (December)
- **2017**: Tokyo2 (April), London (July), Edinburgh (July), Phi Phi (September), Hong Kong (September), New York (September), Taipei (December)
- **2018**: Brussels (July), Amsterdam (July), Rotterdam (July), Kyushu (December)
- **2019**: Napa (February), Lake Tahoe (April), Sacramento (April), Los Angeles (April), San Diego (April), San Francisco (July)

### 3. Journal System Architecture
```
/data/
├── journals-index.json    # Central index with metadata
└── journals/              # Individual journal files
    ├── paris-2015.json
    ├── hongkong-2017.json
    ├── taipei-2017.json
    └── [etc...]
```

### 4. PWA Support & Mobile Icons
- **Manifest**: `/manifest.json` configured
- **App Name**: "Junegood"
- **Icon Style**:
  - Sacramento font (same as site title)
  - Blue text (#0000FF)
  - Glass effect (0.3 opacity)
  - Border: #111111
  - Sizes: 72x72 to 512x512

### 5. Image Updates
- **Paris Journal**: Main image changed to `photos/Paris/img/30.jpg` (Shakespeare and Company bookstore)
- **San Francisco Journal**: Main image changed to `photos/SanFrancisco/img/5.jpeg` (Rainbow over Bay)

---

## Project Structure

### Key Directories
```
/
├── index.html              # Main page
├── sub1.html              # About
├── sub2.html              # Works
├── sub3.html              # Travel galleries
├── sub4.html              # Journals
├── data/
│   ├── journals-index.json
│   └── journals/
├── photos/
│   └── [CityName]/
│       ├── img/
│       └── lightbox-enhanced.html
└── icons/                 # PWA icons (needs population)
```

### Authentication
- Admin pages: `journals-login.html`, `journals-admin.html`
- Credentials in CLAUDE.md: admin / junegood2024!
- Console helper: `AuthManager.setupAdmin()`

---

## Technical Patterns

### Journal Loading System
- File-based, not localStorage
- 5-minute cache for performance
- Dynamic loading from individual JSON files
- Each journal marked with "AI-generated" notice

### Image Handling
- Always check both `.jpg` and `.jpeg` extensions
- Gallery photos link to lightbox-enhanced.html
- Main images can be either in `/images/travels/` or `/photos/[City]/img/`

### Git Workflow
```bash
# Standard commit pattern
git add [files]
git commit -m "Description

- Detail 1
- Detail 2

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

---

## Known Issues & Notes

### Fixed Issues
- ✅ Paris gallery was showing only 38/143 photos
- ✅ Journal display issues with Live Server port 5500 vs Python server port 8000
- ✅ Authentication initialization problems
- ✅ Missing .jpeg extension checking

### Pending Tasks
- Icons need to be generated and saved to `/icons/` folder
- Some travel galleries may still need journals
- Barcelona journal needs actual content (currently placeholder)

### Important Files
- `CLAUDE.md` - AI assistant instructions
- `README.md` - Project documentation
- `SECURITY.md` - Security guidelines
- `.htaccess` - Apache configuration

---

## Cities with Photo Galleries

### Has Journal
- Paris (143 photos)
- San Francisco (28 photos)
- Tokyo (3 galleries)
- Hong Kong (49 photos)
- Taipei (13 photos)
- [and 17 others...]

### May Need Journal
- Check each gallery folder for photos without corresponding journal entry

---

## Development Environment
- **Local Server**: Live Server on port 5500 (primary)
- **Alternative**: Python HTTP server on port 8000
- **Platform**: macOS (Darwin)
- **Editor**: Working through Claude Code CLI

---

## Quick Commands for Next Session

### Check project status
```bash
git status
ls photos/*/img/*.jpg photos/*/img/*.jpeg | wc -l
```

### Start local server
```bash
# If using Live Server, it auto-starts on port 5500
# Or use Python:
python3 -m http.server 8000
```

### Find cities without journals
```bash
ls photos/ | while read city; do
  if [ ! -f "data/journals/${city,,}-*.json" ]; then
    echo "$city might need a journal"
  fi
done
```

---

## Last Updated
2025-09-28 - After creating Paris journal and updating image references

---

*This document should be updated after significant changes to maintain context for future sessions.*