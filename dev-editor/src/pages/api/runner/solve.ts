import type { NextApiRequest, NextApiResponse } from 'next';
import { TTestResponse } from '@agorapp-dao/editor-common/src/types/TTestResponse';
import { TTestRequest } from '@agorapp-dao/editor-common/src/types/TTestRequest';
import { getRunnerUrl } from '@/src/utils/getRunnerUrl';

type ResponseError = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TTestResponse | ResponseError>,
) {
  try {
    switch (req.method) {
      case 'POST':
        await post(req, res);
        break;
      default:
        res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function post(req: NextApiRequest, res: NextApiResponse<TTestResponse>) {
  const body = req.body as TTestRequest;
  if (!body.runner) throw new Error('runner is required');
  if (!body.courseSlug) throw new Error('courseSlug is required');
  if (!body.lessonSlug) throw new Error('lessonSlug is required');
  if (!body.files) throw new Error('files are required');

  let baseUrl = getRunnerUrl(body.runner);

  const response = await fetch(`${baseUrl}/v1/solve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Request to ${response.url} failed with ${response.status}`);
    console.error(text);
    throw new Error(`Request failed`);
  }

  const json = await response.json();
  res.status(200).json(json);
}
