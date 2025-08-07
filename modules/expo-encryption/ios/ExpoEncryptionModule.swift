import Foundation
import CryptoKit
import ExpoModulesCore

public class ExpoEncryptionModule: Module {
  

  func dh(_ encryptedArray: [String]) throws -> String {
    var originalPieces = [String](repeating: "", count: 3)
    for piece in encryptedArray {
        if piece.hasPrefix("str_") {
            let index = Int(String(piece[piece.index(piece.startIndex, offsetBy: 4)]))!
            let content = String(piece[piece.index(piece.startIndex, offsetBy: 5)...])
            originalPieces[index] = content
        }
    }
        
        return originalPieces
            .map { content -> String in
                let halfLength = (content.count + 1) / 2 // Use (content.count + 1) / 2 to handle odd lengths correctly
                let reversedFirstHalf = String(content.prefix(halfLength).reversed())
                let reversedSecondHalf = String(content.suffix(content.count - halfLength).reversed())
                return reversedSecondHalf + reversedFirstHalf
            }
            .joined()
    }


  public func hmacSHA256(key: [String], message: String) -> String {

   do {
        let hmacKey = try dh(key)
        // Convert the key and message to Data
        let keyData = Data(hmacKey.utf8) // Key data
        let messageData = Data(message.utf8) // Message data
        
        // Create a SymmetricKey from the hmacKey
        let symmetricKey = SymmetricKey(data: keyData)
        
        // Perform the HMAC-SHA256 operation using CryptoKit
        let signature = HMAC<SHA256>.authenticationCode(for: messageData, using: symmetricKey)
        
        // Debugging step: print the result as a hexadecimal string
        let hexString = signature.map { String(format: "%02hhx", $0) }.joined()
        
        return hexString  // Return the result as a hex string
    } catch {
        print("Error: \(error)")  // Debugging
        return ""  // Return an empty string if an error occurs
    }
  }

  // Define module functions in Expo
  public func definition() -> ModuleDefinition {
    Name("ExpoEncryption")

    // Define the HMAC-SHA256 function for JavaScript to call
    AsyncFunction("hmacSHA256") { (key: [String], message: String) -> String in
      return self.hmacSHA256(key: key, message: message)
    }
  }
}