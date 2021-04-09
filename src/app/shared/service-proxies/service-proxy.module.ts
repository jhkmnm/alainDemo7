import { NgModule } from '@angular/core';
import * as ApiServiceProxies from './service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.DicServiceProxy,
    ApiServiceProxies.HostCachingServiceProxy,
    ApiServiceProxies.EditionServiceProxy,
    // ApiServiceProxies.ConfigurationServiceProxy,
    // { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
  ],
})
export class ServiceProxyModule {}
