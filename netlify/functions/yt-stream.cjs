// Audio streaming function for Netlify
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { url, quality = '160kbps' } = event.queryStringParameters || {};

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing URL parameter' })
      };
    }

    // For Netlify, we'll proxy the audio URL
    // Note: This is a simplified version. For production, consider using a proper audio extraction service

    const audioUrl = decodeURIComponent(url);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: audioUrl,
        quality,
        message: 'Direct URL returned. For full functionality, consider using Vercel or a dedicated audio service.'
      })
    };

  } catch (error) {
    console.error('Audio stream error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Streaming failed', details: error.message })
    };
  }
};