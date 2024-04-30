


export function load({url}) {
    if (!url.searchParams.has("src")) {
        return {
            redirect: true
        }
    }

    return {
        fic: url.searchParams.get("src")
    }
}