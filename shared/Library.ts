import BetterSqlite3 from "better-sqlite3";
import Database from "better-sqlite3";
import {} from "electron";
import path from "path";
import { Ao3FicDetail } from "./Ao3";
import { MinFicDetail } from "./Fic";

export let db: BetterSqlite3.Database;
export let dbPath: string;

export function initLibrary(app: Electron.App) {
    dbPath = path.join(app.getPath('userData'), 'library.db');
    db = new Database(dbPath);
    console.log("Creating tables")

    db.prepare(`CREATE TABLE IF NOT EXISTS "library" (
        "id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL,
        "author_name"	TEXT NOT NULL,
        "last_interaction"	INTEGER NOT NULL,
        PRIMARY KEY("id")
    )`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS "ao3_library" (
        "library_id"	INTEGER NOT NULL,
        "src_url"	TEXT NOT NULL UNIQUE,
        "last_check"	INTEGER NOT NULL,
        "title"	TEXT NOT NULL,
        "author_name"	TEXT NOT NULL,
        "author_url"	TEXT NOT NULL,
        "publish_time"	INTEGER NOT NULL,
        "update_time"	INTEGER NOT NULL,
        "words"	INTEGER NOT NULL,
        "language"	TEXT NOT NULL,
        "chapters"	INTEGER NOT NULL,
        "fandoms"	TEXT NOT NULL,
        "rating"	TEXT NOT NULL,
        "comments"	INTEGER NOT NULL,
        "kudos"	INTEGER NOT NULL,
        "bookmarks"	INTEGER NOT NULL,
        "hits"	INTEGER NOT NULL,
        FOREIGN KEY("library_id") REFERENCES "library"("id"));`).run();
}

function addBaseFic(name: string, author_name: string): number {
    if (name.trim().length === 0 || author_name.trim().length === 0) {
        console.log("Invalid fic name or author name")
        return -1;
    }

    const row = db.prepare(`INSERT INTO library (name, author_name, last_interaction) VALUES (?, ?, ?)`).run(name, author_name, Date.now());
    if (!row) {
        console.log("Error adding fic to library");
        return -1;
    }
    return row.lastInsertRowid as number;
}

export function addAo3Fic(fic: Ao3FicDetail): number {
    const library_id = addBaseFic(fic.title, fic.author);
    if (library_id === -1) {
        console.log("eat shit")
        return -1;
    }
    db.prepare(`INSERT INTO ao3_library VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(library_id, fic.src, Date.now(), fic.title, fic.author, fic.author_link, fic.publish_time, fic.update_time, fic.words, fic.language, fic.chapters, fic.fandoms.join(','), fic.rating, fic.comments, fic.kudos, fic.bookmarks, fic.hits)

    return library_id;
}

export function Ao3FicAlreadyExists(fic_url: string): [boolean, number] {
    const exists = db.prepare(`SELECT library_id FROM ao3_library WHERE src_url = ?`).get(fic_url) as unknown as {library_id: number};
    if (!exists) {
        return [false, -1]
    }
    return [true, exists.library_id]
}

export function getMinFic(library_id: number): MinFicDetail | null {
    const fic = db.prepare("select id, name, author_name from library where id = ?").get(library_id) as MinFicDetail;
    if (!fic) {
        return null;
    }
    return fic;
}

export function getAo3FicDetail(library_id: number): Ao3FicDetail | null {
    const fic = db.prepare("select * from ao3_library where library_id = ?").get(library_id) as Ao3FicDetail;
    if (!fic) {
        return null;
    }
    return fic;
}

export function getLibrary(): MinFicDetail[] {
    return db.prepare("select id, name, author_name from library order by last_interaction desc").all() as MinFicDetail[];
}