import { load } from 'cheerio';
import { Fic, FicContent, FicSource } from './Fic';

export class Ao3Source extends FicSource {
    base_url = "https://archiveofourown.org";
    short = "ao3"; 

    pageToContent(content: string): FicContent {
        const start_time = Date.now();
        const $ = load(content);
        const ficcontent = $("[role='article']").html();
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

    getFic(url: string): Promise<Fic> {
        console.log('url', url)
        throw new Error('Method not implemented.');
    }
    
}