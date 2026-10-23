(function () {
  const VIDEO_ID = 'X5viip_WLfY';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'music-toggle';
  btn.className = 'music-toggle';
  btn.setAttribute('aria-label', '音楽を再生・停止');
  btn.innerHTML = '<span class="music-icon">🎵</span>';
  document.body.appendChild(btn);

  const host = document.createElement('div');
  host.id = 'bg-music';
  host.setAttribute('aria-hidden', 'true');
  document.body.appendChild(host);

  let player = null;
  let wanted = false;
  let isPlaying = false;

  function setState(playing) {
    isPlaying = playing;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? '音楽を停止' : '音楽を再生');
  }

  function toggle() {
    if (!player) {
      wanted = true;
      return;
    }
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  btn.addEventListener('click', toggle);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('bg-music', {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        loop: 1,
        playlist: VIDEO_ID,
        rel: 0,
      },
      events: {
        onReady: function () {
          if (wanted) {
            player.playVideo();
            wanted = false;
          }
        },
        onStateChange: function (e) {
          setState(e.data === YT.PlayerState.PLAYING);
        },
      },
    });
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.async = true;
  tag.onerror = function () {
    btn.hidden = true;
  };
  document.head.appendChild(tag);
})();