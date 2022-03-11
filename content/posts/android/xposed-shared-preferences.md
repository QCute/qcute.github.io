---
title: "Xposed XSharedPreferences在安卓N以后及解决方案"
date: 2020-03-03T00:00:00+08:00
categories: ["android"]
---

由于在[Android](https://www.android.com) 7 (SDK 24) 及以后 [Context.MODE_WORLD_READABLE](https://developer.android.com/reference/android/content/Context#MODE_WORLD_READABLE) 被废弃  
导致[Xposed](https://repo.xposed.info/) [XSharedPreference](https://api.xposed.info/reference/de/robv/android/xposed/XSharedPreferences.html)不可用  


1. 使用[RemotePreferences](https://github.com/apsun/RemotePreferences), 但是需要[Context](https://developer.android.com/reference/android/content/Context.html)  


2. 使用[Context.createDeviceProtectedStorageContext()](https://developer.android.com/reference/android/content/Context.html#createDeviceProtectedStorageContext())  
把文件储存到[/data/user_de/0/包名/shared_prefs/名称.xml](), 然后再修复权限  
```java
    @SuppressWarnings("ConstantConditions")
    public static String getSharedPrefsPath() {
        if (prefsPathCurrent == null) try {
            Field fFile = prefs.getClass().getDeclaredField("mFile");
            fFile.setAccessible(true);
            prefsPathCurrent = ((File) fFile.get(prefs)).getParentFile().getAbsolutePath();
            return prefsPathCurrent;
        } catch (Throwable t) {
            return prefsPath;
        }
        else return prefsPathCurrent;
    }

    @SuppressWarnings("ConstantConditions")
    public static String getSharedPrefsFile() {
        if (prefsFileCurrent == null) try {
            Field fFile = prefs.getClass().getDeclaredField("mFile");
            fFile.setAccessible(true);
            prefsFileCurrent = ((File) fFile.get(prefs)).getAbsolutePath();
            return prefsFileCurrent;
        } catch (Throwable t) {
            return prefsFile;
        }
        else return prefsFileCurrent;
    }
    
```
* 摘自 [CustoMIUIzerMod](https://github.com/liyafe1997/CustoMIUIzerMod/blob/mod/app/src/main/java/org/strawing/customiuizermod/utils/Helpers.java#L1600-L1624)  
```java
    @SuppressLint({"SetWorldReadable", "SetWorldWritable"})
    public static void fixPermissionsAsync(Context context) {
        AsyncTask.execute(() -> {
            try {
                Thread.sleep(500);
            } catch (Throwable ignore) {
            }
            File pkgFolder = context.getDataDir();
            if (pkgFolder.exists()) {
                pkgFolder.setExecutable(true, false);
                pkgFolder.setReadable(true, false);
                pkgFolder.setWritable(true, false);
            }
            File sharedPrefsFolder = new File(Helpers.getSharedPrefsPath());
            if (sharedPrefsFolder.exists()) {
                sharedPrefsFolder.setExecutable(true, false);
                sharedPrefsFolder.setReadable(true, false);
                sharedPrefsFolder.setWritable(true, false);
            }
            File sharedPrefsFile = new File(Helpers.getSharedPrefsFile());
            if (sharedPrefsFile.exists()) {
                sharedPrefsFile.setReadable(true, false);
                sharedPrefsFile.setExecutable(true, false);
                sharedPrefsFile.setWritable(true, false);
            }
        });
    }
```
* 摘自 [CustoMIUIzerMod](https://github.com/liyafe1997/CustoMIUIzerMod/blob/mod/app/src/main/java/org/strawing/customiuizermod/utils/Helpers.java#L1660-#L1686)  
但是此方法在 [Android](https://www.android.com) 9 (SDK 28) 及以上的部分机型, 会因为Selinux的限制导致出现部分情况异常.  

3. 如果运行在[LSPosed](https://github.com/LSPosed/LSPosed)或者[EdXposed](https://github.com/ElderDrivers/EdXposed)下, 可直接使用[XSharedPreferences](https://api.xposed.info/reference/de/robv/android/xposed/XSharedPreferences.html)  
* 要求[Android](https://www.android.com) 9 (SDK 28)及以上  
* 要求[XposedApi](https://api.xposed.info) xposedminversion 93及以上  
* 会有兼容性问题, 例如, 不一定能在在[太极](https://taichi.cool/)等框架上运行  
* 在[AndroidManifest.xml](https://developer.android.com/guide/topics/manifest/manifest-intro)中设置  
```xml
<meta-data android:name="xposedminversion" android:value="93" />
<meta-data android:name="xposedsharedprefs" android:value="true" />
```

* 参考  
> LSPosed： [New XSharedPreferences](https://github.com/LSPosed/LSPosed/wiki/New-XSharedPreferences)
> EdXposed： [New XSharedPreferences](https://github.com/ElderDrivers/EdXposed/wiki/New-XSharedPreferences)

其他参考资料
> [XSharedPreference & SharedPreference - XPosed模块中的preference使用](https://blog.zhougy.top/2018/01/17/XSharedPreference_&_SharedPreference_-_XPosed%E6%A8%A1%E5%9D%97%E4%B8%AD%E7%9A%84preference%E4%BD%BF%E7%94%A8/)
> [Xposed--Android N 以上 XSharedPreferences](https://jasper1024.com/jasper/2323iuiowcsf/)
