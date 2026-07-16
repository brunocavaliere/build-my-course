describe('auth module', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('configures auth with both providers and adapter when dependencies exist', async () => {
    const nextAuthMock = vi.fn(() => ({
      handlers: {},
      auth: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    }));
    const githubMock = vi.fn((config) => ({ kind: 'github', config }));
    const googleMock = vi.fn((config) => ({ kind: 'google', config }));
    const adapterMock = vi.fn(() => 'adapter');

    vi.doMock('next-auth', () => ({
      default: nextAuthMock,
    }));
    vi.doMock('next-auth/providers/github', () => ({
      default: githubMock,
    }));
    vi.doMock('next-auth/providers/google', () => ({
      default: googleMock,
    }));
    vi.doMock('@auth/drizzle-adapter', () => ({
      DrizzleAdapter: adapterMock,
    }));
    vi.doMock('@/db', () => ({
      db: { client: true },
      isDatabaseConfigured: true,
    }));
    vi.doMock('@/db/schema', () => ({
      accounts: { table: 'accounts' },
      users: { table: 'users' },
    }));
    vi.doMock('@/env', () => ({
      env: {
        AUTH_GITHUB_ID: 'gh-id',
        AUTH_GITHUB_SECRET: 'gh-secret',
        AUTH_GOOGLE_ID: 'goo-id',
        AUTH_GOOGLE_SECRET: 'goo-secret',
        AUTH_SECRET: 'secret',
      },
    }));

    const authModule = await import('@/auth');

    expect(authModule.isGitHubAuthConfigured).toBe(true);
    expect(authModule.isGoogleAuthConfigured).toBe(true);
    expect(authModule.isAnyAuthProviderConfigured).toBe(true);
    expect(authModule.isAuthReady).toBe(true);
    expect(githubMock).toHaveBeenCalledWith({
      clientId: 'gh-id',
      clientSecret: 'gh-secret',
    });
    expect(googleMock).toHaveBeenCalledWith({
      clientId: 'goo-id',
      clientSecret: 'goo-secret',
      allowDangerousEmailAccountLinking: true,
    });
    expect(adapterMock).toHaveBeenCalled();
    expect(nextAuthMock).toHaveBeenCalled();

    const config = nextAuthMock.mock.calls[0]?.[0];
    expect(config.providers).toHaveLength(2);
    expect(config.pages.signIn).toBe('/login');
    expect(config.callbacks.jwt({ token: {}, user: { id: 'user-1' } })).toEqual({ id: 'user-1' });
    expect(
      config.callbacks.session({
        session: { user: {} },
        token: { id: 'token-id', sub: 'sub-id' },
      })
    ).toEqual({ user: { id: 'token-id' } });
  });

  it('disables auth readiness when database or providers are missing', async () => {
    const nextAuthMock = vi.fn(() => ({
      handlers: {},
      auth: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    }));

    vi.doMock('next-auth', () => ({
      default: nextAuthMock,
    }));
    vi.doMock('next-auth/providers/github', () => ({
      default: vi.fn(),
    }));
    vi.doMock('next-auth/providers/google', () => ({
      default: vi.fn(),
    }));
    vi.doMock('@auth/drizzle-adapter', () => ({
      DrizzleAdapter: vi.fn(),
    }));
    vi.doMock('@/db', () => ({
      db: null,
      isDatabaseConfigured: false,
    }));
    vi.doMock('@/db/schema', () => ({
      accounts: {},
      users: {},
    }));
    vi.doMock('@/env', () => ({
      env: {
        AUTH_GITHUB_ID: undefined,
        AUTH_GITHUB_SECRET: undefined,
        AUTH_GOOGLE_ID: undefined,
        AUTH_GOOGLE_SECRET: undefined,
        AUTH_SECRET: 'secret',
      },
    }));

    const authModule = await import('@/auth');

    expect(authModule.isGitHubAuthConfigured).toBe(false);
    expect(authModule.isGoogleAuthConfigured).toBe(false);
    expect(authModule.isAnyAuthProviderConfigured).toBe(false);
    expect(authModule.isAuthReady).toBe(false);

    const config = nextAuthMock.mock.calls[0]?.[0];
    expect(config.adapter).toBeUndefined();
    expect(config.providers).toEqual([]);
  });
});
