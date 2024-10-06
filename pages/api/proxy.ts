import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query, body, headers } = req;
  const targetUrl = process.env.NEXT_PUBLIC_TARGET_URL || 'https://hailuoai.com';

  try {
    console.log('Proxying request to:', req.url);
    const response = await axios({
      method: method as string,
      url: `${targetUrl}${req.url}`,
      params: query,
      data: body,
      headers: {
        ...headers,
        host: new URL(targetUrl).host,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'An error occurred while proxying the request' });
    }
  }
}