import https from 'https';
import fs from 'fs';
const youtube_api_key = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = process.argv[2]?.replace(/^@/, '');

if (!CHANNEL_HANDLE) {
  console.error('用法：npm start -- <頻道 handle>，例如 npm start -- Tenhao1978');
  process.exit(1);
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function getUploadPlaylistId() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${CHANNEL_HANDLE}&key=${youtube_api_key}`;
  const data = await get(url);
  const channel = data.items[0];
  return {
    playlistId: channel.contentDetails.relatedPlaylists.uploads,
    channelTitle: channel.snippet.title,
  };
}

async function getAllVideos(playlistId) {
  const videos = [];
  let pageToken = '';

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${youtube_api_key}`;
    const data = await get(url);

    for (const item of data.items) {
      videos.push({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
      });
    }

    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return videos;
}

async function main() {
  const { playlistId, channelTitle } = await getUploadPlaylistId();
  console.log(`頻道：${channelTitle}，開始抓取影片...`);

  const videos = await getAllVideos(playlistId);
  console.log(`共抓到 ${videos.length} 支影片`);

  const lines = [`# ${channelTitle}\n`];
  videos.forEach((v, i) => {
    lines.push(`${i + 1}. [${v.title}](https://www.youtube.com/watch?v=${v.videoId})`);
  });

  fs.writeFileSync('output.md', lines.join('\n'), 'utf-8');
  console.log('已寫出 output.md');
}

main();