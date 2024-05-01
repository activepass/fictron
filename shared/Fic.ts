
export interface FicContent {
    title: string;
    content: string;
    chapter: number;
    next?: string;
    previous?: string;
}

export interface MinFicDetail {
    id: number;
    name: string;
    author_name: string;
}

export interface FicDetail {
    title: string;
    src: string;
    last_check: number;
    words: number;
    chapters: number;
    author: string;
    author_link: string;
    publish_time: number;
    update_time: number;
    language: string;
}

export abstract class FicSource { 
    abstract base_url: string;
    abstract short: string;
    abstract pageToContent(content: string): FicContent;
    abstract getFic(content: string, url: string): FicDetail;
    abstract getUrlForChapter(fic: FicDetail, chapter: number): string;
}