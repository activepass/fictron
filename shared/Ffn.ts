import { load } from 'cheerio';
import { FicDetail, FicContent, FicSource } from './Fic';

export interface FfnetFicDetail extends FicDetail {
    reviews: number;
    favs: number;
    follows: number;
}

export class FfnSource extends FicSource {
    
    base_url = "https://www.fanfiction.net";
    short = "ffn"; 

    pageToContent(content: string): FicContent {
        const $ = load(content);
        const title = $('b.xcontrast_txt');
        const ficcontent = $("[role='main']");
        const chapter = $('#chap_select').val()!;
        const Fic = {title: title.text(), content: ficcontent.html()!, chapter: +chapter} satisfies FicContent as FicContent;
        const nav_btns = $("#content_wrapper_inner > span:nth-child(7) > button");
        console.log('nav_btns', nav_btns)

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

    getFic(url: string): FfnetFicDetail {
        console.log('url', url)
        throw new Error('Method not implemented.');
    }
    
    getUrlForChapter(fic: FicDetail, chapter: number): string {
        console.log('fic', fic)
        console.log('chapter', chapter)
        throw new Error('Method not implemented.');
    }
}