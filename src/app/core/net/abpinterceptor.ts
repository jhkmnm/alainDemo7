import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject, of } from 'rxjs';
import { environment } from '@env/environment';
import { mergeMap } from 'rxjs/operators';
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { UtilsService } from './utils.service';
import { CookieService } from '@delon/util';
import { Router } from '@angular/router';

export interface IValidationErrorInfo {
  message: string;
  members: string[];
}

export interface IErrorInfo {
  code: number;
  message: string;
  details: string;
  validationErrors: IValidationErrorInfo[];
}

export interface IAjaxResponse {
  success: boolean;
  result?: any;
  targetUrl?: string;
  error?: IErrorInfo;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}

@Injectable()
export class AbpHttpConfiguration {
  constructor(
    private _messageService: NzMessageService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  defaultError = <IErrorInfo>{
    message: 'An error has occurred!',
    details: 'Error details were not sent by server.',
  };

  defaultError401 = <IErrorInfo>{
    message: 'You are not authenticated!',
    details: 'You should be authenticated (sign in) in order to perform this operation.',
  };

  defaultError403 = <IErrorInfo>{
    message: 'You are not authorized!',
    details: 'You are not allowed to perform this operation.',
  };

  defaultError404 = <IErrorInfo>{
    message: 'Resource not found!',
    details: 'The resource requested could not be found on the server.',
  };

  showError(error: IErrorInfo): any {
    debugger;
    if (error.details) {
      return this._messageService.error(error.details); //, error.message || this.defaultError.message
    } else {
      return this._messageService.error(error.message || this.defaultError.message);
    }
  }

  handleTargetUrl(targetUrl: string): void {
    if (!targetUrl) {
      location.href = '/';
    } else {
      location.href = targetUrl;
    }
  }

  handleUnAuthorizedRequest(messagePromise: any, targetUrl?: string) {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url!);

    // const self = this;

    // if (messagePromise) {
    //    messagePromise.done(() => {
    //       this.handleTargetUrl(targetUrl || '/');
    //    });
    // } else {
    //    self.handleTargetUrl(targetUrl || '/');
    // }
  }

  handleNonAbpErrorResponse(response: HttpResponse<any>) {
    const self = this;

    switch (response.status) {
      case 401:
        self.handleUnAuthorizedRequest(self.showError(self.defaultError401), '/');
        break;
      case 403:
        self.showError(self.defaultError403);
        break;
      case 404:
        self.showError(self.defaultError404);
        break;
      default:
        self.showError(self.defaultError);
        break;
    }
  }

  handleAbpResponse(response: HttpResponse<any>, ajaxResponse: IAjaxResponse): HttpResponse<any> {
    let newResponse: HttpResponse<any>;

    if (ajaxResponse.success) {
      newResponse = response.clone({
        body: ajaxResponse.result,
      });

      if (ajaxResponse.targetUrl) {
        this.handleTargetUrl(ajaxResponse.targetUrl);
      }
    } else {
      newResponse = response.clone({
        body: ajaxResponse.result,
      });

      if (!ajaxResponse.error) {
        ajaxResponse.error = this.defaultError;
      }

      this.showError(ajaxResponse.error);

      if (response.status === 401) {
        this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
      }
    }

    return newResponse;
  }

  getAbpAjaxResponseOrNull(response: HttpResponse<any>): IAjaxResponse | null {
    if (!response || !response.headers) {
      return null;
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType) {
      // this._logService.warn('Content-Type is not sent!');
      return null;
    }

    if (contentType.indexOf('application/json') < 0) {
      // this._logService.warn('Content-Type is not application/json: ' + contentType);
      return null;
    }

    const responseObj = JSON.parse(JSON.stringify(response.body));
    if (!responseObj.__abp) {
      return null;
    }

    return responseObj as IAjaxResponse;
  }

  handleResponse(response: HttpResponse<any>): HttpResponse<any> {
    const ajaxResponse = this.getAbpAjaxResponseOrNull(response);
    if (ajaxResponse == null) {
      return response;
    }

    return this.handleAbpResponse(response, ajaxResponse);
  }

  blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
      if (!blob) {
        observer.next('');
        observer.complete();
      } else {
        const reader = new FileReader();
        reader.onload = function () {
          observer.next(this.result);
          observer.complete();
        };
        reader.readAsText(blob);
      }
    });
  }
}

@Injectable()
export class AbpHttpInterceptor implements HttpInterceptor {
  protected configuration: AbpHttpConfiguration;
  // @Inject(DA_SERVICE_TOKEN) private _tokenService: ITokenService;
  private _utilsService: UtilsService;

  constructor(
    configuration: AbpHttpConfiguration,
    @Inject(DA_SERVICE_TOKEN) private _tokenService: ITokenService,
    private _cookie: CookieService,
  ) {
    this.configuration = configuration;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const interceptObservable = new Subject<HttpEvent<any>>();
    const modifiedRequest = this.normalizeRequestHeaders(request);

    next
      .handle(modifiedRequest)
      .pipe(
        _observableCatch((response_: any) => {
          return this.handleErrorResponse(response_, interceptObservable);
        }),
      )
      .subscribe((event: HttpEvent<any>) => {
        this.handleSuccessResponse(event, interceptObservable);
      });

    return interceptObservable;
  }

