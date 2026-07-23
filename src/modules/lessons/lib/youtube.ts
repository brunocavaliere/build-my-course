const YOUTUBE_HOSTS = new Set([
  'youtu.be',
  'www.youtu.be',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
]);

function extractVideoId(pathname: string, searchParams: URLSearchParams) {
  if (pathname === '/watch') {
    return searchParams.get('v');
  }

  if (pathname.startsWith('/embed/')) {
    return pathname.split('/')[2] ?? null;
  }

  if (pathname.startsWith('/shorts/')) {
    return pathname.split('/')[2] ?? null;
  }

  const pathParts = pathname.split('/').filter(Boolean);

  if (pathParts.length === 1) {
    return pathParts[0] ?? null;
  }

  return null;
}

export function getYoutubeEmbedUrl(url: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (!YOUTUBE_HOSTS.has(parsedUrl.hostname)) {
      return null;
    }

    const videoId = extractVideoId(parsedUrl.pathname, parsedUrl.searchParams);

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
