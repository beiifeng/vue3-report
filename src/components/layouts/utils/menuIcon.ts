import { FunctionalComponent } from 'vue';
import camelCase from 'lodash.camelcase';
import upperFirst from 'lodash.upperfirst';
import {
  PieChartOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  HomeOutlined,
  LaptopOutlined,
  FileTextOutlined,
  IdcardOutlined,
  AppstoreOutlined,
  FormOutlined,
  DatabaseOutlined,
  ExceptionOutlined,
  BookOutlined,
  InboxOutlined,
  CoffeeOutlined,
  ShoppingCartOutlined,
  SecurityScanOutlined,
  FolderViewOutlined,
  BuildOutlined,
  DashboardOutlined,
  CarOutlined,
} from '@ant-design/icons-vue';

const iconMap: Record<string, FunctionalComponent> = {
  PieChartOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  HomeOutlined,
  LaptopOutlined,
  FileTextOutlined,
  IdcardOutlined,
  AppstoreOutlined,
  FormOutlined,
  DatabaseOutlined,
  ExceptionOutlined,
  BookOutlined,
  InboxOutlined,
  CoffeeOutlined,
  ShoppingCartOutlined,
  SecurityScanOutlined,
  FolderViewOutlined,
  BuildOutlined,
  DashboardOutlined,
  CarOutlined,
};

export default iconMap;

export const hasIcon = (icon: string): boolean => !!iconMap[withTheme(icon)];
export const Icon = (icon: string): FunctionalComponent =>
  iconMap[withTheme(icon)];

export function withTheme(type: string): string {
  const result = upperFirst(camelCase(type));
  return result + 'Outlined';
}
