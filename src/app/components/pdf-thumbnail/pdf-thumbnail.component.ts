import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PDFDocumentLoadingTask, PageViewport, PDFPageProxy, PDFDocumentProxy } from 'pdfjs-dist';
import { CommonModule } from '@angular/common';
import { ChangeContext, NgxSliderModule } from 'ngx-slider-v2';
import { CustomStepDefinition, Options as SliderOptions } from 'ngx-slider-v2';
import { LabelGroup } from '../../models/condition';
import { LabelDoc, LabelInfo } from '../../models/label';

export interface BoundingBox {
    top: number;
    left: number;
    width: number;
    height: number;
    pageNo: number;
    pageWidth: number;
}

@Component({
    selector: 'app-pdf-thumbnail',
    standalone: true,
    imports: [CommonModule, NgxSliderModule],
    templateUrl: './pdf-thumbnail.component.html',
    styleUrl: './pdf-thumbnail.component.css'
})
export class PdfThumbnailComponent implements AfterViewInit, OnChanges {
    @Input() pdfSource: LabelDoc | undefined;
    @Input() pageNumber!: number;
    @Input() defaultZoomLevel: number | undefined;
    @Input() selectedLabels!: Array<LabelInfo>;
    @Input() pclData: string | undefined;

    @Output() totalPagesEvent = new EventEmitter<number>();
    @Output() selectLabelGroupEvent = new EventEmitter<LabelGroup>();
    updatedZoomLevel:any=1.5;

    @ViewChild('pdfCanvas') canvasElement!: ElementRef<HTMLCanvasElement>;
    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D;
    @ViewChild('boundingBoxOverlay') boundingBoxOverlay!: ElementRef<HTMLElement>;

