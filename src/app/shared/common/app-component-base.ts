import { Injector } from '@angular/core';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

export abstract class AppComponentBase {
  localization: I18NService;
  acl: ACLService;
  msgSrv: NzMessageService;
  modalHelper: ModalHelper;
  modalSrv: NzModalService;

  constructor(injector: Injector) {
    this.localization = injector.get(I18NService);
    this.acl = injector.get(ACLService);
    this.msgSrv = injector.get(NzMessageService);
    this.modalHelper = injector.get(ModalHelper);
    this.modalSrv = injector.get(NzModalService);
  }

  l(key: string, ...args: any[]): string {
    let localizedText = this.localization.fanyi(key);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length || args.length == 0) {
      return localizedText;
    }

    args.unshift(localizedText);
    return this.formatString.apply(this, args);
  }

  formatString = function () {
    if (arguments.length < 1) {
      return null;
    }

    var str = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
      var placeHolder = '{' + (i - 1) + '}';
      str = this.replaceAll(str, placeHolder, arguments[i]);
    }

    return str;
  };

  replaceAll = function (str, search, replacement) {
    var fix = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return str.replace(new RegExp(fix, 'g'), replacement);
  };

  isGranted(permissionName: string): boolean {
    return this.acl.canAbility(permissionName);
  }

  getMappingValueArrayOfkey = function (array, keyName) {
    if (Object.prototype.toString.call(array) == '[object Array]') {
      return array.map((item, index) => {
        return item[keyName];
      });
    }
    return null;
  };
}
