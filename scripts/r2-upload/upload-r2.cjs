#!/usr/bin/env node

// R2 Upload Script for Sahaj Gallery
// Direct upload of src/assets to Cloudflare R2

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Configuration - Using the same credentials from .env.local
const R2_ACCOUNT_ID = '65d9c6183f65d5193235dada85970756';
const R2_ACCESS_KEY_ID = 'f07723ed5454bfbdf05cd48ccb9a2169';
const R2_SECRET_ACCESS_KEY = 'bb81b212e1fc897037a9aa4a87e44e41088c4444bc1979d9105dc3547ccb3417';
const R2_BUCKET_NAME = 'sahaj-gallery-assets';

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Path mapping from r2.ts config
const PATH_MAPPINGS = [
  { source: './src/assets/home page', dest: 'images/home_page' },
  { source: './src/assets/Review Video', dest: 'videos/reviews' },
  { source: './src/assets/sahaj panel', dest: 'sahaj panel' },
  { source: './src/assets/logo', dest: 'images/logo' },
  // Additional assets referenced in src/assets/assets.ts
  { source: './src/assets', dest: '' }, // For AUDIO and OTHERS (handled specially)
];

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.svg': 'image/svg+xml',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

async function uploadFile(filePath, key) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const fileStat = fs.statSync(filePath);
    
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: getContentType(filePath),
      ContentLength: fileStat.size,
    });
    
    const result = await r2Client.send(uploadCommand);
    console.log(`✓ Uploaded: ${key} (${(fileStat.size / 1024 / 1024).toFixed(2)} MB)`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to upload ${key}: ${error.message}`);
    return false;
  }
}

async function uploadDirectory(sourceDir, destPrefix) {
  console.log(`\n📁 Uploading from: ${sourceDir}`);
  console.log(`📁 To R2 bucket: ${R2_BUCKET_NAME}/${destPrefix}`);
  
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        walkDir(itemPath);
      } else {
        files.push(itemPath);
      }
    });
  }
  
  walkDir(sourceDir);
  
  const successful = [];
  const failed = [];
  
  for (const filePath of files) {
    let key;
    if (destPrefix) {
      const relativePath = path.relative(sourceDir, filePath);
      key = `${destPrefix}/${relativePath}`;
    } else {
      key = path.basename(filePath);
    }
    
    const success = await uploadFile(filePath, key);
    if (success) {
      successful.push(key);
    } else {
      failed.push(key);
    }
  }
  
  console.log(`\n📊 Upload Summary for ${destPrefix}:\n  - Total files: ${files.length}\n  - Successful: ${successful.length}\n  - Failed: ${failed.length}\n`);
  
  if (failed.length > 0) {
    console.log(`⚠️ Failed uploads: ${failed.join(', ')}`);
  }
  
  return { successful, failed };
}

async function main() {
  console.log('🚀 Starting Cloudflare R2 Asset Upload for Sahaj Gallery');
  console.log(`📦 Target R2 bucket: ${R2_BUCKET_NAME}`);
  console.log(`🌐 R2 endpoint: https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com\n`);
  
  const allSuccessful = [];
  const allFailed = [];
  
  // Verify source directories exist
  const missingDirs = PATH_MAPPINGS.filter(dir => {
    if (!fs.existsSync(dir.source)) {
      return true;
    }
    return false;
  }).map(dir => dir.source);
  
  if (missingDirs.length > 0) {
    console.error('✗ Missing source directories:', missingDirs);
    console.log('\n📂 Current src/assets/ structure:');
    if (fs.existsSync('./src/assets')) {
      function listDir(dir, indent = '') {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          console.log(`${indent}${indent === '' ? '📁' : '📄'} ${item}`);
          if (stat.isDirectory()) {
            listDir(itemPath, indent + '  ');
          }
        });
      }
      listDir('./src/assets');
    }
    process.exit(1);
  }
  
  console.log('\n✅ Source directories found, proceeding with upload...\n');
  
  // Upload each directory
  for (const dir of PATH_MAPPINGS) {
    if (dir.source !== './src/assets') {
      const result = await uploadDirectory(dir.source, dir.dest);
      allSuccessful.push(...result.successful);
      allFailed.push(...result.failed);
    } else {
      // Handle individual asset files from assets.ts
      console.log('\n📁 Uploading individual assets from src/assets/...');
      const result = await uploadDirectory(dir.source, '');
      allSuccessful.push(...result.successful);
      allFailed.push(...result.failed);
    }
  }
  
  console.log('\n🎉 R2 Upload Complete!\n');
  console.log(`📋 Total Summary:\n  - Successfully uploaded: ${allSuccessful.length} files\n  - Failed uploads: ${allFailed.length} files\n`);
  
  if (allFailed.length > 0) {
    console.log('❌ Some files failed to upload:');
    allFailed.forEach(key => console.log(`  - ${key}`));
    process.exit(1);
  } else {
    console.log('✅ All files uploaded successfully to Cloudflare R2!');
    console.log('\n🎯 Next Steps:');
    console.log('1. The application will now load assets from R2 instead of src/assets/');
    console.log('2. Deploy the project to Cloudflare Pages');
    console.log('3. Set VITE_R2_URL environment variable in Cloudflare Pages dashboard');
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason);
  process.exit(1);
});

main().catch(console.error);
