import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PdfThumbnailComponent, BoundingBox } from '../pdf-thumbnail/pdf-thumbnail.component';
import { FormsModule } from '@angular/forms';
import { CallbackPipe } from '../../pipes/callback.pipe';
import { LabelDoc, LabelInfo } from '../../models/label';
import { Condition, LabelGroup } from '../../models/condition';
import { SftpService } from '../../services/sftp.service';
import { environment } from '../../../environments/environment';
import { DataExtractionService } from '../../services/data-extraction.service';

interface FileResponse {
    documentType: string;
    modelId: string;
    docNameStartWith: string;
    id: number;
  }

interface Data {
    dataExtractionValueTableId: number;
    fieldName: string;
    fieldDisplayName: string;
    fieldValue: string;
    confidence: string;
    topLeftX: string;
    topLeftY: string;
    bottomRightX: string;
    bottomRightY: string;
    pageNo: string;
    pageWidth: string;
    accuracy: string;
    accuracyDate: string;
}

@Component({
    selector: 'app-demo-page',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, PdfThumbnailComponent, CallbackPipe],
    templateUrl: './demo-page.component.html',
    styleUrl: './demo-page.component.css'
})
export class DemoPageComponent implements OnInit, OnDestroy {
    modelId: string = '';
    isExtractButtonClicked = false;
    @ViewChild(PdfThumbnailComponent) pdfThumbnail!: PdfThumbnailComponent;
    box: BoundingBox = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pageNo: 0,
        pageWidth: 0
    };
    selectedDocumentId: number = 0;
    documentList:any = [];
    currentPdfSource: LabelDoc = {
        document: '',
        labels: []
      };
    pdfLabelsFile = '';
    pdfSource: LabelDoc | undefined;
    documentName = '';
    labels: Array<LabelInfo> = [];
    conditions: Array<Condition> = [];
    filteredConditions: Array<Condition> = [];
    conditionFilter = 'Review';
    conditionFilters: Array<string> = ['All', 'Not-Applicable', 'Met', 'Unmet', 'Review'];
    selectedCondition: Condition | undefined;
    selectedLabelGroup: LabelGroup | undefined;

    extractedData: any[] = [];

    applicableConditions: Set<number> = new Set();
    metConditions: Set<number> = new Set();
    reviewConditions: Set<number> = new Set();
    unmetReviewConditions: Set<number> = new Set();

    filtersPerPage = 7;
    currentPage = 1;
    totalPages = 1;
    pages = [1];

    selectedPageInDocument = 1;
    totalPagesInDocument = 1;

    httpClient: HttpClient;

    secondsSpentOnConditions: {
        [conditionId: number]: number
    } = {};

    conditionStartTime: Date | undefined;
    durationIntervalKey: number | undefined;
    secondsPassedForActiveSession = 0;

    constructor(httpClient: HttpClient, private DataExtraction : DataExtractionService, private sftp: SftpService) {
        this.httpClient = httpClient;
    }

    ngOnInit(): void {
        this.getDropDownData();
        this.durationIntervalKey = window.setInterval(this.updateDurationForActiveSession.bind(this), 1000);
    }

    updateDurationForActiveSession() {
        requestAnimationFrame(() => {
            if (this.conditionStartTime) {
                const now = new Date();
                const durationInActiveSession = Math.ceil((now.getTime() - this.conditionStartTime.getTime()) / 1000);
                this.secondsPassedForActiveSession = durationInActiveSession;
            }
        });
    }

    ngOnDestroy(): void {
        window.clearInterval(this.durationIntervalKey);
    }

    async fetchDataFromFile() {
        //const httpResponse: any = await lastValueFrom(this.httpClient.get(`assets/${this.pdfLabelsFile}`, { responseType: 'json' }));
        this.pdfSource = {
            document: `../../../assets/`,
            labels: []};

        if (this.pdfSource?.document) {
            let fileName;
            switch(this.pdfLabelsFile) {
                case '1':
                    fileName = '1003 - Final.pdf';
                    break;
                case '2':
                    fileName = 'CD - Final.pdf';
                    break;
                case '3':
                    fileName = 'Income - Paystubs.pdf';
                    break;
                case '4':
                    fileName = 'Loan Estimate.pdf';
                    break;
            }
            
            this.pdfSource.document = this.currentPdfSource.document;
            //this.documentName = this.pdfSource.document.substring(0, this.pdfSource.document.lastIndexOf('.'));
        }
    }

    getDropDownData(){
        this.DataExtraction.GetDocumentType().subscribe((documentData:any)=>{
          this.documentList = documentData.data
        })
      }

    async onDocumentTypeChange(newValue: any) {
        this.selectedDocumentId = newValue;
        console.log(this.selectedDocumentId)
        await this.downloadFile();
        this.ExtractData();
        this.updateLabelsDoc();
        //this.getExtractedData(newValue);
        this.isExtractButtonClicked = true;
    }

    async ExtractData() {
        const response = await this.httpClient.get(this.currentPdfSource.document, { responseType: 'blob' }).toPromise();
        if (response) {
            const file = new File([response], 'filename', { type: 'application/pdf' });
            this.DataExtraction.DataExtraction(this.selectedDocumentId, file, '9e224968-33e4-4652-b7b7-8574d048cdb9').subscribe((response: any) => {
                console.log(response);
                this.extractedData = response.data;
            });
        } else {
            console.error('Failed to download file');
        }
    }

    downloadFile(): Promise<void> {
        return new Promise((resolve, reject) => {
            const fileId = this.selectedDocumentId;
            console.log(fileId)
            if (fileId) {
                this.sftp.DownloadFile(fileId).subscribe((response: Blob) => {
                    console.log(response);
                    const fileUrl = URL.createObjectURL(response);
                    this.currentPdfSource.document = fileUrl;
                    console.log(this.currentPdfSource)
                    this.fetchDataFromFile();
                    resolve();
                }, error => {
                    console.error(error);
                    reject(error);
                });
            } else {
                console.error('No document selected');
                reject('No document selected');
            }
        });
    }

    getLabelGroupFromNames(names: Array<string>) {
        const defaultGroup: LabelGroup = {
            pageNumber: 1,
            labels: [],
        };

        if (names.length === 0) {
            return defaultGroup;
        }

        const labels = this.labels.filter(label => names.includes(label.label));

        if (labels.length === 0) {
            const emptyGroup: LabelGroup = {
                pageNumber: 0,
                labels: names.map(name => {
                    return {
                        label: name,
                        value: [],
                    }
                }),
            };
            return emptyGroup;
        }

        const firstLabel = labels[0];

        if (firstLabel.value.length === 0) {
            return defaultGroup;
        }

        const firstLabelPage = firstLabel.value[0].page;

        const labelGroup: LabelGroup = {
            pageNumber: firstLabelPage,
            labels: labels,
            zoomLevel: 2,
        };

        return labelGroup;
    }

    
    goToDefaultDocumentPage(pageNumber: number) {
        if (pageNumber > 0 && pageNumber <= this.totalPagesInDocument) {
            this.selectedPageInDocument = pageNumber;
        }
    }

    updateDefaultTotalPages(totalPages: number) {
        this.totalPagesInDocument = totalPages;
    }

    selectLabelGroup(labelGroup: LabelGroup) {
        if (labelGroup.pageNumber) {
            this.selectedPageInDocument = labelGroup.pageNumber;
        } else {
            this.selectedPageInDocument = 1;
        }

        this.selectedLabelGroup = labelGroup;
    }

    getReadableStringFromTotalSeconds(totalSeconds: number) {
        const totalMinutes = Math.floor(totalSeconds / 60);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        let readableString = '';

        if (hours) {
            readableString += `${hours}h `;
        }

        if (hours || minutes) {
            readableString += `${minutes}m `;
        }

        readableString += `${seconds}s`;

        return readableString;
    }

    readableTimeSpentOnCondition(condition: Condition) {
        let totalSeconds = this.secondsSpentOnConditions[condition.id] || 0;
        if (condition.id === this.selectedCondition?.id) {
            totalSeconds += this.secondsPassedForActiveSession;
        }

        return this.getReadableStringFromTotalSeconds(totalSeconds);
    }

    getTotalTimeSpentOnConditions() {
        let totalSeconds = Object.keys(this.secondsSpentOnConditions).map(conditionId => Number(conditionId)).reduce((prev, cur) => {
            return prev + this.secondsSpentOnConditions[cur];
        }, 0);

        if (this.selectedCondition) {
            totalSeconds += this.secondsPassedForActiveSession;
        }

        return this.getReadableStringFromTotalSeconds(totalSeconds);
    }

    submitForm() {
        window.alert('Saved');
    }

    updateLabelsDoc() {
        this.selectedCondition = undefined;
        this.selectedLabelGroup = undefined;
        this.selectedPageInDocument = 1;

        this.secondsSpentOnConditions = {};
        this.conditionStartTime = undefined;
        this.secondsPassedForActiveSession = 0;

        //this.fetchDataFromFile();
    }

    getExtractedData(documentTypeId: number){
        this.DataExtraction.GetExtractedData(documentTypeId).subscribe((extractedData:any)=>{
          this.extractedData = extractedData.data
        })
    }

    convertToNumber(value: string): number {
        return Number(value);
    }

    highlight(data: Data, option: Number){
        if (data && option == 1){
            let newHeight;
            let newwidth;
             let datanew =  this.convertToNumber(data.topLeftY)
            let data1 = this.convertToNumber(data.topLeftX)
            let data2 = this.convertToNumber(data.bottomRightY)
            let data3 = this.convertToNumber(data.bottomRightX)

            this.box.top = this.convertToNumber(data.topLeftX)
            this.box.left = this.convertToNumber(data.topLeftY)
            this.box.height = Math.abs(datanew - data2);
            newHeight = this.box.height;
            this.box.width = Math.abs(data1 - data3);
            newwidth = this.box.width
            this.box.pageNo = this.convertToNumber(data.pageNo)
            this.box.pageWidth = this.convertToNumber(data.pageWidth)
            this.selectedPageInDocument = this.convertToNumber(data.pageNo)
            this.pdfThumbnail.updateBox(this.box, this.convertToNumber(data.pageNo),data,newHeight,newwidth)
        }
        else if (option == 2){
            let newHeight;
            let newwidth;
            // this.box.top = 0
            // this.box.left = 0
            // this.box.height = 0
            // this.box.width = 0
            // this.box.pageNo = 0
            // this.box.pageWidth = 0
            // this.pdfThumbnail.updateBox(this.box, this.selectedPageInDocument,data)
        
            let datanew =  this.convertToNumber(data.topLeftY)
            let data1 = this.convertToNumber(data.topLeftX)
            let data2 = this.convertToNumber(data.bottomRightY)
            let data3 = this.convertToNumber(data.bottomRightX)

            this.box.top = this.convertToNumber(data.topLeftX)
            this.box.left = this.convertToNumber(data.topLeftY)
            this.box.height = Math.abs(datanew - data2);
            newHeight = this.box.height;

            this.box.width = Math.abs(data1 - data3);
            newwidth = this.box.width

            this.box.pageNo = this.convertToNumber(data.pageNo)
            this.box.pageWidth = this.convertToNumber(data.pageWidth)
            this.selectedPageInDocument = this.convertToNumber(data.pageNo)

            this.pdfThumbnail.updateBox(this.box, this.convertToNumber(data.pageNo),data,newHeight,newwidth)
        }
    }

    updateModelId(){
        this.modelId = this.documentList.find((document: FileResponse) => document.id == this.convertToNumber(this.pdfLabelsFile)).modelId;
        this.documentName = this.documentList.find((document:FileResponse) => document.id == this.convertToNumber(this.pdfLabelsFile)).documentType;
    }

}


