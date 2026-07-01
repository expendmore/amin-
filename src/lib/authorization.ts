/**
 * Role Enum defining the supported user roles in the B2B multi-tenant application.
 */
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
  OWNER = "OWNER",
}

/**
 * Permission Enum defining granular operations.
 */
export enum Permission {
  ALL = "ALL",
  READ_CAMPAIGNS = "READ_CAMPAIGNS",
  WRITE_CAMPAIGNS = "WRITE_CAMPAIGNS",
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_BILLING = "MANAGE_BILLING",
  CONNECT_GATEWAY = "CONNECT_GATEWAY",
  VIEW_ANALYTICS = "VIEW_ANALYTICS",
}

/**
 * Mapping of Roles to their explicit Permissions list.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [Permission.ALL],
  [Role.OWNER]: [
    Permission.READ_CAMPAIGNS,
    Permission.WRITE_CAMPAIGNS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_BILLING,
    Permission.CONNECT_GATEWAY,
    Permission.VIEW_ANALYTICS,
  ],
  [Role.ADMIN]: [
    Permission.READ_CAMPAIGNS,
    Permission.WRITE_CAMPAIGNS,
    Permission.MANAGE_USERS,
    Permission.CONNECT_GATEWAY,
    Permission.VIEW_ANALYTICS,
  ],
  [Role.STAFF]: [
    Permission.READ_CAMPAIGNS,
    Permission.WRITE_CAMPAIGNS,
    Permission.VIEW_ANALYTICS,
  ],
  [Role.CUSTOMER]: [
    Permission.READ_CAMPAIGNS,
    Permission.VIEW_ANALYTICS,
  ],
};

/**
 * Priority numeric ranking for roles to determine hierarchical access.
 */
const ROLE_PRIORITY: Record<Role, number> = {
  [Role.CUSTOMER]: 0,
  [Role.STAFF]: 1,
  [Role.ADMIN]: 2,
  [Role.OWNER]: 3,
  [Role.SUPER_ADMIN]: 4,
};

/**
 * Checks if the user's role meets or exceeds the required hierarchical role.
 * @param userRole The active user role.
 * @param requiredRole The target minimum role level required.
 */
export function checkRole(userRole: Role, requiredRole: Role): boolean {
  const userScore = ROLE_PRIORITY[userRole] ?? -1;
  const requiredScore = ROLE_PRIORITY[requiredRole] ?? 0;
  return userScore >= requiredScore;
}

/**
 * Checks if the user's role has explicit permission to execute an operation.
 * @param userRole The active user role.
 * @param requiredPermission The target operation permission.
 */
export function checkPermission(userRole: Role, requiredPermission: Permission): boolean {
  if (userRole === Role.SUPER_ADMIN) return true;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(Permission.ALL) || permissions.includes(requiredPermission);
}
