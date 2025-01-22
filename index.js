// server.js
import express from 'express';
import { readdir, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();

// Serve static files except videos
app.use(express.static('public'));

// Supported video formats and their MIME types
const SUPPORTED_FORMATS = {
	'.mp4': 'video/mp4',
	'.webm': 'video/webm',
	'.ogg': 'video/ogg'
};

// API endpoint to get list of videos with metadata
app.get('/api/videos', async (req, res) => {
	try {
		const videosDir = join(__dirname, 'videos');
		const files = await readdir(videosDir);

		const videos = await Promise.all(
			files
				.filter(file => SUPPORTED_FORMATS[extname(file)])
				.map(async file => {
					const filePath = join(videosDir, file);
					const stats = await stat(filePath);

					return {
						id: basename(file, extname(file)),
						title: basename(file, extname(file)).replace(/-/g, ' '),
						url: `/stream/${encodeURIComponent(file)}`,
						size: stats.size,
						format: extname(file).slice(1)
					};
				})
		);

		res.json(videos);
	} catch (error) {
		res.status(500).json({
			error: 'Unable to scan videos directory',
			details: error.message
		});
	}
});

// Video streaming endpoint
app.get('/stream/:filename', async (req, res) => {
	try {
		const filename = decodeURIComponent(req.params.filename);
		const videoPath = join(__dirname, 'videos', filename);
		const stats = await stat(videoPath);

		// Handle range requests for video streaming
		const range = req.headers.range;
		if (!range) {
			res.status(416).send('Requires Range header');
			return;
		}

		// Parse the range header
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
		const chunkSize = end - start + 1;

		// Maximum chunk size (1MB)
		const maxChunk = 1024 * 1024;
		const adjustedEnd = Math.min(end, start + maxChunk - 1);
		const adjustedChunkSize = adjustedEnd - start + 1;

		// Create headers
		const headers = {
			'Content-Range': `bytes ${start}-${adjustedEnd}/${stats.size}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': adjustedChunkSize,
			'Content-Type': SUPPORTED_FORMATS[extname(filename)]
		};

		// Send partial content
		res.writeHead(206, headers);
		const videoStream = createReadStream(videoPath, { start, end: adjustedEnd });
		videoStream.pipe(res);
	} catch (error) {
		res.status(500).json({
			error: 'Error streaming video',
			details: error.message
		});
	}
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
	console.log(`🎥 Streaming server running at http://localhost:${PORT}`);
});
