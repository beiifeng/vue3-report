import { microApps } from '@/router/qiankunRouter';
import { ObjectType, registerMicroApps, RegistrableApp } from 'qiankun';

const apps: RegistrableApp<ObjectType>[] = microApps.map((app) => ({
  ...app,
  container: '#pageContainer',
  activeRule: (location) => location.pathname.startsWith(`/${app.name}/`),
  loader: (loading) => {
    console.log(app.name, ' loading status:', loading);
  },
}));

export default function loadQiankun(): void {
  registerMicroApps(apps, {
    beforeLoad: (app) => {
      console.log('lifecycle:beforeLoad', app);
      return Promise.resolve(app);
    },
    beforeMount: (app) => {
      console.log('lifecycle:beforeMount', app);
      return Promise.resolve(app);
    },
    afterMount: (app) => {
      console.log('lifecycle:afterMount', app);
      return Promise.resolve(app);
    },
    beforeUnmount: (app) => {
      console.log('lifecycle:beforeUnmount', app);
      return Promise.resolve(app);
    },
    afterUnmount: (app) => {
      console.log('lifecycle:afterUnmount', app);
      return Promise.resolve(app);
    },
  });
}
