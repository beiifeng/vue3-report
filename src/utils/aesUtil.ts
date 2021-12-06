import AES from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import CFB from 'crypto-js/mode-cfb';
import PKCS7 from 'crypto-js/pad-pkcs7';
import UTF8 from 'crypto-js/enc-utf8';

class AesCrypt {
  /** AES密钥 */
  private defaultKey = '';
  /** AES向量 */
  private defaultIv = '';

  changeDefaultParam = (key: string, iv: string) => {
    this.defaultKey = key;
    this.defaultIv = iv;
    return this;
  };

  encrypt = (input: string): string => {
    const encrypted = AES.encrypt(input, Base64.parse(this.defaultKey), {
      iv: Base64.parse(this.defaultIv),
      mode: CFB,
      padding: PKCS7,
    });
    return encrypted.toString();
  };

  decrypt = (input: string): string => {
    const decrypted = AES.decrypt(input, Base64.parse(this.defaultKey), {
      iv: Base64.parse(this.defaultIv),
      mode: CFB,
      padding: PKCS7,
    });
    return decrypted.toString(UTF8);
  };
}

export default new AesCrypt();
