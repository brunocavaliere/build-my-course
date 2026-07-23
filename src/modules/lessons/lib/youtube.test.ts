import { getYoutubeEmbedUrl } from '@/modules/lessons/lib/youtube';

describe('getYoutubeEmbedUrl', () => {
  it('returns an embed URL for standard watch links', () => {
    expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ'
    );
  });

  it('returns an embed URL for short links', () => {
    expect(getYoutubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ'
    );
  });

  it('returns null for non-youtube links', () => {
    expect(getYoutubeEmbedUrl('https://example.com/video')).toBeNull();
  });
});
