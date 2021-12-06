export type ResponseBodyType = {
  code: number;
  message: string;
  data?: any;
};

export const RESPONSE_CODE = {
  ERROR: 0,
  SUCCESS: 1,
  VALIDATOR: 2,
};
export const isSuccess = (res: ResponseBodyType): boolean =>
  res?.code === RESPONSE_CODE.SUCCESS;
