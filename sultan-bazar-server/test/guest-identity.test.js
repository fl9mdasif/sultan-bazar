const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const config = require('../dist/app/config').default;
const { User } = require('../dist/app/modules/auth/model.auth');
const { authServices } = require('../dist/app/modules/auth/service.auth');
const mongoose = require('mongoose');

test('guest checkout never turns a shipping email into an account identity', async () => {
  const originalCreate = User.create;
  const originalConfig = {
    jwt_access_secret: config.jwt_access_secret,
    jwt_access_expires_in: config.jwt_access_expires_in,
    jwt_refresh_secret: config.jwt_refresh_secret,
    jwt_refresh_expires_in: config.jwt_refresh_expires_in,
  };
  let createdGuest;

  config.jwt_access_secret = 'test-access-secret';
  config.jwt_access_expires_in = '15m';
  config.jwt_refresh_secret = 'test-refresh-secret';
  config.jwt_refresh_expires_in = '7d';
  User.create = async (payload) => {
    createdGuest = payload;
    return { _id: '507f1f77bcf86cd799439011', ...payload };
  };

  try {
    const result = await authServices.guestCheckout('customer@example.com', 'Customer Name', '01700000000');

    assert.equal(createdGuest.isGuest, true);
    assert.equal(createdGuest.role, 'user');
    assert.match(createdGuest.email, /^guest_[a-f0-9-]+@guest\.invalid$/);
    assert.notEqual(createdGuest.email, 'customer@example.com');
    assert.notEqual(createdGuest.password, '123456');
    assert.equal(result.user.email, createdGuest.email);
    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
  } finally {
    User.create = originalCreate;
    Object.assign(config, originalConfig);
  }
});

test('checkout does not disclose a reusable default password', () => {
  const checkoutPage = fs.readFileSync(
    path.resolve(__dirname, '../../sultan-bazar-client/app/checkout/page.tsx'),
    'utf8',
  );

  assert.doesNotMatch(checkoutPage, /Default Password/i);
  assert.doesNotMatch(checkoutPage, /123456/);
  assert.match(checkoutPage, /Guest Checkout/);
});

test.skip('guest checkout persists an isolated identity in the development database', async (t) => {
  assert.ok(config.database_url, 'DATABASE_URL must be configured for integration tests');
  await mongoose.connect(config.database_url);
  t.after(async () => {
    await mongoose.disconnect();
  });

  const result = await authServices.guestCheckout('customer@example.com', 'Customer Name', '01700000000');
  const guest = await User.findById(result.user._id).lean();

  try {
    assert.ok(guest);
    assert.equal(guest.isGuest, true);
    assert.equal(guest.role, 'user');
    assert.match(guest.email, /^guest_[a-f0-9-]+@guest\.invalid$/);
    assert.notEqual(guest.email, 'customer@example.com');
    assert.notEqual(guest.password, '123456');
  } finally {
    await User.deleteOne({ _id: result.user._id });
  }
});
