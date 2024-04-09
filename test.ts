import { getQueue, addSongs, removeSongs } from './server/controllers/queueController';

// Initial queue should be empty
console.log("Initial queue:", getQueue(), ', Expected: []');

// Add a song to the queue
addSongs([{ name: 'song_name', artist: 'artist_name' }]);
console.log("Queue after adding a song:", getQueue(), ', Expected: [{ song_name: "song_name", song_artist: "artist_name" }]');

// Try removing a song that is in the queue
removeSongs([1]);
console.log("Queue after removing a song:", getQueue(), ', Expected: []');

// Add multiple songs with the same name and artist
addSongs([
    { name: 'song_name', artist: 'artist_name' },
    { name: 'song_name1', artist: 'artist_name1' },
    { name: 'song_name', artist: 'artist_name' }
]);
console.log("Queue after adding multiple songs:", getQueue(), `, Expected: [
    { song_name: "song_name", song_artist: "artist_name" },
    { song_name: "song_name1", song_artist: "artist_name1" },
    { song_name: "song_name", song_artist: "artist_name" }
]`);

// Try removing multiple songs in the queue
removeSongs([2, 4]);
console.log("Queue after removing two songs:", getQueue(), `, Expected: [{ song_name: "song_name1", song_artist: "artist_name1" }]`);

// Try removing a song that is not in the queue
console.log("Trying to remove a song not in the queue:");
console.log(removeSongs([5]), ', Song not_in_queue is not in the queue.');
console.log("Queue remains:", getQueue(), `, Expected: [{ song_name: "song_name1", song_artist: "artist_name1" }]`);
