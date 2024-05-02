
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
    library_id: number | null;
    complete: boolean;
    title: string;
    src_url: string;
    last_check: number;
    recent_chapter: number;
    words: number;
    chapters: number;
    author_name: string;
    author_url: string;
    publish_time: number;
    update_time: number;
    language: string;
}

export abstract class FicSource { 
    abstract base_url: string;
    abstract short: string;
    abstract normaliseUrl(url: string): string;
    abstract pageToContent(content: string): FicContent;
    abstract getFic(content: string, url: string): FicDetail;
    abstract getUrlForChapter(library_id: number, chapter: number): string;
}