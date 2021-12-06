import aesCrypt from './aesUtil';

const KEY = 'CF_RM';

const addRememberAccount = (account: Record<string, any>): void => {
  if (account) {
    const accStr = JSON.stringify(account);
    const cryStr = aesCrypt.encrypt(accStr);
    window.localStorage.setItem(KEY, cryStr);
  } else {
    window.localStorage.removeItem(KEY);
  }
};

const getRememberAccount = (): any => {
  const cryStr = window.localStorage.getItem(KEY);
  if (cryStr) {
    try {
      const accStr = aesCrypt.decrypt(cryStr);
      const account = JSON.parse(accStr);
      if (typeof account === 'object') {
        return account;
      }
    } catch (e) {
      // ignored exception and return empty object
    }
  }
  return {};
};

export { addRememberAccount, getRememberAccount };
