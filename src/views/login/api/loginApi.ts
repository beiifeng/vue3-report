export type LoginParamsType = {
  username: string;
  password: string;
  captchaKey?: string;
  captcha?: string;
  loginKey?: string;
  type?: 'account' | 'phone';
};

export async function userLogin(params: LoginParamsType): Promise<any> {
  // 判断 type
  const para = {
    username: params.username,
    password: params.password,
  };
  return accountLoginV1(para);
}

export async function accountLoginV1(params: LoginParamsType): Promise<any> {
  // 没有加密
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 1,
        data: JSON.stringify(params),
      });
    }, 100);
  });
}
