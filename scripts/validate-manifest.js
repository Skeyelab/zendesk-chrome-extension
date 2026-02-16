#!/usr/bin/env node

/**
 * Validates manifest.json against Chrome Extension Manifest V3 schema
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'extension', 'manifest.json');

// Required fields for Manifest V3
const REQUIRED_FIELDS = ['manifest_version', 'name', 'version'];

// Valid manifest_version values
const VALID_MANIFEST_VERSIONS = [3];

function validateManifest() {
  console.log('Validating manifest.json...');
  
  // Check if manifest.json exists
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ Error: manifest.json not found');
    process.exit(1);
  }
  
  // Read and parse manifest.json
  let manifest;
  try {
    const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    console.error('❌ Error: Invalid JSON in manifest.json');
    console.error(error.message);
    process.exit(1);
  }
  
  // Validate required fields
  const missingFields = REQUIRED_FIELDS.filter(field => !(field in manifest));
  if (missingFields.length > 0) {
    console.error(`❌ Error: Missing required fields: ${missingFields.join(', ')}`);
    process.exit(1);
  }
  
  // Validate manifest_version
  if (!VALID_MANIFEST_VERSIONS.includes(manifest.manifest_version)) {
    console.error(`❌ Error: Invalid manifest_version. Expected ${VALID_MANIFEST_VERSIONS.join(' or ')}, got ${manifest.manifest_version}`);
    process.exit(1);
  }
  
  // Validate version format (should be semver-like)
  const versionRegex = /^\d+\.\d+(\.\d+)?$/;
  if (!versionRegex.test(manifest.version)) {
    console.error(`❌ Error: Invalid version format: ${manifest.version}. Expected format: X.Y or X.Y.Z`);
    process.exit(1);
  }
  
  // Validate name is not empty
  if (!manifest.name || manifest.name.trim() === '') {
    console.error('❌ Error: Extension name cannot be empty');
    process.exit(1);
  }
  
  console.log('✅ manifest.json is valid');
  console.log(`   - Manifest Version: ${manifest.manifest_version}`);
  console.log(`   - Name: ${manifest.name}`);
  console.log(`   - Version: ${manifest.version}`);
}

validateManifest();
