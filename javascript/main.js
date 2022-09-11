/**
 * Render song
 * Scroll list up
 * Play - Pause - Seek
 * CD Spining
 * Next - Previous
 * Random function
 * Repeat
 * Active song
 * Play clicked song
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
    song: [
        {
            name: 'Chỉ vì quá yêu anh',
            singer: 'Dunno',
            path: '../assets/music/chi_vi_qua_yeu_anh.mp3',
            img: '../assets/img/chi_vi_qua_yeu_anh_singer.jpg'
        },
        {
            name: 'Có khi',
            singer: 'Nguyễn Tuấn Phong',
            path: '../assets/music/co_khi_nt_phong.mp3',
            img: '../assets/img/maxresdefault.jpg'
        },
        {
            name: 'Fireworks',
            singer: 'DAOKO',
            path: '../assets/music/daoko.mp3',
            img: '../assets/img/daoko.png'
        },
        {
            name: 'Memories',
            singer: 'Maroon 5',
            path: '../assets/music/memories_maroon.mp3',
            img: '../assets/img/maroon_5.jpg'
        },
        {
            name: 'Thời Không Sai Lệch',
            singer: '艾辰',
            path: '../assets/music/thoi_khong_sai_lech.mp3',
            img: '../assets/img/thoi_khong_sai_lech.jpg'
        },
        {
            name: 'Tình đơn phương 3',
            singer: 'Thế Khoa',
            path: '../assets/music/tinh_don_phuong_3.mp3',
            img: '../assets/img/cat.png'
        },
        {
            name: 'Uyên Ương Hồ Điệp Mộng',
            singer: 'Hoàng An',
            path: '../assets/music/uyen_uong_ho_diep.mp3',
            img: '../assets/img/Langdongtamhon.jpg'
        },
        {
            name: 'Vì anh đâu có biết',
            singer: 'Thế Khoa',
            path: '../assets/music/vi_anh_dau_co_biet.mp3',
            img: '../assets/img/cat.png'
        },
        {
            name: 'Vì sao thế',
            singer: 'Thế Khoa',
            path: '../assets/music/vi_sao_the.mp3',
            img: '../assets/img/cat.png'
        },
    ],

    render: function() {
        const htmls = this.song.map(song => {
            return `
            <div class="song">
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

    start: function() {
        this.render();
    },
}

app.start();