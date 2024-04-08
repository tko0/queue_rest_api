import { Request, Response } from 'express';
import { QueueItem } from '../models/QueueItem';

let queue: Map<number, QueueItem> = new Map();
let nextId: number = 1;

//private function
export const getQueue = (): QueueItem[] => {
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

        const newItem: QueueItem = {
            song_id: songId,
            song_name: song.name,
            song_artist: song.artist,
            position: queue.size + 1
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
export const removeSongs = (songs: QueueItem[]): void => {
    const notInQueue: string[] = [];

    songs.forEach(song => {
        let found = false;
        queue.forEach((item, id) => {
            if (item.song_id === song.song_id && item.position === song.position) {
                queue.delete(id);
                found = true;
            }
        });
        if (!found) {
            notInQueue.push(`${song.song_name} (ID: ${song.song_id}, Position: ${song.position})`);
        }
    });

    if (notInQueue.length > 0) {
        if (notInQueue.length === 1) {
            console.error(`Song ${notInQueue[0]} is not in the queue.`);
        } else {
            console.error(`Songs ${notInQueue.join(', ')} are not in the queue.`);
        }
    }

    let position = 1;
    queue.forEach(item => {
        item.position = position++;
    });
};

export const removeSongsFromQueue = (req: Request, res: Response): void => {
    const songs: QueueItem[] = req.body.songs;

    if (!Array.isArray(songs) || songs.length === 0) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    removeSongs(songs);

    res.status(200).json({ message: 'Songs removed from queue successfully', queue: getQueue() });
};

