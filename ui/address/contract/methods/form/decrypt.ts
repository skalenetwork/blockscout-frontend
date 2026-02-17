import { ec as EC } from 'elliptic';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

const ec = new EC('secp256k1');

export function decryptBalance(secretKey: string, encryptedDataHex: string): string {
    const cleanSecretKey = secretKey.startsWith('0x') ? secretKey.slice(2) : secretKey;
    const cleanEncryptedData = encryptedDataHex.startsWith('0x') ? encryptedDataHex.slice(2) : encryptedDataHex;

    const encryptedDataBuffer = Buffer.from(cleanEncryptedData, 'hex');

    const ivBuffer = encryptedDataBuffer.subarray(0, 16);
    const ephemeralPublicKeyBuffer = encryptedDataBuffer.subarray(16, 16 + 33);
    const ciphertextBuffer = encryptedDataBuffer.subarray(16 + 33);

    const key = ec.keyFromPrivate(cleanSecretKey, 'hex');
    const sharedSecretPoint = key.derive(ec.keyFromPublic(ephemeralPublicKeyBuffer).getPublic());
    const sharedSecret = Buffer.from(sharedSecretPoint.toArray('be', 32));

    const sharedSecretWordArray = CryptoJS.enc.Hex.parse(sharedSecret.toString('hex'));
    const encryptionKey = CryptoJS.SHA256(sharedSecretWordArray);

    const ciphertextWordArray = CryptoJS.enc.Hex.parse(ciphertextBuffer.toString('hex'));
    const ivWordArray = CryptoJS.enc.Hex.parse(ivBuffer.toString('hex'));

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertextWordArray } as CryptoJS.lib.CipherParams,
        encryptionKey,
        {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    try {
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        if (decryptedString) {

            const maybeHex = decryptedString.startsWith('0x') ? decryptedString.slice(2) : decryptedString;
            const isHex = /^[0-9a-fA-F]*$/.test(maybeHex) && maybeHex.length % 2 === 0;

            if (isHex) {
                if (decryptedString.startsWith('0x')) {
                    return BigInt(decryptedString).toString();
                }
                return decryptedString;
            }
        }
    } catch (e) {
    }

    const decryptedHex = decrypted.toString(CryptoJS.enc.Hex);
    const result = `0x${decryptedHex}`;
    return BigInt(result).toString();
}