    pdfDoc: PDFDocumentProxy | undefined;
    page!: PDFPageProxy;
    box: BoundingBox = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pageNo: 0,
        pageWidth: 0
    };

    percentageChange:any=0;

    zoomLevel = 1.5;
    isShowingPclData = false;
    pclDataTop = 0;
    pclDataLeft = 0;

    readableLabels = '';

    zoomSlider: SliderOptions;

    constructor() {
        const zoomSteps: CustomStepDefinition[] = [];

        for (let i = 10; i <= 300; i += 10) {
            const stepObject: CustomStepDefinition = {
                value: i / 100,
            }

            if (i % 50 === 0) {
                stepObject.legend = (i / 100) + 'x';
            }

            zoomSteps.push(stepObject);
        }

        this.zoomSlider = {
            showTicks: true,
            stepsArray: zoomSteps,
        }
    }

    ngAfterViewInit(): void {

        if (this.defaultZoomLevel) {
            this.zoomLevel = this.defaultZoomLevel;
        }

        const canvasElement = this.canvasElement.nativeElement;

        if (!canvasElement) {
            throw new Error('The canvas element must not be null');
        }

        if (!(canvasElement instanceof HTMLCanvasElement)) {
            throw new Error('The element must be a canvas');
        }

        this.canvas = canvasElement;

        const canvasContext = canvasElement.getContext('2d');

        if (!canvasContext) {
            throw new Error('The canvas 2D rendering context must exist');
        }

        this.context = canvasContext;

        this.readableLabels = this.selectedLabels.map(label => label.label).join(', ');

        this.loadPdfDocument();
    }

    loadPdfDocument() {
        if (!this.pdfSource) {
            throw new Error('The PDF doc needs to be defined');
        }
        

        if (!this.pageNumber) {
            return;
        }
        
        const pdfDocument: PDFDocumentLoadingTask = (window as any).pdfjsLib.getDocument(`${this.pdfSource.document}`);

        pdfDocument.promise
            .then(pdfDoc => {
                this.totalPagesEvent.emit(pdfDoc.numPages);
                this.pdfDoc = pdfDoc;
                return pdfDoc.getPage(this.pageNumber);
            })
            .then(page => {
                this.page = page;
                const viewport = page.getViewport({ scale: this.zoomLevel });
                this.setCanvasSize(viewport);
                this.renderPdfPage(page, viewport);
                this.setBoundingBoxesForLabels(this.selectedLabels, viewport);
                requestAnimationFrame(() => this.scrollToBoundingBox());
            })
            .catch(error => console.error('Error loading PDF:', error));
    };

    updateBox(inputBox: BoundingBox, pageNo: number,data:any,newHeight:any,newwidth:any){        
        if (this.pdfDoc){
            this.pdfDoc.getPage(pageNo).then(page => {
                const viewport = page.getViewport({ scale: 1 * this.zoomLevel });
                const zoom = this.zoomLevel * 700;
                if(this.percentageChange != 0) {
                    const newpercentage = ((this.zoomLevel-1.5)/1.5)*100;

                    const htmlTop = (data.topLeftX * viewport.height) / zoom;
                    const htmlLeft = (data.topLeftY * viewport.width) / zoom;
                    const htmlHeight = (newHeight * viewport.height) / zoom;
                    const htmlWidth = (newwidth * viewport.width) / zoom;
    
                    inputBox.top = (htmlLeft + (0.3 * htmlLeft)) * 95;
                    inputBox.left = (htmlTop - (0.003 * htmlTop)) * 96 ;
                    inputBox.height = htmlHeight * 97;
                    inputBox.width = (htmlWidth + (0.3 * htmlWidth)) * 96;

                    inputBox.top = inputBox.top + (newpercentage/100)*inputBox.top;
                    inputBox.height = inputBox.height + (newpercentage/100)*inputBox.height;
                    inputBox.width = inputBox.width + (newpercentage/100)*inputBox.width;
                    inputBox.left = inputBox.left + (newpercentage/100)*inputBox.left;
                }
                else {                    
                    const htmlTop = (inputBox.top * viewport.height) / zoom;
                    const htmlLeft = (inputBox.left * viewport.width) / zoom;
                    const htmlHeight = (inputBox.height * viewport.height) / zoom;
                    const htmlWidth = (inputBox.width * viewport.width) / zoom;
    
                    inputBox.top = (htmlLeft + (0.3 * htmlLeft) ) * 95;
                    inputBox.left = (htmlTop - (0.003 * htmlTop)) * 96 ;
                    inputBox.height = htmlHeight * 97;
                    inputBox.width = (htmlWidth + (0.3 * htmlWidth)) * 96;
                }

                // this.renderPdfPage(page, viewport);
                this.box = inputBox;
            });
        }
    }
    updateZoomLevelBox(zoomLevel: any,data:any) {
        this.updatedZoomLevel = zoomLevel;
        const viewport = this.page.getViewport({ scale: zoomLevel });
        this.setCanvasSize(viewport);
         this.renderPdfPage(this.page, viewport);
        this.setBoundingBoxesForLabels(this.selectedLabels, viewport);
        requestAnimationFrame(() => this.scrollToBoundingBox());
    }
   
    updateZoomLevel(zoomLevel: ChangeContext) {
        const viewport = this.page.getViewport({ scale: zoomLevel.value });

        const newZoom = zoomLevel.value;
        const oldZoom = this.updatedZoomLevel;
        let percentageChange = (newZoom - oldZoom)/oldZoom  * 100;
        this.percentageChange = percentageChange;
        var cordinates = this.box;
       
        this.box.top = this.box.top + (percentageChange/100)*this.box.top;
        this.box.height = this.box.height + (percentageChange/100)*this.box.height;
        this.box.width = this.box.width + (percentageChange/100)*this.box.width;
        this.box.left = this.box.left + (percentageChange/100)*this.box.left;
       

        this.updatedZoomLevel = zoomLevel.value;

        this.setCanvasSize(viewport);
        this.renderPdfPage(this.page, viewport);
        this.setBoundingBoxesForLabels(this.selectedLabels, viewport);
        requestAnimationFrame(() => this.scrollToBoundingBox());
    }

    setCanvasSize(viewport: PageViewport) {
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
    };

    renderPdfPage(page: PDFPageProxy, viewport: PageViewport) {
        const renderContext = { canvasContext: this.context, viewport };
        page.render(renderContext);
    };

    setBoundingBoxesForLabels(labels: Array<LabelInfo>, viewport: PageViewport) {
        // this.boundingBoxes = labels.map(label => label.value).flat().map(value => value.boundingBoxes).flat().map(box => {
        //     return {
        //         top: box[1] * viewport.height,
        //         left: box[0] * viewport.width,
        //         width: (box[2] - box[0]) * viewport.width,
        //         height: (box[5] - box[1]) * viewport.height,
        //     }
        // });
    }

    scrollToBoundingBox() {
        const boundingBoxDiv = this.boundingBoxOverlay.nativeElement.querySelector('div');

        if (boundingBoxDiv) {
            const top = boundingBoxDiv.offsetTop;
            const left = boundingBoxDiv.offsetLeft;

            const scrollContainer = this.canvasElement.nativeElement.parentElement?.parentElement;

            if (scrollContainer) {
                const containerWidth = scrollContainer.clientWidth;
                const containerHeight = scrollContainer.clientHeight;

                const scrollLeft = left - (containerWidth / 2);
                const scrollTop = top - (containerHeight / 2);

                scrollContainer?.scrollTo({
                    top: scrollTop,
                    left: scrollLeft,
                    behavior: 'instant',
                });
            }

        }
    };

    selectLabelGroup() {
        const newLabelGroup: LabelGroup = {
            pageNumber: this.pageNumber,
            labels: this.selectedLabels,
        };

        this.selectLabelGroupEvent.emit(newLabelGroup);
    }

    showPclData() {
        this.isShowingPclData = true;
    }

    movePclData(event: MouseEvent) {
        this.pclDataLeft = event.offsetX + 20;
        this.pclDataTop = event.offsetY + 20;
    }

    hidePclData() {
        this.isShowingPclData = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['pageNumber'] && !changes['pageNumber'].firstChange && changes['pageNumber'].previousValue !== changes['pageNumber'].currentValue) {
            this.loadPdfDocument();
        }

        if (changes['pdfSource'] && !changes['pdfSource'].firstChange && changes['pdfSource'].previousValue !== changes['pdfSource'].currentValue) {
            this.loadPdfDocument();
        }
    }
}
