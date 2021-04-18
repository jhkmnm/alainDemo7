import { Injectable } from '@angular/core';
import {
  ApplicationInfoDto,
  AbpMultiTenancyConfigDto,
  GetCurrentLoginInformationsOutput,
  SessionServiceProxy,
  TenantLoginInfoDto,
  UserLoginInfoDto,
  AbpUserConfigurationDto,
  AbpUserClockConfigDto,
  AbpUserTimingConfigDto,
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class AppSessionService {
  private _user: UserLoginInfoDto;
  private _tenant: TenantLoginInfoDto;
  private _application: ApplicationInfoDto;
  private _abpMultiTenancyConfig: AbpMultiTenancyConfigDto;
  private _clock: AbpUserClockConfigDto;
  private _timing: AbpUserTimingConfigDto;

  constructor(private _sessionService: SessionServiceProxy) {}

  get application(): ApplicationInfoDto {
    return this._application;
  }

  get user(): UserLoginInfoDto {
    return this._user;
  }

  get userId(): number {
    return this.user ? this.user.id : null;
  }

  get tenant(): TenantLoginInfoDto {
    return this._tenant;
  }

  get tenancyName(): string {
    return this._tenant ? this.tenant.tenancyName : '';
  }

  get tenantId(): number {
    return this.tenant ? this.tenant.id : null;
  }

  get clock(): AbpUserClockConfigDto {
    return this._clock;
  }

  get timing(): AbpUserTimingConfigDto {
    return this._timing;
  }

  getShownLoginName(): string {
    debugger;
    const userName = this._user.userName;
    if (!this._abpMultiTenancyConfig.isEnabled) {
      return userName;
    }

    return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
  }

  init(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._sessionService
        .getCurrentLoginInformations()
        .toPromise()
        .then(
          (result: GetCurrentLoginInformationsOutput) => {
            this._application = result.application;
            this._user = result.user;
            this._tenant = result.tenant;
            resolve(true);
          },
          (err) => {
            reject(err);
          },
        );
      this._sessionService
        .getUserConfigurations()
        .toPromise()
        .then((result: AbpUserConfigurationDto) => {
          this._abpMultiTenancyConfig = result.multiTenancy;
          this._clock = result.clock;
          this._timing = result.timing;
        });
    });
  }

  // 切换租户
  // changeTenantIfNeeded(tenantId?: number): boolean {
  //     if (this.isCurrentTenant(tenantId)) {
  //         return false;
  //     }

  //     abp.multiTenancy.setTenantIdCookie(tenantId);
  //     location.reload();
  //     return true;
  // }

  private isCurrentTenant(tenantId?: number) {
    let isTenant = tenantId > 0;

    if (!isTenant && !this.tenant) {
      // this is host
      return true;
    }

    if (!tenantId && this.tenant) {
      return false;
    } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
      return false;
    }

    return true;
  }
}
