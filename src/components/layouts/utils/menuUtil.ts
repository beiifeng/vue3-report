/**
 * 构建菜单树，返回的数据与原数据是两份数据，是不完全深拷贝，即修改返回值不会影响原数据。
 * 返回值中的树形数组与Map中的数据是相同的，即修改返回数组的属性会影响到Map中的数据。
 */
export function buildTreeData(originData: Array<Record<string, any>>): {
  treeData: Array<Record<string, any>>;
  relationMap: Map<string, Record<string, any>>;
} {
  const relationMap = new Map();

  const treeData = loopTree(originData, relationMap);
  return {
    treeData,
    relationMap,
  };
}

function loopTree(
  originData: Array<Record<string, any>>,
  relationMap: Map<string, Record<string, any>>,
  parentIds: Array<string> = [],
  level = 0,
) {
  const data: Array<Record<string, any>> = [];
  const length = originData.length;
  for (let i = 0; i < length; i += 1) {
    const item = originData[i];
    const newItem = Object.assign({}, item, {
      level,
      parentIds,
    });
    if (item.children) {
      newItem.children = loopTree(
        item.children,
        relationMap,
        parentIds.concat(item.id),
        level + 1,
      );
    }
    relationMap.set(newItem.id, newItem);
    relationMap.set(buildMapKeyByPath(newItem.path), newItem);
    data.push(newItem);
  }
  return data;
}

export function buildMapKeyByPath(path: string): string {
  return `menu_path_$$${path}`;
}
