package expo.modules.encryption

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

class ExpoEncryptionModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoEncryption')` in JavaScript.
    Name("ExpoEncryption")

    // Defines the HMAC-SHA256 function

    fun dh(sett: List<String>): String {
    val originalPieces = Array(3) { "" }
    for (piece in sett) {
        if (piece.startsWith("str_")) {
            val index = piece[4].digitToInt()
            val content = piece.substring(5)
            originalPieces[index] = content
        }
    }
        return originalPieces.joinToString("") { content ->
            val halfLength = (content.length + 1) / 2
            val reversedFirstHalf = content.substring(0, halfLength).reversed()
            val reversedSecondHalf = content.substring(halfLength).reversed()
            reversedSecondHalf + reversedFirstHalf
        }
    }

    AsyncFunction("hmacSHA256") { key: ArrayList<String>, message: String ->
      // Convert the key and message to bytes
      try {
      val hmacKey = dh(key)
      val keySpec = SecretKeySpec(hmacKey.toByteArray(), "HmacSHA256")
      val mac = Mac.getInstance("HmacSHA256")
      mac.init(keySpec)

      // Perform the HMAC-SHA256 hashing
      val hashBytes = mac.doFinal(message.toByteArray())

      // Convert hashBytes to a hexadecimal string (matches iOS behavior)
      val hexString = hashBytes.joinToString("") { byte ->
        "%02x".format(byte)
      }

      hexString // Return the hash as a hexadecimal string
      }catch(e: Exception){
        ""
      }
    }
  }
}