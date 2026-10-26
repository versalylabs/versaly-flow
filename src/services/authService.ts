/**
 * PulseBrand Agency OS - Authentication Service
 * Phase 03: Authentication
 */

import { User, AuthSession, LoginCredentials, RegisterPayload, Role } from '../types';
import { storageService } from './storageService';
import { eventBus } from './eventBus';
import { INITIAL_USERS } from '../data/seedData';

class AuthService {
  private sessionKey = 'auth_session';
  private usersKey = 'auth_users_registry';
  private passwordsKey = 'auth_user_passwords_registry';

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    const existingUsers = storageService.getItem<User[]>(this.usersKey, []);
    if (!existingUsers || existingUsers.length === 0) {
      storageService.setItem(this.usersKey, INITIAL_USERS);
    } else {
      // Ensure super_admin versalylabs@gmail.com is present even if localStorage was pre-seeded
      const hasSuperAdmin = existingUsers.some(u => u.email.toLowerCase() === 'versalylabs@gmail.com');
      if (!hasSuperAdmin) {
        const superAdminUser = INITIAL_USERS.find(u => u.email.toLowerCase() === 'versalylabs@gmail.com');
        if (superAdminUser) {
          existingUsers.unshift(superAdminUser);
          storageService.setItem(this.usersKey, existingUsers);
        }
      }
    }

