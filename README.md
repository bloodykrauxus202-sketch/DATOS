# Diocese of Tagum App

A mobile application for the Diocese of Tagum community, built with React Native and Expo. The app integrates with Google Sheets to provide real-time directory information for parishes, schools, ministries, and more.

## Features

### 1. Welcome Screen
- **Animated Diocese of Tagum logo** at the center:
  - Dramatic entrance: Drops from above with a bounce effect
  - Pops in with an overshoot spring animation (scales to 1.3x then settles to 1x)
  - Continuous breathing effect: Gently scales between 1x and 1.08x (like inhaling/exhaling)
  - Pulsing blue glow ring: Expands/contracts behind logo with changing opacity
  - Shimmer light effect: Diagonal light sweep across the logo every few seconds
  - Multiple layered animations create a divine, radiant appearance
- 10 small directory icons arranged in a perfect circle around the logo
- **Animated Icons with Sequential Highlighting**: Each icon is dramatically highlighted one by one in a continuous loop:
  - Icons remain dimmed (40% opacity) when not highlighted
  - Each icon gets 1 second spotlight in sequence (10-second full cycle)
  - During highlight: pops to 1.4x scale with bounce effect, floats up 15px, and brightens to full opacity
  - Creates an attention-grabbing tour around the circle showcasing each directory
- "Continue" button to proceed to the main directory

### 2. Directory Screen
- Diocese logo at the top
- 10 clickable directory icons in a 3-column grid layout
- Each directory navigates to its dedicated screen

### 3. Parish Directory
- **List View**: Search and browse all 57 parishes
- **Search Functionality**: Real-time search to find parishes quickly
- **Detail View with Clergy Prominence**:
  - **"Clergy" header** with icon at top
  - **Multiple clergy members listed** with each priest prominently displayed:
    - **Priest's full name** (text-2xl, bold) - MOST PROMINENT
    - Role (Parish Priest, Parochial Vicar, etc.) - smaller text below name
    - Parish assignment - smaller text
    - Location - smallest text
  - **Parish name** shown as detail card below clergy section
  - Contact number
  - Email
  - Location (clickable - opens Google Maps for directions)
  - Vicariate
  - History
  - Fiesta Date
- **Data Structure**: Parish Priest field in Google Sheets contains multi-line clergy data:
  - Line 1: Rev. Fr. Full Name
  - Line 2: Role (Parish Priest/Parochial Vicar)
  - Line 3: Parish Assignment
  - Line 4: Location
  - Repeats for multiple clergy members
- **Google Maps Integration**: Tap location to get directions from current location

**Data Source**: Google Sheets - Parishes sheet
- Column A: Vicariate
- Column B: Parish Name
- Column C: Parish Priest
- Column D: Location
- Column E: History
- Column F: Contact Number

### 4. Vicariate Directory
- **13 Vicariates** with expandable dropdown lists
- Each vicariate shows:
  - Vicariate name
  - Number of parishes
  - Expandable list of parishes
- Tap any parish to view full details
- Parishes grouped automatically by vicariate from Google Sheets

### 5. Schools Directory
- **List View**: Browse all Catholic schools
- **Detail View**:
  - School name (centered at top)
  - Location (clickable - opens Google Maps with directions)
  - Contact number
  - Email address
  - Programs offered
  - School history
- **Google Maps Directions**: Tap location to get turn-by-turn directions from your current location

**Data Source**: Google Sheets - Schools sheet
- Column A: School Name
- Column B: Location
- Column C: Contact
- Column D: Email
- Column E: School History
- Column F: Programs

### 6. Ministry Directory
- **List View**: Browse all ministries and apostolates
- **Card Display**:
  - Ministry/Apostolate name (bold)
  - Coordinator/Director (regular text)
  - Brief description
- Purple people icon for each ministry

**Data Source**: Google Sheets - Ministry sheet
- Column A: Ministry/Apostolate Name
- Column B: Coordinator/Director
- Column C: Brief Description

### 7. Clergy Directory
- **Smart Categorization**: Automatically groups clergy by category based on bold headers in Google Sheets
- **List View**: Browse all clergy organized by categories (Bishop, Diocesan Priests, Extern Priests, Deacons, Spiritual Directors, etc.)
- **Card Display with Prominent Names**:
  - **Large priest name** displayed prominently at top (text-xl, bold)
  - Title (Rev., Fr., Msgr., etc.) shown below with icon
  - Assignment/Parish location with icon
  - Role/Position with icon
- **Category Headers**: Each category displays with count of members
- **Data Source**: Google Sheets - Priests sheet
  - Column A: Name (with category headers as bold text)
  - Column B: Title
  - Column C: Assignment
  - Column D: Role
