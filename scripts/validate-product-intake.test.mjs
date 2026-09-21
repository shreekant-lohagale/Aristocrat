import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { readinessIssues, validateIntake } from './validate-product-intake.mjs';

const products = JSON.parse(readFileSync(resolve('catalog-intake/products-1-27.json'), 'utf8')).records;
const candidate = JSON.parse(readFileSync(resolve('catalog-intake/product-28-candidate.json'), 'utf8'));

test('source intake maps all approved numbers and keeps every item blocked', () => {
  const result = validateIntake();
  assert.deepEqual(result.errors, []);
  assert.equal(result.productCount, 27);
  assert.equal(result.readyCount, 0);
  assert.equal(candidate.publicationStatus, 'blocked');
  assert.equal(candidate.candidateType, 'image-only');
  assert.ok(readinessIssues(candidate).includes('confirmed ISO currency'));
  assert.ok(readinessIssues(candidate).includes('size'));
});

for (const number of [1, 4, 13, 27]) {
  test(`Product ${number} cannot pass readiness`, () => {
    const product = products.find((item) => item.sourceId === `product-${number}`);
    assert.equal(product.publicationStatus, 'blocked');
    assert.equal(product.sourcePriceAmount, number === 1 ? 25 : number === 4 ? 30 : 20);
    assert.ok(readinessIssues(product).includes('confirmed ISO currency'));
    assert.ok(readinessIssues(product).includes('size'));
    assert.ok(readinessIssues(product).includes('exact items included'));
  });
}

test('complete commercial fields and explicit publish approval are required for readiness', () => {
  const complete = {
    ...products[0], publicTitle: 'Approved title', category: 'Approved category', priceCurrency: 'USD',
    regularPrice: 100, size: 'Approved size', imageApproval: 'approved', includedItems: ['Approved item'], publishApproved: true,
  };
  assert.deepEqual(readinessIssues(complete), []);
  assert.ok(readinessIssues({ ...complete, priceCurrency: null }).includes('confirmed ISO currency'));
  assert.ok(readinessIssues({ ...complete, size: null }).includes('size'));
  assert.ok(readinessIssues({ ...complete, publishApproved: null }).includes('client publish approval'));
});
