const assert = require('node:assert/strict');
const test = require('node:test');

const { ACCESS_POLICY } = require('../dist/app/policies/access');

test('customers alone can place orders and manage carts', () => {
  assert.deepEqual(ACCESS_POLICY.placeOrder, ['user']);
  assert.deepEqual(ACCESS_POLICY.manageOwnCart, ['user']);
});

test('catalog and order operations are restricted to staff roles', () => {
  assert.deepEqual(ACCESS_POLICY.manageCatalog, ['admin', 'superAdmin']);
  assert.deepEqual(ACCESS_POLICY.manageOrders, ['admin', 'superAdmin']);
});

test('only a super admin can change roles, block accounts, or delete accounts', () => {
  assert.deepEqual(ACCESS_POLICY.manageUserRoles, ['superAdmin']);
  assert.deepEqual(ACCESS_POLICY.manageUserBlocks, ['superAdmin']);
  assert.deepEqual(ACCESS_POLICY.deleteUsers, ['superAdmin']);
});
