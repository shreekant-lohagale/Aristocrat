import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'));
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const knownCurrencies = new Set(Intl.supportedValuesOf('currency'));

export function readinessIssues(product) {
  const issues = [];
  if (!hasText(product.publicTitle)) issues.push('final title');
  if (!hasText(product.category)) issues.push('category');
  if (!knownCurrencies.has(product.priceCurrency)) issues.push('confirmed ISO currency');
  if (typeof product.regularPrice !== 'number' || !Number.isFinite(product.regularPrice) || product.regularPrice <= 0) issues.push('regular price');
  if (!hasText(product.size)) issues.push('size');
  if (!Number.isSafeInteger(product.quantity) || product.quantity < 0) issues.push('quantity');
  if (product.imageApproval !== 'approved') issues.push('approved product image');
  if (!Array.isArray(product.includedItems) || product.includedItems.length === 0 || product.includedItems.some((item) => !hasText(item))) issues.push('exact items included');
  if (product.publishApproved !== true) issues.push('client publish approval');
  if (product.salePrice !== null && (typeof product.salePrice !== 'number' || !Number.isFinite(product.salePrice) || product.salePrice <= 0 || product.salePrice >= product.regularPrice)) issues.push('valid sale price');
  return issues;
}

export function validateIntake() {
  const errors = [];
  const { records, sourceCsv } = readJson('catalog-intake/products-1-27.json');
  const candidate = readJson('catalog-intake/product-28-candidate.json');
  const { models } = readJson('catalog-intake/chaniya-choli-candidates.json');
  const sourceRows = readFileSync(resolve(root, sourceCsv), 'utf8').trimEnd().split(/\r?\n/).slice(1).map((row) => row.split(','));

  if (records.length !== 27) errors.push(`Expected 27 source records, found ${records.length}`);
  if (sourceRows.length !== 27) errors.push(`Expected 27 CSV rows, found ${sourceRows.length}`);
  for (let number = 1; number <= 27; number += 1) {
    const matches = records.filter((record) => record.sourceId === `product-${number}`);
    if (matches.length !== 1) { errors.push(`Expected exactly one Product ${number} record`); continue; }
    const product = matches[0];
    const expectedImage = `files/new images-2/Final Product/Product ${number}.png`;
    if (product.sourceName !== `Product ${number}` || product.sourceImage !== expectedImage || !existsSync(resolve(root, expectedImage))) errors.push(`Product ${number} image/name mapping is invalid`);
    const sourceRow = sourceRows[number - 1];
    if (!sourceRow || sourceRow.length !== 7 || !new RegExp(`^Product\\s+${number}$`, 'i').test(sourceRow[1].trim()) || sourceRow[3].trim() !== product.sourcePriceRaw || Number(sourceRow[3].replace(/[^\d.]/g, '')) !== product.sourcePriceAmount || Number(sourceRow[5]) !== product.quantity || sourceRow[6].trim() !== product.sourceCommentRaw || sourceRow[4].trim() !== (product.sourceDealRaw ?? '')) errors.push(`Product ${number} does not match its source CSV row`);
    if (product.quantity !== 1) errors.push(`Product ${number} source quantity must be 1`);
    if (product.sourcePriceSymbol !== '$') errors.push(`Product ${number} source price symbol must remain $`);
    if (product.priceCurrency !== null && !knownCurrencies.has(product.priceCurrency)) errors.push(`Product ${number} currency is invalid`);
    if (product.sourcePriceAmount !== null && (typeof product.sourcePriceAmount !== 'number' || !Number.isFinite(product.sourcePriceAmount) || product.sourcePriceAmount < 0)) errors.push(`Product ${number} source price is invalid`);
    if (number >= 4 && number <= 12) {
      if (product.setType !== 'Full set' || product.includeBottoms !== null || !product.sourceNotes.includes('Full set')) errors.push(`Product ${number} full-set note was changed`);
    } else if (product.includeBottoms !== false || !product.sourceNotes.includes('No bottoms')) errors.push(`Product ${number} no-bottoms note was changed`);
    if (number === 1 && !product.sourceNotes.includes('Opening Dis')) errors.push('Product 1 opening-discount note is missing');
    if (product.publicationStatus === 'ready' && readinessIssues(product).length) errors.push(`Product ${number} cannot be ready: ${readinessIssues(product).join(', ')}`);
    if (!['blocked', 'ready'].includes(product.publicationStatus)) errors.push(`Product ${number} has invalid publication status`);
  }

  if (candidate.sourceId !== 'product-28' || candidate.candidateType !== 'image-only' || candidate.publicationStatus !== 'blocked' || !existsSync(resolve(root, candidate.sourceImage))) errors.push('Product 28 must remain a blocked image-only candidate');
  if (models.length !== 12) errors.push(`Expected 12 Chaniya Choli candidates, found ${models.length}`);
  for (let number = 1; number <= 12; number += 1) {
    const matches = models.filter((model) => model.sourceId === `chaniya-choli-model-${number}`);
    const expectedImage = `files/new images-2/Final Pictures/Model ${number}.png`;
    if (matches.length !== 1 || matches[0].sourceImage !== expectedImage || matches[0].publicationStatus !== 'blocked' || !existsSync(resolve(root, expectedImage))) errors.push(`Model ${number} must remain a blocked mapped candidate`);
  }
  return { errors, sourceCsv, productCount: records.length, candidateCount: models.length + 1, readyCount: records.filter((product) => product.publicationStatus === 'ready').length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateIntake();
  if (result.errors.length) {
    for (const error of result.errors) console.error(error);
    process.exitCode = 1;
  } else {
    console.log(`Intake valid: ${result.productCount} products, ${result.candidateCount} separate candidates, ${result.readyCount} ready. CSV source: ${result.sourceCsv}.`);
  }
}
