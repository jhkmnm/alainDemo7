import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { CreateOrUpdateRoleInput, RoleEditDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-roles-create',
  templateUrl: './create.component.html',
})
export class CreateRoleComponent extends ModalComponentBase implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  record: any = {};
  i: RoleEditDto = new RoleEditDto({ id: null, displayName: '', isDefault: false });
  saving = false;
  schema: SFSchema = {
    properties: {
      displayName: { type: 'string', title: '名称', maxLength: 50 },
      isDefault: { type: 'boolean', title: '默认' },
    },
    required: ['displayName'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $displayName: {
      widget: 'string',
    },
  };

  constructor(injector: Injector, private _roleService: RoleServiceProxy, private httpClient: HttpClient) {
    super(injector);
  }

  ngOnInit(): void {}

  save() {
    const input = new CreateOrUpdateRoleInput();
    input.role = RoleEditDto.fromJS(this.sf.value);
    input.role.id = null;

    this.saving = true;

    // const content_ = JSON.stringify(input);
    // let options_: any = {
    //    body: content_,
    //    observe: "response",
    //    responseType: "blob",
    //    headers: new HttpHeaders({
    //      "Content-Type": "application/json-patch+json",
    //    })
    //  };
    let options_: any = {
      headers: new HttpHeaders({
        Authorization:
          'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IjA5YjMwYWQ2LWU2MjAtZjAwNy05OGRjLTM5ZjhmODNmZDE2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3d3dy5hc3BuZXRib2lsZXJwbGF0ZS5jb20vaWRlbnRpdHkvY2xhaW1zL3RlbmFudElkIjoiMSIsInN1YiI6WyIyIiwiMiJdLCJqdGkiOlsiZjI1NzY4MzktY2Q2Yi00MDUwLWIzNzEtMmEyOTZkZmZmODM5IiwiZmJlMTVlZTQtNjVhZC00YmFmLWE5MTYtZTIxYmI0YjdjYzZmIl0sImlhdCI6WzE2MTc5NTY1NDQsMTYxNzk1NjU0NV0sIlVzZXJOYW1lIjoiYWRtaW4iLCJFbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInRva2VuX3ZhbGlkaXR5X2tleSI6IjE4YWEwMjEyLTRiNjQtNDdiZC05OTQ5LTRlMjE3OGI0MjRkNiIsInVzZXJfaWRlbnRpZmllciI6IjJAMSIsIm5iZiI6MTYxNzk1NjU0NSwiZXhwIjoxNjE4MDQyOTQ1LCJpc3MiOiJQbGF0Zm9ybSIsImF1ZCI6IlBsYXRmb3JtIn0.EQyVqbyD8kItkS3GXVn4_K9rghS6MeDZqbUfmyG-IRI',
        'Access-Control-Allow-Origin': 'http://localhost:7299',
      }),
    };
    debugger;
    let url = 'http://localhost:7299/api/services/app/Role/CreateOrUpdate';
    // this.httpClient.request("post", , input, options_)
    this.httpClient
      .post(url, input, options_)
      .pipe(finalize(() => {}))
      .subscribe((res) => {
        console.log(res);
      });

    // this._roleService
    //    .createOrUpdate(input)
    //    .pipe(finalize(() => {
    //       this.saving = false;
    //    }))
    //    .subscribe(res => {
    //       this.msgSrv.success("创建成功");
    //       this.success();
    //    });
  }

  close() {
    super.close();
  }
}
