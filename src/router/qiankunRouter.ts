import { Entry } from 'qiankun';

declare type MicroAppProps = {
  name: string;
  entry: Entry;
};

const microApps: Array<MicroAppProps> = [
  {
    name: 'sys',
    entry: '//localhost:7105',
  },
];

export { microApps };
