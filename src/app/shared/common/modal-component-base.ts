import { Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NzModalRef } from 'ng-zorro-antd/modal';

export abstract class ModalComponentBase extends AppComponentBase {
  title = '';
  nzModalRef: NzModalRef;

  constructor(injector: Injector) {
    super(injector);
    this.nzModalRef = injector.get(NzModalRef);
  }

  success(result: any = true) {
    if (result) {
      this.nzModalRef.close(result);
    } else {
      this.close();
    }
  }

  close($event?: MouseEvent): void {
    this.nzModalRef.close();
  }
}
