# Retain module definition to ensure the module name and AsyncFunction are available at runtime
-keepclassmembers class expo.modules.encryption.ExpoEncryptionModule {
    public <methods>;
}

# Keep classes in the expo.modules.kotlin library
-keep class expo.modules.kotlin.** { *; }
-keepclassmembers class expo.modules.kotlin.** { *; }

# Allow reflection on javax.crypto classes
-keep class javax.crypto.** { *; }

# Retain the SecretKeySpec and Mac classes for cryptography
-keep class javax.crypto.spec.SecretKeySpec { *; }
-keep class javax.crypto.Mac { *; }

# Retain Android-specific functionality
-keep class android.** { *; }

# Ensure the obfuscation of unused code for security
-dontwarn expo.modules.**
-dontwarn javax.crypto.**

# Optimization settings for better performance and size reduction
-optimizationpasses 5
-dontpreverify
-allowaccessmodification
-optimizations !code/simplification/arithmetic