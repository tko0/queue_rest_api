import { Request, Response } from 'express';
import { SongItem } from '../models/SongItem';

let queue: Map<number, SongItem> = new Map();
let nextId: number = 1;

//private function
export const getQueue = (): SongItem[] => {
    return Array.from(queue.values());
};

export const getQueueController = (req: Request, res: Response): void => {
    try {
        const queue = getQueue();
        res.status(200).json({ queue });
    } catch (error) {
        console.error('Error retrieving queue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//private function
export const addSongs = (songs: { name: string; artist: string }[]): void => {
    songs.forEach(song => {
        let songId: number = nextId++;

        const newItem: SongItem = {
            song_name: song.name,
            song_artist: song.artist,
        };

        queue.set(songId, newItem);
    });
};


export const addSongsToQueue = (req: Request, res: Response): void => {
    const songs: { name: string; artist: string }[] = req.body.songs;

    if (!Array.isArray(songs) || songs.length === 0) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    addSongs(songs);

    res.status(200).json({ message: 'Songs added to queue successfully', queue: getQueue() });
};

//private function
export const removeSongs = (songIds: number[]): void => {
    const notInQueue: number[] = [];

    songIds.forEach(songId => {
        if (queue.has(songId)) {
            queue.delete(songId);
        } else {
            notInQueue.push(songId);
        }
    });

    if (notInQueue.length > 0) {
        if (notInQueue.length === 1) {
            console.error(`Song with ID ${notInQueue[0]} is not in the queue.`);
        } else {
            console.error(`Songs with IDs ${notInQueue.join(', ')} are not in the queue.`);
        }
    }
};

export const removeSongsFromQueue = (req: Request, res: Response): void => {
    const songIds: number[] = req.body.songIds;

    if (!Array.isArray(songIds) || songIds.length === 0) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    removeSongs(songIds);

    res.status(200).json({ message: 'Songs removed from queue successfully', queue: getQueue() });
};
