import { getQueue, addSongs, removeSongs } from './server/controllers/queueController';

// Initial queue should be empty
console.log("Initial queue:", getQueue(), ', Expected: []');

// Add a song to the queue
addSongs([{ name: 'song_name', artist: 'artist_name' }]);
console.log("Queue after adding a song:", getQueue(), ', Expected: [{ song_id: 1, song_name: "song_name", song_artist: "artist_name", position: 1 }]');

// Try removing a song that is in the queue
removeSongs([{ song_id: 1, song_name: 'song_name', song_artist: 'artist_name', position: 1 }]);
console.log("Queue after removing a song:", getQueue(), ', Expected: []');

// Add multiple songs with the same name and artist
addSongs([
    { name: 'song_name', artist: 'artist_name' },
    { name: 'song_name', artist: 'artist_name' },
    { name: 'song_name', artist: 'artist_name' }
]);
console.log("Queue after adding multiple songs:", getQueue(), `, Expected: [
    { song_id: 2, song_name: "song_name", song_artist: "artist_name", position: 1 },
    { song_id: 3, song_name: "song_name", song_artist: "artist_name", position: 2 },
    { song_id: 4, song_name: "song_name", song_artist: "artist_name", position: 3 }
]`);

// Try removing a song by providing its ID and position
removeSongs([{ song_id: 2, song_name: 'song_name', song_artist: 'artist_name', position: 1 }]);
console.log("Queue after removing a song by ID and position:", getQueue(), `, Expected: [
    { song_id: 3, song_name: "song_name", song_artist: "artist_name", position: 1 },
    { song_id: 4, song_name: "song_name", song_artist: "artist_name", position: 2 }
]`);

// Try removing a song that is not in the queue
console.log("Trying to remove a song not in the queue:");
console.log(removeSongs([{ song_id: 5, song_name: 'not_in_queue', song_artist: 'artist_name', position: 1 }]), ', Song not_in_queue (ID: 5, Position: 1) is not in the queue.');
console.log("Queue remains:", getQueue(), `, Expected: [
    { song_id: 3, song_name: "song_name", song_artist: "artist_name", position: 1 },
    { song_id: 4, song_name: "song_name", song_artist: "artist_name", position: 2 }
]`);
