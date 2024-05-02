import { load } from 'cheerio';
import { FicDetail, FicContent, FicSource } from './Fic';
import { getFfnFicUrl } from './Library';

export interface FfnetFicDetail extends FicDetail {
    reviews: number;
    favs: number;
    follows: number;
}

export class FfnSource extends FicSource {
    normaliseUrl(url: string): string {
        const reg = /https:\/\/www.fanfiction.net\/s\/\d+/gm;
        if (reg.test(url)) {
            return url.match(reg)![0];
        }
        throw new Error("Invalid ffn URL, is this an error? or a shit url? url is: " + url)
    }
    
    base_url = "https://www.fanfiction.net";
    short = "ffn"; 

    pageToContent(content: string): FicContent {
        const $ = load(content);
        const title = $('b.xcontrast_txt');
        const ficcontent = $("[role='main']");
        const chapter = $('#chap_select').val()!;
        const Fic = {title: title.text(), content: ficcontent.html()!, chapter: +chapter} satisfies FicContent as FicContent;
        const nav_btns = $("#content_wrapper_inner > span:nth-child(7) > button");

        nav_btns.each((_, elem) => {
            const btn = $(elem);
            if (btn.text() === "Next >") {
                Fic.next = this.base_url + btn.attr("onclick")!.split("'")[1];
            } else if (btn.text() === "< Prev") {
                Fic.previous = this.base_url + btn.attr("onclick")!.split("'")[1];
            }
        });

        return Fic;
    }

    getFic(content: string, url: string): FfnetFicDetail {
        const $ = load(content);
        const title = $('b.xcontrast_txt').text();
        const details = $('.xgray').text()
        const author_a = $('a.xcontrast_txt:nth-child(5)').length == 0 ? $('a.xcontrast_txt:nth-child(4)') : $('a.xcontrast_txt:nth-child(5)');
        const author = author_a.text();
        const author_url = this.base_url + author_a.attr('href')!;
        const publish_time = $('.xgray > span:nth-child(4)').text();
        const update_time = $('.xgray > span:nth-child(3)').text().orDefault(publish_time);

        const regexable = details.match(/Chapters: (\d+) - Words: ([\d,]+) - Reviews: ([\d,]+) - Favs: ([\d,]+) - Follows: ([\d,]+)/m)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, chapters, words, reviews, favs, follows] = regexable!;
        const status = details.match(/Status: (\w+)/m)

        return {
            library_id: null,
            complete: status && status[0] === "Complete",
            title,
            src_url: this.normaliseUrl(url),
            last_check: Date.now(),
            recent_chapter: 0,
            author_name: author,
            author_url,
            words: +words.replace(/,/g, ''),
            chapters: +chapters,
            publish_time: Date.parse(publish_time),
            update_time: Date.parse(update_time),
            language: details.split(" - ")[1],
            reviews: +reviews.replace(/,/g, ''),
            follows: +follows.replace(/,/g, ''),
            favs: +favs.replace(/,/g, '')
        } satisfies FfnetFicDetail as FfnetFicDetail;
    }
    
    getUrlForChapter(library_id: number, chapter: number): Promise<string> {
        const url = getFfnFicUrl(library_id);
        return Promise.resolve(url + `/${chapter}`);
    }
}