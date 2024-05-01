

export function getRelativeTime(time: number): string {
    const now = Date.now();
    const diff = now - time;
    if (diff < 60 * 1000) {
        return "Just now";
    }
    if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))} minutes ago`;
    }
    if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
    }
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`;
    }
    if (diff < 30 * 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (7 * 24 * 60 * 60 * 1000))} weeks ago`;
    }
    if (diff < 365 * 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (30 * 24 * 60 * 60 * 1000))} months ago`;
    }
    return `${Math.floor(diff / (365 * 24 * 60 * 60 * 1000))} years ago`;
}

export function toLocale(time: number): string {
    const date = new Date(time);
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
}