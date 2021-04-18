import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { FileDto } from '@shared/service-proxies/service-proxies';

@Injectable()
export class FileDownloadService {
  downloadTempFile(file: FileDto) {
    // tslint:disable-next-line:max-line-length
    const url =
      environment.api.baseUrl +
      '/File/DownloadTempFile?fileType=' +
      file.fileType +
      '&fileToken=' +
      file.fileToken +
      '&fileName=' +
      file.fileName;
    location.href = url; // TODO: This causes reloading of same page in Firefox
  }
}
