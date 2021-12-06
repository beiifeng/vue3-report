import { createStore } from 'vuex';

const allComponents = require.context('.', true, /\.*[^(index)]\.(js|ts)$/);
const realComponents: Record<string, any> = {};
allComponents.keys().forEach((fileName) => {
  const fileNameArr = fileName.split(/\.|\//);
  const moduleName = fileNameArr[fileNameArr.length - 3];
  // const moduleName = fileName.split(/\.|\//).at(-2);
  if (!fileName.includes('index.ts')) {
    const comp = allComponents(fileName);
    if (realComponents[moduleName]) {
      const see = `/src/store/${fileName}`;
      throw new Error(
        `already exist same namespace:${moduleName} in store. See:${see.replace(
          '/./',
          '/',
        )}`,
      );
    }
    realComponents[moduleName] = comp.default;
  }
});

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: realComponents,
});
