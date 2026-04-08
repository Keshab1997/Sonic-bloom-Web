// Simplified YouTube Search API for Netlify
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { query } = event.queryStringParameters || {};

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      videos: [],
      message: 'YouTube search requires API key. Add YOUTUBE_API_KEY to enable full functionality.',
      query: query || ''
    })
  };
};