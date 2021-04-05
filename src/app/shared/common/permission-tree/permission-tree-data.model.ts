import { FlatPermissionDto } from '@shared/service-proxies/service-proxies';

export interface PermissionTreeDataModel {
   permissions: FlatPermissionDto[];

   grantedPermissionNames: string[];
}
