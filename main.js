/**
 * Render song          x 
 * Scroll list up 
 * Play - Pause - Seek  x
 * CD Spining           x
 * Next - Previous      x
 * Random function      x
 * Repeat               x
 * Active song          x
 * Play clicked song    x
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'SOUNDHAVEN';

const player = $('.player');
const heading = $('.header h2');
const songAva = $('.song-avatar');
const audio = $('#audio');
const menuBtn = $('.btn-menu');
const likeBtn = $('.btn-like');
const closeBtn = $('.btn-close');
const playBtn = $('.play-pause');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const shuffleBtn = $('.btn-shuffle');
const repeatBtn = $('.btn-repeat');
const volumeBtn = $('.btn-volume');
const playlist = $('.playlist');
const wrapper = $('.playlist-wrapper');
const progress = $('#progress');
const volumeBar = $('#volume');

const playedSongList = new Set([0]);

const app = {
    currentIndex: 0,
    currentVolume: 1,
    savedVolume: 1,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    isMuted: false,
    isHoldingProgress: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: 'Chỉ vì quá yêu anh',
            singer: 'Dunno',
            path: './assets/music/chi_vi_qua_yeu_anh.mp3',
            img: './assets/img/chi_vi_qua_yeu_anh_singer.jpg'
        },
        {
            name: 'Có khi',
            singer: 'Nguyễn Tuấn Phong',
            path: './assets/music/co_khi_nt_phong.mp3',
            img: './assets/img/maxresdefault.jpg'
        },
        {
            name: 'Fireworks',
            singer: 'DAOKO',
            path: './assets/music/daoko.mp3',
            img: './assets/img/daoko.png'
        },
        {
            name: 'Memories',
            singer: 'Maroon 5',
            path: './assets/music/memories_maroon.mp3',
            img: './assets/img/maroon_5.jpg'
        },
        {
            name: 'Thời Không Sai Lệch',
            singer: '艾辰',
            path: './assets/music/thoi_khong_sai_lech.mp3',
            img: './assets/img/thoi_khong_sai_lech.jpg'
        },
        {
            name: 'Tình đơn phương 3',
            singer: 'Thế Khoa',
            path: './assets/music/tinh_don_phuong_3.mp3',
            img: './assets/img/cat.png'
        },
        {
            name: 'Uyên Ương Hồ Điệp',
            singer: 'Hoàng An',
            path: './assets/music/uyen_uong_ho_diep.mp3',
            img: './assets/img/Langdongtamhon.jpg'
        },
        {
            name: 'Vì anh đâu có biết',
            singer: 'Thế Khoa',
            path: './assets/music/vi_anh_dau_co_biet.mp3',
            img: './assets/img/cat.png'
        },
        {
            name: 'Vì sao thế',
            singer: 'Thế Khoa',
            path: './assets/music/vi_sao_the.mp3',
            img: './assets/img/cat.png'
        }
    ],

    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active-song' : ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis playlist-icon"></i>
                </div>
            </div>
            `;
        });
        $('.song-list').innerHTML = htmls.join('\n');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvent: function() {
        const _this = this; // _this is 'app', this is whatever element that method was called from.

        // Handling CD  rotation
        const songAvaAnimate = songAva.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 secs
            iterations: Infinity
        });
        songAvaAnimate.pause();

        // Handle play button clicked (audio only)
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            };
        }

        // When song played:
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            songAvaAnimate.play();
        };
        // When song paused
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            songAvaAnimate.pause();
        };

        // When song timer running and drag handler:
        audio.ontimeupdate = function() {
            // if (!_this.isHoldingProgress) {
            //     const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            //     progress.value = progressPercent;
            //     console.log(progress.value);
            // } else 
            if (audio.duration) {
                // When move thumb on progress bar (affect song current position) :
                progress.onchange = function(e)  {
                    const seekTime = e.target.value * audio.duration / 100;
                    audio.currentTime = seekTime;
                };
            };
        };
        progress.onmousedown = function() {
            _this.isHoldingProgress = true;
        };

        // When move thumb on volume bar:
        volumeBar.onchange = function(e) {
            const seekVolume = e.target.value / 100;
            if (seekVolume === 0) {
                volumeBtn.click();
            } else {
                audio.volume = seekVolume;
                _this.currentVolume = audio.volume;
            };
        };

        // When next button clicked:
        nextBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            };
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // When previous button clicked:
        prevBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            };
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // When shuffle button clicked:
        shuffleBtn.onclick = function() {
            _this.isShuffle = !_this.isShuffle;
            _this.setConfig('isShuffle', _this.isShuffle); 
            shuffleBtn.classList.toggle('active', _this.isShuffle);
        };

        // Auto next song/repeat if repeat is on:
        audio.onended = function() {
            if(_this.isRepeat && !_this.isShuffle) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // When repeat button is clicked:
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // When playlist clicked:
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active-song');
            // Click song / option:
            if (songNode || e.target.closest('.option')) {
                // Song clicked:
                if (songNode) {
                    //console.log(songNode.dataset.index); // data-index => go to dataset
                    _this.currentIndex = Number(songNode.dataset.index); // dataset => string
                    _this.loadCurrentSong();
                    playedSongList.add(_this.currentIndex);
                    audio.play();
                    _this.render();
                };
                // Option clicked:
                if (e.target.closest('.option')) {
                    // Something'll pop up
                };
            }
        };

        // When menu button clicked:
        menuBtn.onclick = function() {
            wrapper.classList.toggle('playlist-wrapper-show');
        };
        // When close button clicked:
        closeBtn.onclick = function() {
            wrapper.classList.toggle('playlist-wrapper-show');
        };

        // When like button clicked:
        likeBtn.onclick = function() {
            likeBtn.classList.toggle('fa-solid');
            likeBtn.classList.toggle('fa-regular');
        };

        // When volume button clicked return to original volume if clicked twice:
        volumeBtn.onclick = function() {
            _this.isMuted = !_this.isMuted;
            volumeBtn.classList.toggle('fa-volume-xmark');
            volumeBtn.classList.toggle('fa-volume-high');
            if (_this.isMuted) {
                savedVolume = audio.volume;
                audio.volume = 0;
                volumeBar.value = audio.volume;
            }
            else {
                audio.volume = savedVolume;
                volumeBar.value = audio.volume * 100;
            }
        };

        window.onmouseup = function() {
            _this.isHoldingProgress = false;
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.active-song').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        songAva.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
        progress.value = 0;

        audio.onloadedmetadata = function() {

        };
    },

    loadConfig: function() {
        this.isShuffle = this.config.isShuffle;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (playedSongList.has(newIndex));
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        // Random only unplayed songs
        playedSongList.add(newIndex);
        if (playedSongList.size === this.songs.length) {
            playedSongList.clear();
        }
    },

    start: function() {
        // Load config into app:
        this.loadConfig();        

        this.defineProperties();

        this.handleEvent();

        // Load first song into UI when app is started
        this.loadCurrentSong();

        this.render();

        shuffleBtn.classList.toggle('active', this.isShuffle);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
}

app.start();