  protected normalizeRequestHeaders(request: HttpRequest<any>): HttpRequest<any> {
    let modifiedHeaders = new HttpHeaders();
    modifiedHeaders = request.headers
      .set('Pragma', 'no-cache')
      .set('Cache-Control', 'no-cache')
      .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');

    modifiedHeaders = this.addXRequestedWithHeader(modifiedHeaders);
    modifiedHeaders = this.addAuthorizationHeaders(modifiedHeaders);
    modifiedHeaders = this.addAspNetCoreCultureHeader(modifiedHeaders);
    modifiedHeaders = this.addAcceptLanguageHeader(modifiedHeaders);
    modifiedHeaders = this.addTenantIdHeader(modifiedHeaders);

    // ???????????????????????????
    let url = request.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.api.baseUrl + url;
    }

    return request.clone({
      url: url,
      headers: modifiedHeaders,
    });
  }

  protected addXRequestedWithHeader(headers: HttpHeaders): HttpHeaders {
    if (headers) {
      headers = headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    return headers;
  }

  protected addAspNetCoreCultureHeader(headers: HttpHeaders): HttpHeaders {
    // const cookieLangValue = this._utilsService.getCookieValue('Abp.Localization.CultureName');
    const cookieLangValue = this._cookie.get('Abp.Localization.CultureName');
    if (cookieLangValue && headers && !headers.has('.AspNetCore.Culture')) {
      headers = headers.set('.AspNetCore.Culture', cookieLangValue);
    }

    return headers;
  }

  protected addAcceptLanguageHeader(headers: HttpHeaders): HttpHeaders {
    // const cookieLangValue = this._utilsService.getCookieValue('Abp.Localization.CultureName');
    const cookieLangValue = this._cookie.get('Abp.Localization.CultureName');
    if (cookieLangValue && headers && !headers.has('Accept-Language')) {
      headers = headers.set('Accept-Language', cookieLangValue);
    }

    return headers;
  }

  protected addTenantIdHeader(headers: HttpHeaders): HttpHeaders {
    // const cookieTenantIdValue = this._utilsService.getCookieValue('Abp.TenantId');
    const cookieTenantIdValue = this._cookie.get('Abp.TenantId');
    if (cookieTenantIdValue && headers && !headers.has('Abp.TenantId')) {
      headers = headers.set('Abp.TenantId', cookieTenantIdValue);
    }

    return headers;
  }

  protected addAuthorizationHeaders(headers: HttpHeaders): HttpHeaders {
    let authorizationHeaders = headers ? headers.getAll('Authorization') : null;
    if (!authorizationHeaders) {
      authorizationHeaders = [];
    }

    if (!this.itemExists(authorizationHeaders, (item: string) => item.indexOf('Bearer ') === 0)) {
      const token = this._tokenService.get();
      if (headers && token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return headers;
  }

  protected handleSuccessResponse(event: HttpEvent<any>, interceptObservable: Subject<HttpEvent<any>>): void {
    const self = this;

    if (event instanceof HttpResponse) {
      if (event.body instanceof Blob && event.body.type && event.body.type.indexOf('application/json') >= 0) {
        const clonedResponse = event.clone();

        self.configuration.blobToText(event.body).subscribe((json) => {
          const responseBody = json === 'null' ? {} : JSON.parse(json);

          const modifiedResponse = self.configuration.handleResponse(
            event.clone({
              body: responseBody,
            }),
          );

          interceptObservable.next(
            modifiedResponse.clone({
              body: new Blob([JSON.stringify(modifiedResponse.body)], { type: 'application/json' }),
            }),
          );

          interceptObservable.complete();
        });
      } else {
        interceptObservable.next(event);
        interceptObservable.complete();
      }
    }
  }

  protected handleErrorResponse(error: any, interceptObservable: Subject<HttpEvent<any>>): Observable<any> {
    const errorObservable = new Subject<any>();

    if (!(error.error instanceof Blob)) {
      interceptObservable.error(error);
      interceptObservable.complete();
      return of({});
    }

    this.configuration.blobToText(error.error).subscribe((json) => {
      const errorBody = json === '' || json === 'null' ? {} : JSON.parse(json);
      const errorResponse = new HttpResponse({
        status: error.status,
        headers: error.headers,
        body: errorBody,
      });

      const ajaxResponse = this.configuration.getAbpAjaxResponseOrNull(errorResponse);

      if (ajaxResponse != null) {
        this.configuration.handleAbpResponse(errorResponse, ajaxResponse);
      } else {
        this.configuration.handleNonAbpErrorResponse(errorResponse);
      }

      errorObservable.complete();

      // prettify error object.
      error.error = errorBody;
      interceptObservable.error(error);
      interceptObservable.complete();
    });

    return errorObservable;
  }

  private itemExists<T>(items: T[], predicate: (item: T) => boolean): boolean {
    for (let i = 0; i < items.length; i++) {
      if (predicate(items[i])) {
        return true;
      }
    }

    return false;
  }
}
