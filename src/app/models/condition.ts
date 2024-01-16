import { LabelInfo } from "./label";

export interface LabelGroup {
    pageNumber: number;
    zoomLevel?: number;
    pclData?: string;
    labels: Array<LabelInfo>;
}

export interface Condition {
    id: number;
    name: string;
    labelGroups: Array<LabelGroup>;
}

export interface PclMapping {
    [key: string]: string;
}