const assert = require('node:assert/strict');
const test = require('node:test');

const { Review } = require('../dist/app/modules/review/model.review');
const { productValidations } = require('../dist/app/modules/product/validation.product');

test('review model prevents duplicate reviews by the same customer for a product', () => {
  const indexes = Review.schema.indexes();
  assert.ok(indexes.some(([keys, options]) => keys.product === 1 && keys.user === 1 && options.unique));
});

test('review requests require a complete delivered-order reference', () => {
  const valid = productValidations.addReviewValidationSchema.safeParse({
    body: { rating: 5, orderId: '507f1f77bcf86cd799439011', variantId: '507f1f77bcf86cd799439012' },
  });
  const missingOrder = productValidations.addReviewValidationSchema.safeParse({
    body: { rating: 5, variantId: '507f1f77bcf86cd799439012' },
  });
  assert.equal(valid.success, true);
  assert.equal(missingOrder.success, false);
});
