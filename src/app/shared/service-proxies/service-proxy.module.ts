import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AbpHttpInterceptor } from 'src/app/core/net/abpinterceptor';
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
    ApiServiceProxies.LanguageServiceProxy,
    ApiServiceProxies.AuditLogServiceProxy,
    // ApiServiceProxies.ConfigurationServiceProxy,
    { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
  ],
})
export class ServiceProxyModule {}
