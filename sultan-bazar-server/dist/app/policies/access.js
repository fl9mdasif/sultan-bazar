"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_POLICY = void 0;
const const_auth_1 = require("../modules/auth/const.auth");
exports.ACCESS_POLICY = {
    manageOwnAccount: [const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin],
    manageOwnCart: [const_auth_1.USER_ROLE.user],
    placeOrder: [const_auth_1.USER_ROLE.user],
    manageCatalog: [const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin],
    manageCategories: [const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin],
    manageOrders: [const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin],
    viewSalesAnalytics: [const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin],
    listUsers: [const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin],
    manageUserRoles: [const_auth_1.USER_ROLE.superAdmin],
    manageUserBlocks: [const_auth_1.USER_ROLE.superAdmin],
    deleteUsers: [const_auth_1.USER_ROLE.superAdmin],
};
