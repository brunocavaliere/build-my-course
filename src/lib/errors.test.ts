import { DEFAULT_ERROR_MESSAGES, getErrorMessage } from '@/lib/errors';

describe('getErrorMessage', () => {
  it('returns the message from an Error instance', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('returns the provided string when it is not empty', () => {
    expect(getErrorMessage('custom message')).toBe('custom message');
  });

  it('falls back when the error is empty or unsupported', () => {
    expect(getErrorMessage('   ')).toBe(DEFAULT_ERROR_MESSAGES.genericDescription);
    expect(getErrorMessage(null, 'fallback')).toBe('fallback');
  });
});
