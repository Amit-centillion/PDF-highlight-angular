import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SftpService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  DownloadFile(fileId: number) {
    return this.http.get(this.baseUrl + 'api/SFTP/?fileId=' + fileId, { responseType: 'blob' });
  }
}
