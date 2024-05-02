import { load } from 'cheerio';
import { FicDetail, FicContent, FicSource } from './Fic';
import { getAo3FicUrl } from './Library';

export type Ao3Rating = "General Audiences" | "Teen And Up Audiences" | "Mature" | "Explicit" | "Not Rated";

export interface Ao3FicDetail extends FicDetail {
    fandoms: string[];
    rating: Ao3Rating;
    comments: number;
    kudos: number;
    bookmarks: number;
    hits: number;
}




export class Ao3Source extends FicSource {
    
    base_url = "https://archiveofourown.org";
    short = "ao3"; 

    normaliseUrl(url: string): string {
        const reg = /https:\/\/archiveofourown.org\/works\/\d+/;
        if (reg.test(url)) {
            return url.match(reg)![0];
        }
        throw new Error("Invalid Ao3 URL, is this an error? or a shit url? url is: " + url)
    }

    pageToContent(content: string): FicContent {
        const start_time = Date.now();
        const $ = load(content);
        const ficcontent = $("[role='article']").html().replace("<h3 class=\"landmark heading\" id=\"work\">Chapter Text</h3>", "");
        const title = $(".title").first().text();
        if (title.length <= 0 ) {
            const locked = $("#signin")
            if (!locked) {
                console.log("wacky error", $("body").html())
                return {title: "Failed wacky", content: "", chapter: -1}
            }
            return {title: "Locked Fic", content: "you have to be logged in to access this", chapter: -1}
        }
        const chapter = $(".chapter.preface .title a").text();

        const next = $(".chapter.next").children().first().attr("href");
        const previous = $(".chapter.previous").children().first().attr("href");

        console.log(`Time taken to parse fic: ${Date.now() - start_time}ms`);
        return {
            title: title,
            content: ficcontent!,
            ...(chapter ? {chapter: +chapter.substring("Chapter ".length)} : {chapter: 0}),
            ...(next && next.length > 0 ? {next: this.base_url + next} : {}),
            ...(previous && previous.length > 0 ? {previous: this.base_url + previous} : {})
        } satisfies FicContent;
    }

    getFic(content: string, url: string): Ao3FicDetail {
        const start_time = Date.now();
        const $ = load(content);
        const title = $(".title").first().text().trim();
        const author_a = $(".byline a");
        const author = author_a.text();
        const author_link = this.base_url + author_a.attr("href");
        const published = $("dd.published").text();
        const updated = $("dd.status").text().orDefault(published);
        const language = $("dd.language").text().trim();
        const words = +$("dd.words").text().replace(/,/g, '');
        const chapter_info = $("dd.chapters").text().match(/([0-9]+)\/([0-9?]+)/m);
        
        const curr_chapter = +chapter_info[1];
        const total_chapters = chapter_info[2] === "?" ? -1 : +chapter_info[2];

        const fandoms = $(".fandom a").map((_, elem) => $(elem).text()).get();
        const rating = $("dd.rating").text().trim() as Ao3Rating;
        const comments = +$("dd.comments").text().replace(/,/g, '').orDefault('0');
        const kudos = +$("dd.kudos").text().replace(/,/g, '').orDefault('0');
        const bookmarks = +$("dd.bookmarks").text().replace(/,/g, '').orDefault('0');
        const hits = +$("dd.hits").text().replace(/,/g, '').orDefault('0');

        console.log(`Time taken to parse fic meta: ${Date.now() - start_time}ms`);
        return {title,
            src_url: this.normaliseUrl(url),
            words,
            chapters: curr_chapter,
            author_name: author,
            author_url: author_link,
            publish_time: Date.parse(published),
            update_time: Date.parse(updated),
            language,
            fandoms,
            rating,
            comments,
            kudos,
            bookmarks,
            hits, 
            last_check: Date.now(),
            library_id: null,
            recent_chapter: 0,
            complete: curr_chapter === total_chapters 
        } satisfies Ao3FicDetail;
    }

    getUrlForChapter(library_id: number, chapter: number): string {
        console.log("Chapter is", chapter)
        const url = getAo3FicUrl(library_id);
        if (chapter === 1) {
            return url;
        }
        let nav_url = url;
        if (nav_url.endsWith("/")) {
            nav_url = nav_url.slice(0, -1);
        }
        nav_url = `${nav_url}/navigate`;
        fetch(nav_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(content => {
                const $ = load(content);
                const chapter_url = $("ol.index > li:nth-child(3) > a").attr("href");
                if (!chapter_url) {
                    throw new Error("Chapter not found");
                }
                return this.base_url + chapter_url;
            });
    }
    
}