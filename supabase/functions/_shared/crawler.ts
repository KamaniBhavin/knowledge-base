// eslint-disable-next-line no-unused-vars
export enum UrlDocumentType {
    XML = "XML",
    HTML = "HTML",
    PDF = "PDF",
}

export interface SiteMapCrawlerConfiguration {
    readonly url: string;
    readonly url_document_type: UrlDocumentType;
}
