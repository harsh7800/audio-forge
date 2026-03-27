# AudioForge Frontend API Guide

This guide explains the AudioForge backend API for frontend integration.

## Base URL

```
Development: http://localhost:3080
```

---

## File Upload (Simplified)

The upload flow has been **simplified from 3 steps to 1**. A single API call uploads the file, creates a book record, and queues it for processing.

### Upload File

```
POST /api/files/upload
Content-Type: multipart/form-data
```

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | Yes | The PDF, EPUB, or text file |
| `title` | string | No | Book title (defaults to filename) |
| `author` | string | No | Author name |
| `language` | string | No | Language code (default: `en`) |

**Example (JavaScript/fetch):**

```javascript
async function uploadBook(file, title, author) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title || file.name);
  formData.append('author', author || '');
  formData.append('language', 'en');

  const response = await fetch('http://localhost:3080/api/files/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error.message);
  }
  
  return result.data; // { bookId, fileId, queueJobId }
}
```

**Example (React/axios):**

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('title', title);
formData.append('author', author);

const response = await axios.post('/api/files/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

const { bookId, fileId, queueJobId } = response.data.data;
```

**Success Response (201):**

```json
{
  "data": {
    "bookId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "fileId": "f1e2d3c4-b5a6-9870-dcba-1234567890ab",
    "queueJobId": "book-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Error Responses:**

```json
// No file uploaded (400)
{
  "error": {
    "code": "NO_FILE",
    "message": "No file uploaded"
  }
}

// Upload failed (500)
{
  "error": {
    "code": "UPLOAD_FAILED", 
    "message": "Failed to upload file"
  }
}
```

---

## Books

### Create Book (Manual)

```
POST /api/books
Content-Type: application/json
```

```javascript
const response = await fetch('/api/books', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Audio Book',
    author: 'John Doe',
    mode: 'audiobook', // required: 'audiobook' or 'summary'
    language: 'en'
  })
});
```

### Get Book

```
GET /api/books/:id
```

```javascript
const response = await fetch('/api/books/book-id-here');
const { data: book } = await response.json();
// book: { id, title, author, processStatus, progress, ... }
```

### List Books

```
GET /api/books?processStatus=PROCESSING&limit=20
```

Query parameters:
- `processStatus` - Filter by status (PENDING, EXTRACTING, CHUNKING, GENERATING_AUDIO, STREAM_READY, COMPLETED, FAILED)
- `mode` - Filter by mode (audiobook, summary)
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset
- `search` - Search in title/author
- `userId` - Filter by user

### Get Processing Progress

```
GET /api/books/:id/progress
```

```javascript
const response = await fetch('/api/books/book-id/progress');
const { data } = await response.json();
// data: { bookId, processStatus, progress, queueJobId, jobState, jobProgress }
```

### Book Status Flow

```
PENDING → EXTRACTING → CHUNKING → GENERATING_AUDIO → STREAM_READY → COMPLETED
                                                                    ↘ FAILED
```

---

## Audio

### Get Audio Status

```
GET /api/audio/:bookId
```

```javascript
const response = await fetch('/api/audio/book-id');
const { data } = await response.json();
// data: { bookId, status, playlistUrl, audioUrl, chunkCount, totalDuration, chunks }
```

**Response:**

```json
{
  "data": {
    "bookId": "a1b2c3d4",
    "status": "STREAM_READY",
    "playlistUrl": "https://storage.example.com/books/a1b2c3d4/playlist.m3u8",
    "audioUrl": "https://storage.example.com/books/a1b2c3d4/final.mp3",
    "chunkCount": 10,
    "totalDuration": 300000,
    "chunks": [
      {
        "id": "chunk-uuid",
        "chunkIndex": 0,
        "audioDurationMs": 30000,
        "audioUrl": "https://storage.example.com/books/a1b2c3d4/chunks/chunk_0000.mp3"
      }
    ]
  }
}
```

### Get Playlist (Streaming)

```
GET /api/audio/:bookId/playlist?format=json
```

- `format=json` (default) - Returns JSON playlist
- `format=m3u8` - Returns M3U8 playlist for HLS players

### Get Specific Chunk URL

```
GET /api/audio/:bookId/chunk/:index
```

```javascript
const response = await fetch('/api/audio/book-id/chunk/0');
const { data } = await response.json();
// data: { url: "https://...", chunkIndex: 0 }
```

### Download Full Audio

```
GET /api/audio/:bookId/download
```

```javascript
const response = await fetch('/api/audio/book-id/download');
const { data } = await response.json();
// data: { downloadUrl, triggered, message }
// triggered: true means stitching was initiated (takes time)
// triggered: false means audio was ready immediately
```

### Trigger Stitching Manually

```
POST /api/audio/:bookId/stitch
```

```javascript
const response = await fetch('/api/audio/book-id/stitch', { method: 'POST' });
const { data } = await response.json();
// data: { message, outputPath, downloadUrl }
```

---

## Response Format

### Success

```json
{
  "data": { ... }
}
```

### List with Pagination

```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "has_next": true
  }
}
```

### Error

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NO_FILE` | 400 | No file in upload request |
| `UPLOAD_FAILED` | 500 | File upload or processing failed |
| `BOOK_NOT_FOUND` | 404 | Book doesn't exist |
| `FILE_NOT_FOUND` | 404 | File doesn't exist |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INVALID_CHUNK_INDEX` | 400 | Chunk index out of range |

---

## Complete Upload → Streaming Flow

```javascript
async function processBook(file, title, author) {
  // 1. Upload file
  const { bookId, fileId, queueJobId } = await uploadBook(file, title, author);
  console.log(`Started processing: ${bookId}`);

  // 2. Poll for completion
  let status;
  while (status !== 'STREAM_READY' && status !== 'COMPLETED' && status !== 'FAILED') {
    await sleep(2000); // Wait 2 seconds
    
    const progressResponse = await fetch(`/api/books/${bookId}/progress`);
    const { data: progress } = await progressResponse.json();
    status = progress.processStatus;
    console.log(`Status: ${status}, Progress: ${progress.progress}%`);
    
    if (status === 'FAILED') {
      throw new Error('Processing failed');
    }
  }

  // 3. Get audio URLs
  const audioResponse = await fetch(`/api/audio/${bookId}`);
  const { data: audio } = await audioResponse.json();
  
  return {
    playlistUrl: audio.playlistUrl,
    audioUrl: audio.audioUrl,
    chunks: audio.chunks,
    totalDuration: audio.totalDuration
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useAudioBook(file, title, author) {
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, ready, error
  const [progress, setProgress] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    async function process() {
      try {
        // Upload
        setStatus('uploading');
        const uploadResponse = await fetch('/api/files/upload', {
          method: 'POST',
          body: createFormData({ file, title, author })
        });
        const { data: { bookId } } = await uploadResponse.json();

        // Poll progress
        setStatus('processing');
        while (true) {
          await sleep(2000);
          const progressResponse = await fetch(`/api/books/${bookId}/progress`);
          const { data } = await progressResponse.json();
          
          setProgress(data.progress || 0);
          setStatus(
            data.processStatus === 'STREAM_READY' || data.processStatus === 'COMPLETED'
              ? 'ready'
              : 'processing'
          );

          if (data.processStatus === 'FAILED') {
            throw new Error('Processing failed');
          }

          if (data.processStatus === 'STREAM_READY' || data.processStatus === 'COMPLETED') {
            const audioResponse = await fetch(`/api/audio/${bookId}`);
            const audioData = await audioResponse.json();
            setAudioData(audioData.data);
            break;
          }
        }
      } catch (e) {
        setError(e.message);
        setStatus('error');
      }
    }

    process();
  }, [file, title, author]);

  return { status, progress, audioData, error };
}

function createFormData({ file, title, author }) {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (author) formData.append('author', author);
  return formData;
}
```

---

## Notes

- All endpoints return JSON except audio streams
- File size limit: 100MB
- Supported file types: PDF, EPUB, TXT
- Processing is asynchronous - poll `/api/books/:id/progress` for status
- Audio URLs are presigned R2/S3 URLs with expiration