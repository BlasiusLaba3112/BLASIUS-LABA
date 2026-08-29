export type UserRoleType = 'admin' | 'viewer';

export interface AuthUser {
  username: string;
  fullName: string;
  role: string;
  roleType: UserRoleType;
  workUnit: string;
  email?: string;
  loginTime: string;
}

export const REGISTERED_CREDENTIALS = {
  username: 'shyllpb@2026',
  password: 'Boganatar@2026',
  fullName: 'shyllpb',
  role: 'Administrator SIMPEG & Wilayah',
  roleType: 'admin' as UserRoleType,
  workUnit: 'UPT Puskesmas Boganatar - Dinkes Kab. Sikka'
};

export function isUserAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.roleType === 'admin' || user.username.toLowerCase() === REGISTERED_CREDENTIALS.username.toLowerCase();
}
