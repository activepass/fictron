import { load } from 'cheerio';
import { Fic, FicContent, FicSource } from './Fic';

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

        // nav_btns.forEach(element => {
        //     if (element.textContent == "Next >") {
        //         Fic.next = ffurl + element.getAttribute("onclick").split("'")[1];
        //     } else if (element.textContent == "< Prev") {
        //         Fic.previous = ffurl + element.getAttribute("onclick").split("'")[1];
        //     }
        // });
        return Fic;
    }

    getFic(url: string): Promise<Fic> {
        console.log('url', url)
        throw new Error('Method not implemented.');
    }
    
}