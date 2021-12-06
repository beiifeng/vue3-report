import { ref, Ref } from 'vue';

const _userInfo = ref<Record<string, any>>({});
const _menuInfo = ref<Array<Record<string, any>>>([]);
const _permission = ref<Array<string>>([]);
const _tenantInfo = ref<Record<string, any>>({});

export type UseAuthority = {
  setAuthorityV1: (identity: any) => void;
  copyAuthority: (authority: string | Record<string, any>) => void;
  setUserInfo: (user: string | Record<string, any>) => void;
  setMenuInfo: (menu: string | Array<Record<string, any>>) => void;
  setPermissionInfo: (permission: string | Array<string>) => void;
  setTenantInfo: (tenant: string | Record<string, any>) => void;
  clearAuthority: () => void;
  /** 检查是否登录 */
  checkAuthority: () => boolean;
  /** 获取用户信息。返回值为ref，方便watch监听改变 */
  getUserInfoRef: () => Ref<Record<string, any>>;
  /** 获取用户信息。返回值为代理后的对象 */
  getUserInfoValue: () => Record<string, any>;
  /** 获取菜单信息。返回值为ref，方便watch监听改变 */
  getMenuInfoRef: () => Ref<Array<Record<string, any>>>;
  /** 获取菜单信息。返回值为代理后的对象 */
  getMenuInfoValue: () => Array<Record<string, any>>;
  /** 获取权限信息。返回值为ref，方便watch监听改变 */
  getPermissionRef: () => Ref<Array<string>>;
  /** 获取权限信息。返回值为代理后的对象 */
  getPermissionValue: () => Array<string>;
  /** 获取租户信息。返回值为ref，方便watch监听改变 */
  getTenantInfoRef: () => Ref<Record<string, any>>;
  /** 获取租户信息。返回值为代理后的对象 */
  getTenantInfoValue: () => Record<string, any>;
  toString: () => string;
};

function useAuthority(): UseAuthority {
  const setAuthorityV1 = (identity: any) => {
    if (identity) {
      if (identity.userInfo && typeof identity.userInfo === 'string') {
        _userInfo.value = JSON.parse(identity.userInfo);
      }
      if (identity.menuInfo && typeof identity.menuInfo === 'string') {
        _menuInfo.value = JSON.parse(identity.menuInfo);
      }
    }
  };
  const copyAuthority = (authority: string | Record<string, any>) => {
    const authorityObj =
      typeof authority === 'string' ? JSON.parse(authority) : authority;
    _userInfo.value = authorityObj.userInfo;
    _menuInfo.value = authorityObj.menuInfo;
    _permission.value = authorityObj.permission;
    _tenantInfo.value = authorityObj.tenantInfo;
  };

  const setUserInfo = (user: string | Record<string, any>) => {
    if (typeof user === 'string') {
      _userInfo.value = JSON.parse(user);
    } else {
      _userInfo.value = user;
    }
  };
  const setMenuInfo = (menu: string | Array<Record<string, any>>) => {
    if (typeof menu === 'string') {
      _menuInfo.value = JSON.parse(menu);
    } else {
      _menuInfo.value = menu;
    }
  };
  const setPermissionInfo = (permission: string | Array<string>) => {
    if (typeof permission === 'string') {
      _permission.value = JSON.parse(permission);
    } else {
      _permission.value = permission;
    }
  };
  const setTenantInfo = (tenant: string | Record<string, any>) => {
    if (typeof tenant === 'string') {
      _tenantInfo.value = JSON.parse(tenant);
    } else {
      _tenantInfo.value = tenant;
    }
  };

  const clearAuthority = () => {
    _userInfo.value = {};
    _menuInfo.value = [];
    _permission.value = [];
    _tenantInfo.value = [];
  };

  const checkAuthority = () => {
    return !!_userInfo.value?.id;
  };

  const getUserInfoRef = () => _userInfo;
  const getMenuInfoRef = () => _menuInfo;
  const getPermissionRef = () => _permission;
  const getTenantInfoRef = () => _tenantInfo;

  const getUserInfoValue = () => _userInfo.value;
  const getMenuInfoValue = () => _menuInfo.value;
  const getPermissionValue = () => _permission.value;
  const getTenantInfoValue = () => _tenantInfo.value;

  const toString = (): string => {
    return JSON.stringify({
      userInfo: _userInfo.value,
      menuInfo: _menuInfo.value,
      permission: _permission.value,
      tenantInfo: _tenantInfo.value,
    });
  };

  return {
    clearAuthority,
    checkAuthority,
    setAuthorityV1,
    copyAuthority,
    setUserInfo,
    setMenuInfo,
    setPermissionInfo,
    setTenantInfo,
    getUserInfoRef,
    getMenuInfoRef,
    getPermissionRef,
    getTenantInfoRef,
    getUserInfoValue,
    getMenuInfoValue,
    getPermissionValue,
    getTenantInfoValue,
    toString,
  };
}

export { useAuthority, useAuthority as default };
