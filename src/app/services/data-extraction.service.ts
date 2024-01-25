import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DocumentTypeModel } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class DataExtractionService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  GetDocumentType() {
    return this.http.get<DocumentTypeModel>(this.baseUrl + 'api/DocumentType');
  }

  DataExtraction(documentTypeId: any, file: File, userId: string) {
    const formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();
    params = params.append('documentType', documentTypeId.toString());
    params = params.append('user', userId);

    return this.http.post(this.baseUrl + 'sendfile', formData, { params: params });
  }

  GetExtractedData(documentTypeId: number) {
    return this.http.get(this.baseUrl + '/GetDataExtraction?documentTypeId=' + documentTypeId + '&requestId=af512bdc-cdcf-47dc-0f0b-08dc136a3144');
  }
  UploadFile(documentTypeId: any, file: File, userId: string){
    
    const formData = new FormData();
    formData.append('file', file);
    let params = new HttpParams();
    params = params.append('documentType', documentTypeId.toString());
    params = params.append('user', userId);

    return this.http.post(this.baseUrl + 'sendfile', formData, { params: params });
  }

}

//https://msuitede.maigic.com/sendfile?documentType=A48FFD4F-B721-48FE-9F45-7478195D46BE&user=9e224968-33e4-4652-b7b7-8574d048cdb9