- **Smart Detection**: The system intelligently detects category headers (rows with only name, no other data) and groups clergy accordingly
- **Spiritual Directors**: When listed, shows clergy names prominently in a list format with all names displayed large

### 8. Other Directories
- **BEC**: Basic Ecclesial Communities
- **Lay Movement**: Lay organizations
- **Congregation**: Religious congregations
- **Corporations**: Church corporations
- **History**: Diocese history

### 9. Sponsor Advertisements
- **Random Display**: Sponsor images appear randomly every 5-10 taps anywhere in the app
- **Non-Intrusive**: Users can easily close the sponsor modal with the close button
- **Image Display**: Shows sponsor images from Google Sheets in a clean, centered modal
- **Smart Timing**: Uses intelligent tap tracking to display ads at appropriate intervals

**Data Source**: Google Sheets - Sponsors sheet
- Column A: Image URL (publicly accessible image links)

**How it Works**:
1. The app tracks every tap/press anywhere in the interface
2. After 5-10 random taps, a sponsor image modal appears
3. Users can close the modal by tapping the X button
4. The counter resets and picks a new random interval for the next ad
5. Each time an ad shows, a random sponsor image is selected from the available pool

### 10. Video Advertisements
- **Automatic Display**: Video plays automatically every 15 taps anywhere in the app
- **Fullscreen Playback**: Videos play fullscreen with native controls
- **User Control**: Users can play/pause, scrub, and close videos using native video controls
- **Close Button**: X button at top right to close the video modal

**Data Source**: Google Sheets - Videos sheet
- Column A: Video URL (publicly accessible video links, e.g., YouTube, Vimeo, or direct MP4 links)

**How it Works**:
1. The app continuously tracks all taps throughout the app
2. Every 15th tap triggers a video modal
3. A random video from rows 2-4 is selected and plays automatically
4. Users can control playback with native video controls
5. Users can close the video by tapping the X button at the top right

## Google Sheets Integration

### Setup Requirements

1. **Google Sheets API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create or select a project
   - Enable Google Sheets API
   - Create credentials (API Key)
   - Add the key as `EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY` in ENV tab

2. **Spreadsheet Structure**:
   - Spreadsheet ID: `13GUde5p78ZPFzGS2_OAJNahAgwCcjHwb52o7EtP3pm0`
   - Must be publicly accessible or shared with API key

3. **Required Sheets**:

   **Parishes Sheet** (default/first sheet):
   | Column | Content |
   |--------|---------|
   | A | Vicariate |
   | B | Parish Name |
   | C | Parish Priest |
   | D | Location |
   | E | History |
   | F | Contact Number |

   **Schools Sheet**:
   | Column | Content |
   |--------|---------|
   | A | School Name |
   | B | Location |
   | C | Contact |
   | D | Email |
   | E | School History |
   | F | Programs |

   **Ministry Sheet** (or "Ministries"):
   | Column | Content |
   |--------|---------|
   | A | Ministry/Apostolate |
   | B | Coordinator/Director |
   | C | Brief Description |

   **Sponsors Sheet**:
   | Column | Content |
   |--------|---------|
   | A | Image URL (publicly accessible image link) |

   **Videos Sheet**:
   | Column | Content |
   |--------|---------|
   | A | Video URL (publicly accessible video link) |

## Google Maps Features

### Parish Location
- **Function**: Search and view parish location
- **Behavior**: Opens Google Maps search for parish address
- **URL Format**: `https://www.google.com/maps/search/?api=1&query=[parish+location]`

### School Location
- **Function**: Get directions from current location to school
- **Behavior**: Opens Google Maps with turn-by-turn directions
- **URL Format**: `https://www.google.com/maps/dir/?api=1&destination=[school+address]&travelmode=driving`
- **Special**: Automatically uses your current location as starting point

## Technical Details

- **Framework**: Expo SDK 53 with React Native 0.76.7
- **Navigation**: React Navigation (Native Stack)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Images**: expo-image for optimized loading
- **API Integration**: Google Sheets API v4
- **State Management**: React hooks (useState, useEffect)

## Design Philosophy

- iOS Human Interface Guidelines
- Clean, modern card-based layouts
- Soft gradient backgrounds
- Rounded corners and shadows
- Smooth press animations
- Search functionality where needed
- Real-time data from Google Sheets

## Assets

All custom imagery integrated:
- **Diocese Logo**: Main logo for welcome screen
- **Parish, BEC, Priest, Ministry, Lay Movement, Vicariate, Schools, Congregation, Corporations, History**: Individual directory icons

## Future Enhancements

Potential features to add:
- Push notifications for updates
- Event calendar and registration
- News feed with articles
- Photo galleries
- Document downloads
- User profiles
- Offline mode with cached data
- Mass schedules
- Online donation system