    // Initialize passwords mapping
    const existingPasswords = storageService.getItem<Record<string, string>>(this.passwordsKey, {});
    if (!existingPasswords['versalylabs@gmail.com']) {
      existingPasswords['versalylabs@gmail.com'] = 'labversaly-16';
      existingPasswords['wanjiku@apexmedia.co.ke'] = 'labversaly-16';
      storageService.setItem(this.passwordsKey, existingPasswords);
    }
  }

  public getUsers(): User[] {
    return storageService.getItem<User[]>(this.usersKey, INITIAL_USERS);
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    storageService.setItem(this.usersKey, users);
  }

  public getCurrentSession(): AuthSession | null {
    const session = storageService.getItem<AuthSession | null>(this.sessionKey, null);
    if (!session) return null;

    // Check expiry
    const now = new Date().getTime();
    const expiry = new Date(session.expiresAt).getTime();
    if (now > expiry) {
      storageService.removeItem(this.sessionKey);
      if (session.user) {
        eventBus.emit('auth:logged_out', { userId: session.user.id, reason: 'Session expired' }, {
          actorId: session.user.id,
          actorName: session.user.name
        });
      }
      return null;
    }

    return session;
  }

  public login(credentials: LoginCredentials): { success: boolean; session?: AuthSession; error?: string } {
    const users = this.getUsers();
    const normalizedEmail = credentials.email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase().trim() === normalizedEmail);

    if (!user) {
      return {
        success: false,
        error: `No agency account located for "${credentials.email}". Please verify or register a new workspace account.`
      };
    }

    // Password verification
    const passwords = storageService.getItem<Record<string, string>>(this.passwordsKey, {});
    const registeredPassword = passwords[normalizedEmail];

    if (normalizedEmail === 'versalylabs@gmail.com') {
      if (credentials.password && credentials.password !== 'labversaly-16') {
        return {
          success: false,
          error: 'Incorrect password for versalylabs@gmail.com. Expected "labversaly-16".'
        };
      }
    } else if (registeredPassword) {
      if (credentials.password && credentials.password !== registeredPassword) {
        return {
          success: false,
          error: 'Invalid password. Please verify your credentials or reset your password.'
        };
      }
    }

    // Update user login metadata
    const updatedUser: User = {
      ...user,
      lastLoginAt: new Date().toISOString()
    };
    this.saveUser(updatedUser);

    // Create session (24h or 7d if rememberMe)
    const durationHours = credentials.rememberMe ? 24 * 7 : 24;
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

    const session: AuthSession = {
      token: `pba_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      refreshToken: `pba_rfk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt,
      user: updatedUser,
      provider: credentials.provider,
      ipAddress: '192.168.1.1 (Verified Gateway)',
      deviceInfo: (typeof navigator !== 'undefined' && navigator?.userAgent?.includes('Mac')) ? 'macOS Safari / Chromium' : 'Workstation Client'
    };

    storageService.setItem(this.sessionKey, session);

    eventBus.emit('auth:logged_in', { userId: updatedUser.id, email: updatedUser.email, provider: credentials.provider }, {
      actorId: updatedUser.id,
      actorName: updatedUser.name
    });

    return { success: true, session };
  }

  public register(payload: RegisterPayload): { success: boolean; session?: AuthSession; error?: string } {
    const users = this.getUsers();
    const normalizedEmail = payload.email.toLowerCase().trim();

    if (users.some(u => u.email.toLowerCase().trim() === normalizedEmail)) {
      return {
        success: false,
        error: 'An account with this work email already exists. Please log in instead.'
      };
    }

    // For non-super_admin registrations, ALWAYS provision a dedicated, completely clean empty workspace!
    const agencyName = payload.agencyName?.trim() || `${payload.name.trim()}'s Agency`;
    const cleanSlug = (payload.agencySlug || agencyName.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/--+/g, '-').replace(/^-|-$/g, '') || `agency-${Date.now().toString(36)}`;
    const tenantId = payload.role === 'super_admin' ? 'workspace_apex_nairobi' : `workspace_${cleanSlug}_${Date.now()}`;

    if (tenantId !== 'workspace_apex_nairobi') {
      // Persist workspace to workspaces storage
      try {
        const storedWorkspaces = storageService.getItem<any[]>('pulsebrand_os_v1_workspaces', []);
        const newWorkspace = {
          id: tenantId,
          name: agencyName,
          slug: cleanSlug,
          tier: 'boutique',
          timezone: 'Africa/Nairobi (EAT)',
          currency: 'KES (KSh)',
          city: 'Nairobi',
          country: 'Kenya',
          supportEmail: normalizedEmail,
          billingProvider: 'mpesa_daraja',
          customDomain: `${cleanSlug}.agencyportal.io`,
          logoUrl: '/logo.png',
          createdAt: new Date().toISOString(),
          memberCount: 1,
          clientCount: 0
        };
        const existingIdx = storedWorkspaces.findIndex(w => w.id === tenantId);
        if (existingIdx >= 0) {
          storedWorkspaces[existingIdx] = newWorkspace;
        } else {
          storedWorkspaces.push(newWorkspace);
        }
        storageService.setItem('pulsebrand_os_v1_workspaces', storedWorkspaces);
        storageService.setItem('pulsebrand_os_v1_workspace', newWorkspace);
      } catch (e) {
        console.warn('Workspace registration note:', e);
      }
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      role: payload.role || 'agency_owner',
      tenantId: tenantId,
      assignedClientIds: [],
      createdAt: new Date().toISOString(),
      emailVerified: true,
      lastLoginAt: new Date().toISOString(),
      jobTitle: payload.role === 'super_admin' ? 'Platform Administrator' : 'Agency Principal / Director',
      mfaEnabled: false
    };

    this.saveUser(newUser);

    // Save password
    if (payload.password) {
      const passwords = storageService.getItem<Record<string, string>>(this.passwordsKey, {});
      passwords[normalizedEmail] = payload.password;
      storageService.setItem(this.passwordsKey, passwords);
    }

    const session: AuthSession = {
      token: `pba_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      refreshToken: `pba_rfk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user: newUser,
      provider: 'email_password',
      ipAddress: '127.0.0.1 (Self-Provisioned)',
      deviceInfo: 'Agency OS Onboarded Client'
    };

    storageService.setItem(this.sessionKey, session);

    eventBus.emit('auth:registered', { userId: newUser.id, role: newUser.role, email: newUser.email }, {
      actorId: newUser.id,
      actorName: newUser.name
    });

    return { success: true, session };
  }

  public refreshSession(): AuthSession | null {
    const current = this.getCurrentSession();
    if (!current) return null;

    const refreshed: AuthSession = {
      ...current,
      token: `pba_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    storageService.setItem(this.sessionKey, refreshed);
    eventBus.emit('auth:session_refreshed', { userId: refreshed.user.id }, {
      actorId: refreshed.user.id,
      actorName: refreshed.user.name
    });

    return refreshed;
  }

  public updateProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    storageService.setItem(this.usersKey, users);

    // If current session belongs to this user, update session as well
    const session = this.getCurrentSession();
    if (session && session.user.id === userId) {
      session.user = updated;
      storageService.setItem(this.sessionKey, session);
    }

    eventBus.emit('auth:profile_updated', { userId, updates }, {
      actorId: updated.id,
      actorName: updated.name
    });

    return updated;
  }

  public requestPasswordReset(email: string): { success: boolean; message: string } {
    eventBus.emit('auth:password_reset_requested', { email });
    return {
      success: true,
      message: `Password reset recovery link dispatched to ${email}. Check inbox for secure one-time token.`
    };
  }

  public logout(reason = 'User initiated logout'): void {
    const session = storageService.getItem<AuthSession | null>(this.sessionKey, null);
    storageService.removeItem(this.sessionKey);
    if (session && session.user) {
      eventBus.emit('auth:logged_out', { userId: session.user.id, reason }, {
        actorId: session.user.id,
        actorName: session.user.name
      });
    }
  }
}

export const authService = new AuthService();
