// GitHub Pages compatible search - simplified version
export const searchYouTubeForPages = async (query: string) => {
  // For GitHub Pages, we'll use a simplified approach
  // Return empty results to avoid API errors
  return {
    videos: [],
    error: "YouTube search requires backend API. Use local files or Vercel deployment for full functionality."
  };
};

// Alternative: Use YouTube embed URLs directly
export const createYouTubeTrack = (videoId: string, title: string, author: string) => ({
  id: videoId,
  title,
  artist: author,
  album: "YouTube",
  cover: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  src: `https://www.youtube.com/watch?v=${videoId}`,
  duration: 0, // Will be determined by player
  type: "youtube" as const,
  songId: videoId,
});