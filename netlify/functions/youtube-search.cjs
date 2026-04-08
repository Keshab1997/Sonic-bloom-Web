// YouTube Search API for Netlify with API Key
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query } = event.queryStringParameters || {};

    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing query parameter' })
      };
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          videos: [],
          message: 'YouTube API key not configured in Netlify environment variables'
        })
      };
    }

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query + ' music')}&key=${API_KEY}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'YouTube API error',
          details: data.error.message
        })
      };
    }

    const videos = data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default?.url || item.snippet.thumbnails.medium?.url,
      duration: 0
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ videos })
    };

  } catch (error) {
    console.error('YouTube search error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Search failed',
        details: error.message
      })
    };
  }
};