# Midjourney Inspiration Gallery

A beautiful, responsive single-page website for sharing and exploring AI-generated Midjourney images with their prompts.

## Features

- 🖼️ Beautiful responsive masonry layout
- 🔍 Prompt search functionality
- 🌓 Light/dark theme toggle
- ⬆️ Simple image upload with prompt
- ❤️ Image like functionality
- ⬇️ Image download functionality
- 🔄 Sort by popularity or latest uploads

## Technology Stack

- HTML5
- Tailwind CSS (loaded via CDN)
- Vanilla JavaScript
- Font Awesome icons (loaded via CDN)

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/midjourney-inspiration-gallery.git
   cd midjourney-inspiration-gallery
   ```

2. Start a local server:
   ```
   # If you have Python 3 installed
   python -m http.server
   
   # Or if you have Node.js installed
   npx serve
   ```

3. Visit `http://localhost:8000` or the corresponding port in your browser

## Deploying to a Live Server

### Using GitHub Pages

1. Create a GitHub repository
2. Push your code to the main branch or `gh-pages` branch
3. Enable GitHub Pages in the repository settings

### Using Other Static Site Hosting Services

The project can be easily deployed to any static site hosting service, such as:
- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront

## Adding Backend Functionality

The current version uses local storage to simulate data. To add real backend functionality, you can:

### Use Firebase (Recommended)

1. Create a Firebase account and project
2. Add the Firebase SDK to the project
3. Use Firebase Authentication for user authentication
4. Use Firebase Storage to store images
5. Use Firestore database to store image metadata and likes information

### Or Create a Custom Backend

1. Create an API using Node.js (Express), Python (Django/Flask), or other backend technologies
2. Implement user authentication
3. Implement image upload, storage, and retrieval functionality
4. Implement like and download statistics functionality

## SEO Optimization

This project already includes basic SEO optimization:

- Uses semantic HTML tags
- Includes appropriate meta tags
- Responsive design for mobile devices
- Images include alt attributes

To further optimize SEO, consider:

- Adding structured data
- Implementing server-side rendering or pre-rendering
- Adding sitemap.xml
- Registering with Google Search Console

## Contributing

Pull Requests and Issues are welcome!

## License

MIT 