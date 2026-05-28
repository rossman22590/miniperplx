import { getTweet } from 'react-tweet/api';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || !/^\d+$/.test(id)) {
    return Response.json({ error: 'A valid tweet id is required.' }, { status: 400 });
  }

  try {
    const tweet = await getTweet(id);
    return Response.json(
      { tweet: tweet ?? null },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        },
      },
    );
  } catch (error) {
    console.warn(`Failed to fetch tweet ${id}:`, error);
    return Response.json({ tweet: null }, { status: 200 });
  }
}
