import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenModel, ITokenService, SocialService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { CookieService } from '@delon/util';
import {
  AuthenticateModel,
  TokenAuthServiceProxy,
  AccountServiceProxy,
  IsTenantAvailableInput,
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  loginModel: AuthenticateModel;
  tenant: IsTenantAvailableInput;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    // public msg: NzMessageService,
    private loginService: TokenAuthServiceProxy,
    private accountService: AccountServiceProxy,
    private cookie: CookieService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      tenancyName: [null],
      remember: [true],
    });
    this.loginModel = new AuthenticateModel();
    this.tenant = new IsTenantAvailableInput();
  }

  // #region fields

  get userName(): AbstractControl {
    return this.form.controls.userName;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  form: FormGroup;
  error = '';

  interval$: any;

  submit(): void {
    this.error = '';
    this.userName.markAsDirty();
    this.userName.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.userName.invalid || this.password.invalid) {
      return;
    }

    if (this.tenant.tenancyName) {
      this.accountService.isTenantAvailable(this.tenant).subscribe((res) => {
        if (res.state === 1) {
          this.cookie.put('Abp.TenantId', res.tenantId.toString());
          this.login();
        } else {
          this.error = '输入的企业编码不存在';
        }
      });
    } else {
      this.cookie.remove('Abp.TenantId');
      this.login();
    }
  }

  login(): void {
    this.loginService.authenticate(this.loginModel).subscribe((res) => {
      // 清空路由复用信息
      this.reuseTabService.clear();

      // 设置用户Token信息
      let tokenRes: ITokenModel = {
        token: res.accessToken,
        expired: res.expireInSeconds * 1000,
      };

      this.tokenService.set(tokenRes);

      // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
      this.startupSrv.load().then(() => {
        let url = this.tokenService.referrer!.url || '/';
        if (url.includes('/passport')) {
          url = '/';
        }
        this.router.navigateByUrl(url);
      });
    });
  }

  // #region social

  // open(type: string, openType: SocialOpenType = 'href'): void {
  //   let url = ``;
  //   let callback = ``;
  //   // tslint:disable-next-line: prefer-conditional-expression
  //   if (environment.production) {
  //     callback = 'https://ng-alain.github.io/ng-alain/#/passport/callback/' + type;
  //   } else {
  //     callback = 'http://localhost:4200/#/passport/callback/' + type;
  //   }
  //   switch (type) {
  //     case 'auth0':
  //       url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
  //       break;
  //     case 'github':
  //       url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
  //         callback,
  //       )}`;
  //       break;
  //     case 'weibo':
  //       url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
  //       break;
  //   }
  //   if (openType === 'window') {
  //     this.socialService
  //       .login(url, '/', {
  //         type: 'window',
  //       })
  //       .subscribe((res) => {
  //         if (res) {
  //           this.settingsService.setUser(res);
  //           this.router.navigateByUrl('/');
  //         }
  //       });
  //   } else {
  //     this.socialService.login(url, '/', {
  //       type: 'href',
  //     });
  //   }
  // }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
