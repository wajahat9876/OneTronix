/* eslint-disable import/prefer-default-export */
// Import the native module. On web, it will be resolved to ExpoEncryption.web.ts
// and on native platforms to ExpoEncryption.ts

import ExpoEncryptionModule from './src/ExpoEncryptionModule';

export async function hmacSHA256(
  key: string[],
  message: string,
): Promise<string> {
  return ExpoEncryptionModule.hmacSHA256(key, message);
}
