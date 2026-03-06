import {Buffer} from "buffer";
import {getRandomValues as expoCryptoGetRandomValues} from "expo-crypto";

(globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;

class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== "undefined" ? crypto: new Crypto();

if (typeof crypto === "undefined"){
  Object.defineProperty(globalThis, "crypto",{
    configurable: true,
    enumerable: true,
    get: () => webCrypto,
  });
}