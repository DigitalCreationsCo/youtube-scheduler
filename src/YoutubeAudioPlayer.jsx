import React, { useState, useMemo, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function YouTubeAudioPlayer() {
    const [videoUrls, setVideoUrls] = useState('');

    const [videosData, setVideosData] = useState([]);

    const [videoPlaylist, setVideoPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [player, setPlayer] = useState(null);

    const videosDataMemo = useMemo(() => videosData, [videosData]);

    useEffect(() => {
        const timer = setInterval(() => {
          checkScheduledVideos();
        }, 60000);
    
        return () => clearInterval(timer);
      }, [videosDataMemo]);

    const scheduleVideos = () => {
        const videos = videoUrls.split(',').map(url => url.trim());

        const scheduledVideos = videos.map((url) => {
            const startTime = document.getElementById(`${url}-time`).value;
            return { url, startTime };
        });

        console.info('scheduledVideos', scheduledVideos);
        setVideosData(scheduledVideos);
    };
    
    const checkScheduledVideos = () => {
        // const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
      
        videosDataMemo.forEach(({ url, startTime }) => {
            const [startHours, startMinutes] = startTime.split(':').map(Number);
            console.info('currentHours', currentHours);
            console.info('currentMinutes', currentMinutes);
            console.info('startHours', startHours);
            console.info('startMinutes', startMinutes);
            if (currentHours === startHours && currentMinutes === startMinutes) {
                playVideo(url);
                console.info('playing video')
            }
        });
    };
      
    const onReady = (event) => {
        setPlayer(event.target);
    };
    
    const playVideo = (videoUrl) => {
        // const extractedVideoIds = extractVideoIds(videoUrls);
        // if (extractedVideoIds.length > 0) {
        //     setVideoPlaylist(extractedVideoIds);
        //     if (player) {
        //         playNextVideo();
        //     }
        // } else {
        //     console.log('Please enter valid YouTube URLs.');
        // }
        const videoId = extractVideoId(videoUrl);
        if (videoId && player) {
          player.cueVideoById({
            videoId: videoId,
            startSeconds: 0,
            suggestedQuality: 'default',
          });
          player.playVideo();
        }
    };
    
    const extractVideoId = (url) => {
        // Regex to extract YouTube video ID from URL
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
    
        return match && match[1] ? match[1] : null;
    };

    const extractVideoIds = (urls) => {
        const urlsArray = urls.split(',').map(url => url.trim());
        const videoIds = urlsArray.map(url => {
            const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regExp);
            return match && match[1] ? match[1] : null;
        }).filter(videoId => videoId !== null);
        return videoIds;
    };
    
    const playNextVideo = () => {
        if (currentVideoIndex < videoPlaylist.length) {
          const videoId = videoPlaylist[currentVideoIndex];
          if (player) {
            player.cueVideoById({
              videoId: videoId,
              startSeconds: 0,
              suggestedQuality: 'default',
            });
            player.playVideo();
          }
          setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
          setCurrentVideoIndex(0);
        }
    };

    const opts = {
        playerVars: {
            autoplay: 1,
            controls: 0,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
        },
    };

    return (
        <div>
            <label htmlFor="video-urls">Enter YouTube Video URLs (separated by commas):</label>
            <br />
            <textarea
                rows={5}
                type="text"
                id="video-urls"
                placeholder="Enter video URLs"
                onChange={(e) => setVideoUrls(e.target.value)}
            />
            <br />
            <button onClick={scheduleVideos}>Schedule Videos</button>

            {videoUrls.split(',').map((url) => {
                url = url.trim();
                return (
                    <div key={url}>
                        <p>
                            Video URL: {url}
                            <br />
                            Start Time: <input type="time" id={`${url}-time`} defaultValue={800} />
                        </p>
                    </div>
                )
            })}

            <YouTube
            // videoId={videoPlaylist[currentVideoIndex]} 
            videoId=""
            opts={opts} 
            onReady={onReady} 
            />

        </div>
    );
}
