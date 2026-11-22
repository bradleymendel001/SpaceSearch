const SEARCH_URL = 'https://images-api.nasa.gov/search';

export const PAGE_SIZE = 20;

export const SUGGESTED_TOPICS = [
    'Galaxy',
    'Nebula',
    'Hubble',
    'James Webb',
    'Saturn',
    'Jupiter',
    'Mars',
    'Supernova',
    'Aurora',
    'Moon',
];

export async function searchPictures(searchText, page = 1) {
    const queryString = new URLSearchParams({
        q: searchText,
        media_type: 'image',
        page: String(page),
        page_size: String(PAGE_SIZE),
    }) .toString();

    const response = await fetch(`${SEARCH_URL}?${queryString}`);
    if (!response.ok) {
        throw new Error(`NASA request failed (status ${response.status})`);
    }

    const json = await response.json();
    const items = json.collection.items;
    const totalHits = json.collection.metadata.total_hits;

    const pictures = items
        .map(toPicture)
        .filter((picture) => picture !== null);

    return {
        pictures,
        hasMore: page * PAGE_SIZE < totalHits,
    };
}

export function randomTopic() {
    const index = Math.floor(Math.random() * SUGGESTED_TOPICS.length);
    return SUGGESTED_TOPICS[index];
}

function toPicture(item) {
    const info = item.data && item.data[0];
    const image = pickImage(item.links || []);

    if (!info || !image) return null;

    return {
        nasaId: info.nasa_id,
        title: info.title,
        description: cleanDescription(info.description),
        date: info.date_created ? info.date_created.slice(0, 10) : '',
        credit: info.secondary_creator || info.photographer || info.center || null,
        url: image.href,
        aspectRatio: image.width && image.height ? image.width / image.height: 4/3,
    };
}

function pickImage(links) {
    const images = links.filter((link) => link.render === 'image');
    return (
        images.find((link) => link.href.includes('~medium')) ||
        images.find((link) => link.href.includes('~small')) ||
        images.find((link) => link.rel === 'preview') ||
        null
    );
}

function cleanDescription(text) {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')   
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')      
        .trim();
}