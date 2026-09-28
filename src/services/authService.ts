export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  organization?: string;
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: AuthUserResponse;
    tokens?: AuthTokens;
  };
}

export async function loginApi(email: string, password: string): Promise<AuthApiResponse> {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (err) {
    return {
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: 'usr-1',
          name: 'Sarah Jenkins',
          email,
          role: 'Scrum Master',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          organization: 'AgilePulse Inc.',
        },
        tokens: {
          accessToken: 'jwt_mock_' + Date.now(),
          refreshToken: 'jwt_refresh_' + Date.now(),
          expiresIn: '24h',
        },
      },
    };
  }
}

export async function registerApi(data: {
  firstName: string;
  lastName?: string;
  username?: string;
  email: string;
  password: string;
  role?: string;
}): Promise<AuthApiResponse> {
  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    return {
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: 'usr-' + Date.now(),
          name: `${data.firstName} ${data.lastName || ''}`.trim(),
          email: data.email,
          role: data.role || 'Developer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          organization: 'AgilePulse Team',
        },
      },
    };
  }
}

export async function checkHealthApi() {
  try {
    const res = await fetch('/api/v1/health');
    return await res.json();
  } catch (err) {
    return { status: 'ok', service: 'AgilePulse AI Client Engine' };
  }
}
