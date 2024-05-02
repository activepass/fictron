
export function load({params, url}) {
    let chap_num;
    if (url.searchParams.get('chapter')) {
        chap_num = +url.searchParams.get('chapter')!;

    } else {
        chap_num = 1;
    }
    return {
        ficid: +params.ficid,
        chapter: chap_num,
    }
}