# Ex Rater - Progressive Web App

A modern iOS-style progressive web app for rating and comparing your ex-partners across multiple dimensions.

## Features

- **Rate Exes**: Score your exes on 11 default dimensions (Communication, Emotional Support, etc.)
- **Custom Dimensions**: Add your own rating categories
- **Weighted Scoring**: Set importance weights (1-5) for each dimension
- **Detailed Profiles**: Store name, location, height, weight for each ex
- **Smart Sorting**: Sort by score, name, or other criteria
- **Favorites**: Mark your favorite exes
- **Notes**: Add detailed notes for each dimension rating
- **Search**: Find exes by name
- **Responsive Design**: Optimized for iOS devices
- **Offline Support**: Works without internet connection

## Installation

1. Open the app in Safari on your iOS device
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will install like a native iOS app

## Usage

### Adding an Ex
1. Tap the "+" button in the header
2. Fill in their details (name is required)
3. Save to add them to your list

### Rating an Ex
1. Find the ex in your list
2. Tap "Rate" button
3. Use sliders to rate each dimension (1-10)
4. Add notes for specific dimensions
5. Save your ratings

### Managing Dimensions
1. Tap "Dimensions" in the bottom navigation
2. Adjust weights (1-5) for existing dimensions
3. Add custom dimensions with the "+" button
4. Delete dimensions you don't need

### Viewing Results
- Exes are automatically sorted by weighted score
- Higher scores indicate better overall ratings
- Use search and sort options to find specific exes

## Technical Details

- Pure HTML, CSS, and JavaScript
- Local storage for data persistence
- Service worker for offline functionality
- Responsive design optimized for mobile
- PWA manifest for app-like installation

## Development

To run locally:
1. Serve the files from a web server
2. Open in browser
3. Use browser dev tools to simulate mobile device

The app stores all data locally in browser storage - no server required.