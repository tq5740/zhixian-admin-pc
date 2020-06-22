import {
  Row,
  Col,
  Menu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Loading,
  MessageBox,
  Message,
  Notification,
  Input,
  Form,
  FormItem,
  Checkbox,
  CheckboxGroup,
  Button,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Tree,
  Cascader,
  Radio,
  DatePicker,
  TimePicker,
  Tooltip,
  Autocomplete,
  Upload,
  Progress,
  TimeSelect,
  RadioGroup,
  RadioButton,
  MenuItemGroup,
  Submenu
} from "element-ui";
import Vue from "vue";
const eleArr: object[] = [
  RadioGroup,
  Upload,
  Progress,
  Autocomplete,
  CheckboxGroup,
  Checkbox,
  DatePicker,
  TimePicker,
  TimeSelect,
  Radio,
  Cascader,
  Tree,
  FormItem,
  Button,
  Loading,
  Row,
  Col,
  Menu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Input,
  Form,
  Select,
  Option,
  Table,
  TableColumn,
  Dialog,
  Pagination,
  Tooltip,
  RadioButton,
  MenuItemGroup,
  Submenu
];
const $eleArr: object[] = [
  {
    name: `$msgbox`,
    c: MessageBox
  },
  {
    name: `$loading`,
    c: Loading.service
  },
  {
    name: `$alert`,
    c: MessageBox.alert
  },
  {
    name: `$confirm`,
    c: MessageBox.confirm
  },
  {
    name: `$prompt`,
    c: MessageBox.prompt
  },
  {
    name: `$notify`,
    c: Notification
  },
  {
    name: `$message`,
    c: Message
  }
];
const useEle = {
  $use() {
    eleArr.forEach((i: any) => {
      if (i.name === `Loading`) {
        Vue.use(i.directive);
      } else {
        Vue.use(i);
      }
    });
    return this;
  },
  $mount() {
    $eleArr.forEach((i: any) => {
      Vue.prototype[i.name] = i.c;
    });
  }
};
export default useEle;
