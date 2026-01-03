# How to Add Playlist Cover Image

## Steps:

1. **Save your image file** to the `public/images/` folder
   - Recommended filename: `playlist-cover.jpg` (or `.png`)
   - Full path: `/Users/yashbaing/Documents/base mini audio app/public/images/playlist-cover.jpg`

2. **Supported formats**: JPG, PNG, WEBP

3. **The image will automatically appear** on your default playlist once saved

4. **To set a cover image for other playlists**, you can:
   - Open the browser console (F12)
   - Run: `localStorage.getItem('base-music-playlists')`
   - Edit the JSON to add `"coverImage": "/images/your-image.jpg"` to any playlist
   - Refresh the page

## Quick Add:

1. The images folder is open in Finder
2. Drag and drop your image file there
3. Rename it to `playlist-cover.jpg` if needed
4. Refresh your browser - the image should appear!

