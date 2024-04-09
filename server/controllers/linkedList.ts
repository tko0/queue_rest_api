import { Request, Response } from 'express';
import { LinkedListSongItem } from '../models/LinkedListSongItem';

class Node {
    data: LinkedListSongItem;
    next: Node | null;

    constructor(data: LinkedListSongItem) {
        this.data = data;
        this.next = null;
    }
}

class Queue {
    head: Node | null;
    tail: Node | null;

    constructor() {
        this.head = null;
        this.tail = null;
    }

    enqueue(data: LinkedListSongItem): void {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            this.tail = newNode;
        }
    }

    dequeue(): LinkedListSongItem | null {
        if (!this.head) return null;

        const dequeuedItem = this.head.data;
        this.head = this.head.next;
        if (!this.head) {
            this.tail = null;
        }
        return dequeuedItem;
    }

    isEmpty(): boolean {
        return this.head === null;
    }

    getQueue(): LinkedListSongItem[] {
        const queueItems: LinkedListSongItem[] = [];
        let current = this.head;
        while (current) {
            queueItems.push(current.data);
            current = current.next;
        }
        return queueItems;
    }

    removeSongs(songIds: number[]): void {
        let current = this.head;
        let prev: Node | null = null;

        while (current) {
            if (songIds.includes(current.data.id)) {
                if (prev) {
                    prev.next = current.next;
                    if (!current.next) {
                        this.tail = prev;
                    }
                } else {
                    this.head = current.next;
                    if (!current.next) {
                        this.tail = null;
                    }
                }
            } else {
                prev = current;
            }
            current = current.next;
        }
    }
}

const queue = new Queue();
let nextId: number = 1;

export const getQueueController = (req: Request, res: Response): void => {
    try {
        res.status(200).json({ queue: queue.getQueue() });
    } catch (error) {
        console.error('Error retrieving queue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const addSongs = (songs: { name: string; artist: string }[]): void => {
    songs.forEach(song => {
        const newItem: LinkedListSongItem = {
            id: nextId++,
            song_name: song.name,
            song_artist: song.artist,
        };

        queue.enqueue(newItem);
    });
}

export const addSongsToQueue = (req: Request, res: Response): void => {
    const songs: { name: string; artist: string }[] = req.body.songs;

    if (!Array.isArray(songs) || songs.length === 0) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    addSongs(songs);

    res.status(200).json({ message: 'Songs added to queue successfully', queue: queue.getQueue() });
};

export const removeSongsFromQueue = (req: Request, res: Response): void => {
    const songIds: number[] = req.body.songIds;

    if (!Array.isArray(songIds) || songIds.length === 0) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    queue.removeSongs(songIds);

    res.status(200).json({ message: 'Songs removed from queue successfully', queue: queue.getQueue() });
};
