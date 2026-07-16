describe('env module', () => {
  const originalEnv = { ...process.env };
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    if (typeof originalWindow === 'undefined') {
      delete (globalThis as Partial<typeof globalThis>).window;
    } else {
      globalThis.window = originalWindow;
    }
  });

  it('parses server and client env successfully on the server', async () => {
    delete (globalThis as Partial<typeof globalThis>).window;
    process.env.AUTH_SECRET = 'secret';
    process.env.DATABASE_URL = 'postgres://db.example.com/app';
    process.env.NEXT_PUBLIC_APP_NAME = 'Build My Course';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.OPENAI_API_KEY = 'openai-key';
    process.env.OPENAI_MODEL = 'gpt-test';

    const { env } = await import('@/env');

    expect(env.AUTH_SECRET).toBe('secret');
    expect(env.isDatabaseConfigured).toBe(true);
    expect(env.isMigrationDatabaseConfigured).toBe(true);
    expect(env.isOpenAiConfigured).toBe(true);
    expect(env.openAiModel).toBe('gpt-test');
  });

  it('throws formatted errors for invalid server env', async () => {
    delete (globalThis as Partial<typeof globalThis>).window;
    process.env.AUTH_SECRET = '';
    process.env.NEXT_PUBLIC_APP_NAME = 'Build My Course';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.AUTH_GITHUB_ID = 'only-id';

    await expect(import('@/env')).rejects.toThrow(/Invalid server environment variables:/);
  });

  it('uses the browser-safe branch on the client', async () => {
    globalThis.window = originalWindow;
    process.env.NEXT_PUBLIC_APP_NAME = 'Build My Course';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.AUTH_SECRET = 'secret';

    const { env } = await import('@/env');

    expect(env.NEXT_PUBLIC_APP_NAME).toBe('Build My Course');
    expect(env.isDatabaseConfigured).toBe(false);
    expect(env.openAiModel).toBe('gpt-4o-mini');
  });
});
