import qs, { ParsedQs } from 'qs';
import type { IStringifyOptions } from 'qs';
import type { WithNull } from '@/typings';

export type PointOffsetType = {
  offsetTop: number;
  offsetLeft: number;
};
/**
 * 计算传入html元素相对于body的位置
 * @param { WithNull<HTMLElement> } el html元素
 * @returns { PointOffsetType } 传入元素相对于body的offset
 */
export const getOffsetSizeFromBody = (
  el: WithNull<HTMLElement>,
): PointOffsetType => {
  let ele = el;
  let offsetTop = 0;
  let offsetLeft = 0;
  while (ele && ele.tagName !== 'BODY') {
    offsetTop += ele.offsetTop;
    offsetLeft += ele.offsetLeft;
    ele = <HTMLElement>ele.offsetParent;
  }
  return { offsetTop, offsetLeft };
};

/**
 * 将object形式的查询参数转换为字符串
 * @param  params url中的params对象
 * @param  config qs中的IStringifyOptions配置对象
 */
export function urlParamsStringify(
  params: Record<string, any>,
  options: IStringifyOptions,
): string {
  return qs.stringify(
    params,
    Object.assign({ arrayFormat: 'repeat' }, options),
  );
}

/**
 * 判断是否预生产环境
 */
export const isPreProduct = process.env.REACT_APP_ENV === 'pre';

export const getPageQuery = (): ParsedQs =>
  qs.parse(window.location.search, { ignoreQueryPrefix: true });
