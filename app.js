app = (() => {
    const body = document.body,
          html = document.documentElement;
    const heightOfPage = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
    const secondMain = document.querySelector('.second')
    const main = document.querySelector('.main');
    const playBtn = document.querySelector('.song-btn');
    const nextbtn = document.querySelector('.next-btn');
    const prevbtn = document.querySelector('.prev-btn');
    const audio = document.querySelector('.audio');
    const cdThumb = document.querySelector('.cd-thumb');
    const cdThumbImg = document.querySelector('.cd-thumb img');
    const cdName = document.querySelector('.cd-name');
    const cdAuthor = document.querySelector('.cd-author');
    const duration = document.querySelector('.duration');
    const remaining = document.querySelector('.remaining');
    const processBar = document.querySelector('#input-process');
    const volumn = document.querySelector('#input-process-volumn');
    const nextSongName = document.querySelector('.next-song span'); 
    const repeatBtn = document.querySelector('.repeat-btn');
    const randomBtn = document.querySelector('.random-btn');

    const heightOfMain = main.offsetHeight;
    const heightOfSecondMain = heightOfPage - heightOfMain - 16*2;
    secondMain.style.height = `${heightOfSecondMain}px`
    const music = {
        currentSongIndex: 0,
        isPlaying: false,
        isRepeat: false,
        isRandom: false,
        isChoosing: false,
        songs: [
            {
                name: "Nevada",
                singer: "Vicetone",
                path: "./assets/music/Song1.flac",
                image: "./assets/img/Song1.jpg",
            },
            {
                name: "Summertime",
                singer: "K-391",
                path: "./assets/music/Song2.flac",
                image: "./assets/img/Song2.jpg",
            },
            {
                name: "Reality",
                singer: "Lost Frequencies feat. Janieck Devy",
                path: "./assets/music/Song3.flac",
                image: "./assets/img/Song3.jpg",
            },
            {
                name: "Ngày Khác Lạ",
                singer: "Đen ft. Giang Pham, Triple D",
                path: "./assets/music/Song4.flac",
                image: "./assets/img/Song4.jpg",
            },
            {
                name: "Nevada",
                singer: "Vicetone",
                path: "./assets/music/Song1.flac",
                image: "./assets/img/Song1.jpg",
            },
            {
                name: "Lemon Tree",
                singer: "DJ DESA REMIX",
                path: "./assets/music/Song5.flac",
                image: "./assets/img/Song5.jpg",
            },
        ],
        SettingObject() {
            Object.defineProperty(this, 'currentSong', {
                get() { return this.songs[this.currentSongIndex]; }
            })
        },
        formatTime(time) {
            return ((time / 60).toFixed(2)).replace('.', ':')
        },
        loadCurrentSong() {
            const {name, singer, path, image} = this.currentSong;
            cdThumbImg.setAttribute('src', `${image}`);
            cdName.innerText = name;
            cdAuthor.innerText = singer;
            audio.setAttribute('src', `${path}`);
            if (this.songs[this.currentSongIndex + 1]) {
                nextSongName.innerText = this.songs[this.currentSongIndex + 1].name; 
            } else {
                nextSongName.innerText = this.songs[0].name;
            }
        },
        loadListSong() {
            const songList = this.songs.map((song, index) => {
                return ` <div class="song-item ${index === this.currentSongIndex ? 'active' : ''}" data-index="${index}">
                            <div class="song-img">
                                <img src="${song.image}" alt="">
                            </div>
                            <div class="song-info">
                                <p class="song-name">${song.name}</p>
                                <p class="song-author">${song.singer}</p>
                            </div>
                            <ion-icon class="more-btn" name="more"></ion-icon>
                        </div>`
            })
            secondMain.innerHTML = songList.join('');
        },
        activeSong() {
            const songList = [...document.querySelectorAll('.song-item')];
            songList.forEach((song, index) => {
                if (song.classList.contains('active')) {
                    song.classList.remove('active');
                }
                if (index === this.currentSongIndex) {
                    song.classList.add('active');
                    if (!this.isChoosing) {
                        song.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                    }
                }
            })
        },
        randomSongIndex() {
            let newIndex = "";
            do {
                newIndex =  Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentSongIndex)
            this.currentSongIndex = newIndex;
        },
        handleEvent() {
            playBtn.addEventListener('click', (e) => {
                if (!this.isPlaying) {
                    audio.play();
                } else {
                    audio.pause();
                }
            })
            audio.onplay = (e) => {
                this.isPlaying = true;
                playBtn.classList.add('isPlaying');
            }
            audio.onpause = (e) => {
                this.isPlaying = false;
                playBtn.classList.remove('isPlaying');
            }
            audio.ontimeupdate = (e) => {
                // if (duration.innerText === 'undefined') {
                //     console.log(1);
                //     duration.innerText = '-0:00';
                // }
                const durationTime = audio.duration || 0;
                const currentTime = audio.currentTime;
                processBar.value = (currentTime / durationTime) * 100 || 0;
                remaining.innerText = this.formatTime(currentTime);
            }
            audio.onended = (e) => {
                if (this.isRepeat) {
                    audio.play();
                    return;
                }
                const click = new Event('click');
                nextbtn.dispatchEvent(click);
            }
            audio.onloadedmetadata = function() {
                duration.innerText = '-' + (((audio.duration) / 60).toFixed(2)).replace('.', ':');;
            };
            processBar.oninput = (e) => {
                audio.currentTime = (processBar.value / 100) * audio.duration || 0;
            }
            volumn.oninput = (e) => {
                audio.volume = volumn.value / 100;
            }
            nextbtn.onclick = (e) => {
                if (this.isRandom) {
                    this.randomSongIndex();
                } else {
                    this.currentSongIndex = this.currentSongIndex + 1 >= this.songs.length ? 0 : this.currentSongIndex + 1;
                }
                this.isChoosing = false;
                this.loadCurrentSong();
                this.activeSong();
                audio.play();
            }
            prevbtn.onclick = (e) => {
                if (this.isRandom) {
                    this.randomSongIndex();
                } else {
                    this.currentSongIndex = this.currentSongIndex - 1 < 0 ?this.songs.length - 1 : this.currentSongIndex - 1;
                }
                this.isChoosing = false;
                this.loadCurrentSong();
                this.activeSong();
                audio.play();
            }
            repeatBtn.onclick = (e) => {
                this.isRepeat = !this.isRepeat;
                repeatBtn.classList.toggle('active', this.isRepeat);
            }
            randomBtn.onclick = (e) => {
                this.isRandom = !this.isRandom;
                randomBtn.classList.toggle('active',  this.isRandom);
            }
            secondMain.onclick = (e) => {
                if (e.target.closest('.song-item') && !e.target.classList.contains('more-btn')) {
                    const songTarget = e.target.closest('.song-item');
                    this.currentSongIndex = parseInt(songTarget.dataset.index);
                    this.isChoosing = true;
                    console.log(this.isChoosing);
                    this.loadCurrentSong();
                    this.activeSong();
                    audio.play();
                }
            }
        },
        start() {
            this.SettingObject();
            this.handleEvent();
            this.loadCurrentSong();
            this.loadListSong();
        }
    }
    return music;
})()

app.start();