import { Menu } from '@delon/theme';

const MENUS: Menu[] = [
  {
    text: '主菜单',
    group: false,
    hideInBreadcrumb: true,
    children: [
      {
        text: '仪表盘',
        link: '/dashboard',
        icon: 'anticon-dashboard',
      },
      {
        text: '系统管理',
        group: true,
        hideInBreadcrumb: true,
        icon: 'anticon-rocket',
        children: [
          {
            text: '租户管理',
            i18n: 'TenantManagement',
            link: '/management/tenant',
            acl: { ability: ['Pages.Tenant.Dashboard'] },
            icon: 'anticon-team',
          },
          {
            text: 'Roles',
            i18n: 'Roles',
            link: '/management/role',
            acl: { ability: ['Pages.Tenant.Dashboard'] },
            icon: 'anticon-mail',
          },
          {
            text: 'UserManagement',
            i18n: 'UserManagement',
            link: '/management/user',
            acl: { ability: ['Pages.Tenant.Dashboard'] },
            icon: 'anticon-reload',
          },
        ],
      },
      {
        text: 'Alain',
        i18n: 'menu.alain',
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: '样式',
            i18n: 'menu.style',
            icon: 'anticon-info',
            children: [
              {
                text: 'Typography',
                link: '/style/typography',
                i18n: 'menu.style.typography',
                shortcut: true,
              },
              {
                text: 'Grid Masonry',
                link: '/style/gridmasonry',
                i18n: 'menu.style.gridmasonry',
              },
              {
                text: 'Colors',
                link: '/style/colors',
                i18n: 'menu.style.colors',
              },
            ],
          },
          {
            text: 'Delon',
            i18n: 'menu.delon',
            icon: 'anticon-bulb',
            children: [
              {
                text: 'Dynamic Form',
                link: '/delon/form',
                i18n: 'menu.delon.form',
              },
              {
                text: 'Simple Table',
                link: '/delon/st',
                i18n: 'menu.delon.table',
              },
              {
                text: 'Util',
                link: '/delon/util',
                i18n: 'menu.delon.util',
                acl: 'role-a',
              },
              {
                text: 'Print',
                link: '/delon/print',
                i18n: 'menu.delon.print',
                acl: 'role-b',
              },
              {
                text: 'QR',
                link: '/delon/qr',
                i18n: 'menu.delon.qr',
              },
              {
                text: 'ACL',
                link: '/delon/acl',
                i18n: 'menu.delon.acl',
              },
              {
                text: 'Route Guard',
                link: '/delon/guard',
                i18n: 'menu.delon.guard',
              },
              {
                text: 'Cache',
                link: '/delon/cache',
                i18n: 'menu.delon.cache',
              },
              {
                text: 'Down File',
                link: '/delon/downfile',
                i18n: 'menu.delon.downfile',
              },
              {
                text: 'Xlsx',
                link: '/delon/xlsx',
                i18n: 'menu.delon.xlsx',
              },
              {
                text: 'Zip',
                link: '/delon/zip',
                i18n: 'menu.delon.zip',
              },
            ],
          },
        ],
      },
      {
        text: 'Pro',
        i18n: 'menu.pro',
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: 'Form Page',
            i18n: 'menu.form',
            link: '/pro/form',
            icon: 'anticon-edit',
            children: [
              {
                text: 'Basic Form',
                link: '/pro/form/basic-form',
                i18n: 'menu.form.basicform',
                shortcut: true,
              },
              {
                text: 'Step Form',
                link: '/pro/form/step-form',
                i18n: 'menu.form.stepform',
              },
              {
                text: 'Advanced Form',
                link: '/pro/form/advanced-form',
                i18n: 'menu.form.advancedform',
              },
            ],
          },
          {
            text: 'List',
            i18n: 'menu.list',
            icon: 'anticon-appstore',
            children: [
              {
                text: 'Table List',
                link: '/pro/list/table-list',
                i18n: 'menu.list.searchtable',
                shortcut: true,
              },
              {
                text: 'Basic List',
                link: '/pro/list/basic-list',
                i18n: 'menu.list.basiclist',
              },
              {
                text: 'Card List',
                link: '/pro/list/card-list',
                i18n: 'menu.list.cardlist',
              },
              {
                text: 'Search List',
                i18n: 'menu.list.searchlist',
                children: [
                  {
                    link: '/pro/list/articles',
                    i18n: 'menu.list.searchlist.articles',
                  },
                  {
                    link: '/pro/list/projects',
                    i18n: 'menu.list.searchlist.projects',
                    shortcut: true,
                  },
                  {
                    link: '/pro/list/applications',
                    i18n: 'menu.list.searchlist.applications',
                  },
                ],
              },
            ],
          },
          {
            text: 'Profile',
            i18n: 'menu.profile',
            icon: 'anticon-profile',
            children: [
              {
                text: 'Basic',
                link: '/pro/profile/basic',
                i18n: 'menu.profile.basic',
              },
              {
                text: 'Advanced',
                link: '/pro/profile/advanced',
                i18n: 'menu.profile.advanced',
                shortcut: true,
              },
            ],
          },
          {
            text: 'Result',
            i18n: 'menu.result',
            icon: 'anticon-check-circle',
            children: [
              {
                text: 'Success',
                link: '/pro/result/success',
                i18n: 'menu.result.success',
              },
              {
                text: 'Fail',
                link: '/pro/result/fail',
                i18n: 'menu.result.fail',
              },
            ],
          },
          {
            text: 'Exception',
            i18n: 'menu.exception',
            link: '/',
            icon: 'anticon-exception',
            children: [
              {
                text: '403',
                link: '/exception/403',
                i18n: 'menu.exception.not-permission',
                reuse: false,
              },
              {
                text: '404',
                link: '/exception/404',
                i18n: 'menu.exception.not-find',
                reuse: false,
              },
              {
                text: '500',
                link: '/exception/500',
                i18n: 'menu.exception.server-error',
                reuse: false,
              },
            ],
          },
          {
            text: 'Account',
            i18n: 'menu.account',
            icon: 'anticon-user',
            children: [
              {
                text: 'center',
                link: '/pro/account/center',
                i18n: 'menu.account.center',
              },
              {
                text: 'settings',
                link: '/pro/account/settings',
                i18n: 'menu.account.settings',
              },
            ],
          },
        ],
      },
    ],
  },
];

export default MENUS;
