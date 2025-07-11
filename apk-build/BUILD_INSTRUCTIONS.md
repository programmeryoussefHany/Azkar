
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
