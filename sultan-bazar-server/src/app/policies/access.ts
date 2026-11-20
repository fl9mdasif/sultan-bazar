import { USER_ROLE } from '../modules/auth/const.auth';
import { TUserRole } from '../modules/auth/interface.auth';

export const ACCESS_POLICY = {
  manageOwnAccount: [USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin],
  manageOwnCart: [USER_ROLE.user],
  placeOrder: [USER_ROLE.user],
  manageCatalog: [USER_ROLE.admin, USER_ROLE.superAdmin],
  manageCategories: [USER_ROLE.admin, USER_ROLE.superAdmin],
  manageOrders: [USER_ROLE.admin, USER_ROLE.superAdmin],
  viewSalesAnalytics: [USER_ROLE.admin, USER_ROLE.superAdmin],
  listUsers: [USER_ROLE.admin, USER_ROLE.superAdmin],
  manageUserRoles: [USER_ROLE.superAdmin],
  manageUserBlocks: [USER_ROLE.superAdmin],
  deleteUsers: [USER_ROLE.superAdmin],
} as const satisfies Record<string, readonly TUserRole[]>;

export type AccessAction = keyof typeof ACCESS_POLICY;
