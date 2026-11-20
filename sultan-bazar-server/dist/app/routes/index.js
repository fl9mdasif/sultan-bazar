"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_auth_1 = require("../modules/auth/route.auth");
const router_category_1 = require("../modules/category/router.category");
const router_product_1 = require("../modules/product/router.product");
const route_order_1 = require("../modules/order/route.order");
const route_user_1 = require("../modules/user/route.user");
const route_cart_1 = require("../modules/cart/route.cart");
const authRateLimit_1 = require("../middlewares/authRateLimit");
const route_upload_1 = require("../modules/upload/route.upload");
const router = (0, express_1.Router)();
const moduleRoute = [
    {
        path: '/auth',
        route: route_auth_1.authRoute,
    },
    {
        path: '/categories',
        route: router_category_1.categoryRoutes,
    },
    {
        path: '/products',
        route: router_product_1.productRoutes,
    },
    {
        path: '/orders',
        route: route_order_1.orderRoutes,
    },
    {
        path: '/users',
        route: route_user_1.userRoutes,
    },
    {
        path: '/carts',
        route: route_cart_1.cartRoutes,
    },
    {
        path: '/uploads',
        route: route_upload_1.ImageUploads,
    },
];
moduleRoute.forEach((routeObj) => {
    if (routeObj.path === '/auth') {
        router.use(routeObj.path, authRateLimit_1.authRateLimit, routeObj.route);
        return;
    }
    router.use(routeObj.path, routeObj.route);
});
exports.default = router;
