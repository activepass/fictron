export abstract class ChapterReporter {
    library_id: number;
    constructor(library_id: number) {
        this.library_id = library_id;
    }
    abstract reportChapter(chapter: number): void;
}

export class Ao3ChapterReporter extends ChapterReporter {
    reportChapter(chapter: number): void {
        window.fictron!.chapterAo3(this.library_id, chapter);
    }
}

export class FfnChapterReporter extends ChapterReporter {
    reportChapter(chapter: number): void {
        window.fictron!.chapterFfn(this.library_id, chapter);
    }
}