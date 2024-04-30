
export interface FicContent {
    title: string;
    content: string;
    chapter: number;
    next?: string;
    previous?: string;
}

export type Ao3Rating = "General Audiences" | "Teen And Up Audiences" | "Mature" | "Explicit" | "Not Rated";

export interface Fic {
    title: string;
    words: number;
    chapters: number;
    author: string;
    author_link: string;
    published: string;
    updated: string;
    language: string;
}

export interface Ao3Fic extends Fic {
    fandoms: string[];
    rating: Ao3Rating;
    comments: number;
    kudos: number;
    bookmarks: number;
    hits: number;
}

export interface FfnetFic extends Fic {
    reviews: number;
    favs: number;
    follows: number;
}

export abstract class FicSource { 
    abstract base_url: string;
    abstract short: string;
    abstract pageToContent(content: string): FicContent;
    abstract getFic(url: string): Promise<Fic>;
}