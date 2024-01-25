export interface TextBoundBox {
    page: number;
    text: string;
    boundingBoxes: Array<Array<number>>
}

export interface LabelInfo {
    label: string;
    value: Array<TextBoundBox>;
}

export interface LabelDoc {
    document: string,
    fileName: string
}