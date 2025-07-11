const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 بدء عملية تحويل التطبيق إلى APK...\n');

// Step 1: Build the Next.js app
console.log('📦 بناء تطبيق Next.js...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ تم بناء التطبيق بنجاح\n');
} catch (error) {
  console.error('❌ فشل في بناء التطبيق:', error.message);
  process.exit(1);
}

// Step 2: Create APK configuration
console.log('⚙️ إنشاء ملفات تكوين APK...');

const apkConfig = {
  "package": "com.azkaari.app",
  "name": "أذكاري",
  "version": "1.0.0",
  "versionCode": 1,
  "orientation": "portrait",
  "fullscreen": false,
  "resizable": true,
  "permissions": [
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.VIBRATE"
  ],
  "icon": "icon-512.png",
  "splash": {
    "background_color": "#f8f9fa",
    "theme_color": "#228B22"
  },
  "webview": {
    "webContentsDebuggingEnabled": false
  }
};

// Create APK directory
const apkDir = path.join(__dirname, 'apk-build');
if (!fs.existsSync(apkDir)) {
  fs.mkdirSync(apkDir);
}

// Write APK config
fs.writeFileSync(
  path.join(apkDir, 'config.json'),
  JSON.stringify(apkConfig, null, 2)
);

console.log('✅ تم إنشاء ملفات التكوين\n');

// Step 3: Copy built files
console.log('📁 نسخ ملفات التطبيق...');
const outDir = path.join(__dirname, 'out');
const apkAssetsDir = path.join(apkDir, 'assets');

if (fs.existsSync(outDir)) {
  // Copy out directory to apk assets
  execSync(`xcopy "${outDir}" "${apkAssetsDir}" /E /I /Y`, { stdio: 'inherit' });
  console.log('✅ تم نسخ ملفات التطبيق\n');
} else {
  console.error('❌ مجلد out غير موجود. تأكد من بناء التطبيق أولاً');
  process.exit(1);
}

// Step 4: Create build instructions
const buildInstructions = `
# 📱 تعليمات تحويل التطبيق إلى APK

## الطريقة الأولى: استخدام PWA Builder (الأسهل)
1. اذهب إلى: https://www.pwabuilder.com/
2. أدخل رابط التطبيق المنشور
3. اختر "Android" من الخيارات
4. اضغط على "Generate Package"
5. حمل ملف APK

## الطريقة الثانية: استخدام Capacitor
1. تثبيت Capacitor:
   npm install @capacitor/core @capacitor/cli @capacitor/android

2. تهيئة Capacitor:
   npx cap init "أذكاري" "com.azkaari.app"

3. إضافة منصة Android:
   npx cap add android

4. نسخ ملفات التطبيق:
   npx cap copy

5. فتح Android Studio:
   npx cap open android

6. بناء APK من Android Studio

## الطريقة الثالثة: استخدام Cordova
1. تثبيت Cordova:
   npm install -g cordova

2. إنشاء مشروع Cordova:
   cordova create azkaari com.azkaari.app "أذكاري"

3. إضافة منصة Android:
   cd azkaari
   cordova platform add android

4. نسخ ملفات التطبيق إلى www/
5. بناء APK:
   cordova build android

## ملفات التكوين الجاهزة:
- config.json: إعدادات التطبيق
- assets/: ملفات التطبيق المبنية
- manifest.json: ملف PWA manifest

## متطلبات النظام:
- Node.js 16+
- Android Studio (للطريقة الثانية)
- Java JDK 8+ (للطريقة الثالثة)
`;

fs.writeFileSync(path.join(apkDir, 'BUILD_INSTRUCTIONS.md'), buildInstructions);

console.log('🎉 تم الانتهاء من التحضير!');
console.log('📂 ملفات APK جاهزة في مجلد: apk-build/');
console.log('📖 اقرأ ملف BUILD_INSTRUCTIONS.md للتعليمات التفصيلية');
console.log('\n🌐 لتحويل سريع، استخدم PWA Builder:');
console.log('   https://www.pwabuilder.com/');
