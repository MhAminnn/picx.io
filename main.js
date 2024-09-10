// Fungsi untuk mendeteksi Developer Tools
(function() {
    let isDevToolsOpen = false;

    function detectDevTools() {
        if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
            isDevToolsOpen = true;
        } else {
            isDevToolsOpen = false;
        }

        if (isDevToolsOpen) {
            alert('Developer tools terdeteksi. Operasi dibatasi. gunakan chrome browser');
        }
    }

    setInterval(detectDevTools, 1000);
})();

// Variabel untuk bubble yang bisa digeser
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Event listener untuk tombol download
document.getElementById('downloadBtn').addEventListener('click', function() {
    const inputURL = document.getElementById('urlInput').value;
    if (!inputURL) {
        alert('Silakan masukkan URL terlebih dahulu.');
        return;
    }

    let downloadCount = parseInt(localStorage.getItem('downloadCount') || '0');

    if ((downloadCount + 1) % 3 === 0) {
        processDownload(inputURL);
    } else {
        processDownload(inputURL);
    }
});

// Fungsi untuk memproses download
function processDownload(inputURL) {
    const apiUrl = "https://tiktok-full-info-without-watermark.p.rapidapi.com/vid/index?url=" + encodeURIComponent(inputURL);
    const apiKey = '8a9451b54bmsh997e8b63578a8c7p1cdbcejsnd3dcbee782ed';
    const loadingSpinner = document.getElementById('loadingSpinner');
    const mediaDisplay = document.getElementById('mediaDisplay');

    loadingSpinner.style.display = 'block';

    fetch(apiUrl, {
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "tiktok-full-info-without-watermark.p.rapidapi.com"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data dari API:', data);
        mediaDisplay.innerHTML = '';

        if (data.video && data.video.length > 0 && data.music && data.music.length > 0) {
            const videoUrl = data.video[0];
            const musicUrl = data.music[0];
            const title = data.description[0];
            const avatarUrl = data.avatar_thumb[0];
            const username = data.author[0];

            const container = document.createElement('div');
            container.className = 'flex flex-col items-center w-full max-w-md mx-auto p-4 rounded-lg shadow-md mt-3 bg-slate-300';

            const profileContainer = document.createElement('div');
            profileContainer.className = 'flex flex-col items-center mb-4 w-full';

            const profileImg = document.createElement('img');
            profileImg.src = avatarUrl || 'path/to/default/avatar.png';
            profileImg.className = 'w-24 h-24 bg-gray-200 rounded-full mb-3 object-cover';
            profileImg.alt = 'Avatar pengguna';
            profileContainer.appendChild(profileImg);

            const usernameElement = document.createElement('span');
            usernameElement.className = 'text-black font-semibold text-lg';
            usernameElement.textContent = username || 'Username tidak tersedia';
            profileContainer.appendChild(usernameElement);

            container.appendChild(profileContainer);

            const titleElement = document.createElement('p');
            titleElement.className = 'text-sm text-black mb-4 text-center';
            titleElement.textContent = title || 'Deskripsi tidak tersedia';
            container.appendChild(titleElement);

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn w-full px-6 py-5 bg-blue-700 text-gray-50 rounded hover:bg-gray-800 font-bold mb-1 relative';
            downloadBtn.textContent = 'DOWNLOAD VIDEO';
            downloadBtn.onclick = () => handleDownloadVideo(videoUrl, downloadBtn);
            container.appendChild(downloadBtn);

            if (musicUrl) {
                const downloadMusicBtn = document.createElement('button');
                downloadMusicBtn.className = 'download-btn w-full px-6 py-5 bg-blue-700 text-gray-50 rounded hover:bg-gray-800 font-bold mb-1 relative';
                downloadMusicBtn.textContent = 'DOWNLOAD MUSIK';
                downloadMusicBtn.onclick = () => handleDownloadMusic(musicUrl, downloadMusicBtn);
                container.appendChild(downloadMusicBtn);
            }

            mediaDisplay.appendChild(container);
        } else {
            alert('Media tidak ditemukan!');
        }
    })
    .catch(error => {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan saat mengambil data dari API.');
    })
    .finally(() => {
        loadingSpinner.style.display = 'none';
    });
}

// Fungsi untuk menampilkan loading
function showLoading(button) {
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Notifikasi Akan Muncul Saat Download Selesai...';
    return { originalText, button };
}

// Fungsi untuk menghentikan loading
function stopLoading({ originalText, button }) {
    button.textContent = originalText;
    button.disabled = false;
}

// Fungsi untuk menangani download video
async function handleDownloadVideo(videoUrl, button) {
    const loadingState = showLoading(button);
    const fileName = `video_${Date.now()}.mp4`;

    try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Download selesai! Refresh Halaman untuk unduhan selanjutnya');

        updateDownloadCount();
    } catch (error) {
        console.error('Error saat mengunduh video:', error);
        alert('Terjadi kesalahan saat mengunduh video.');
    } finally {
        stopLoading(loadingState);
    }
}

// Fungsi untuk menangani download musik
async function handleDownloadMusic(musicUrl, button) {
    const loadingState = showLoading(button);
    const fileName = `music_${Date.now()}.mp3`;

    try {
        const response = await fetch(musicUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Download selesai! Refresh Halaman untuk unduhan selanjutnya.');

        updateDownloadCount();
    } catch (error) {
        console.error('Error saat mengunduh musik:', error);
        alert('Terjadi kesalahan saat mengunduh musik.');
    } finally {
        stopLoading(loadingState);
    }
}

// Fungsi untuk mengupdate jumlah download
function updateDownloadCount() {
    let downloadCount = parseInt(localStorage.getItem('downloadCount') || '0');
    downloadCount += 1;
    localStorage.setItem('downloadCount', downloadCount);
}

// Event listener untuk animasi fade-in
document.addEventListener('DOMContentLoaded', function() {
    var fadeElems = document.querySelectorAll('.fade-in');

    function checkFade() {
        fadeElems.forEach(function(elem) {
            var distInView = elem.getBoundingClientRect().top - window.innerHeight + 20;
            if (distInView < 0) {
                elem.classList.add('appear');
            } else {
                elem.classList.remove('appear');
            }
        });
    }

    window.addEventListener('scroll', checkFade);
    window.addEventListener('resize', checkFade);
    checkFade();
});

// Event listener untuk toggle menu
const toggleBtn = document.querySelector('.toggle-btn');
const closeBtn = document.querySelector('.close-btn');
const menu = document.querySelector('.menu');

toggleBtn.addEventListener('click', () => {
    menu.classList.add('open');
});

closeBtn.addEventListener('click', () => {
    menu.classList.remove('open');
});

// Fungsi untuk menampilkan atau menyembunyikan infoBox
function toggleBox() {
    const box = document.getElementById('infoBox');
    if (box.classList.contains('hidden')) {
        box.classList.remove('hidden');
    } else {
        box.classList.add('hidden');
    }
}

// Event listener untuk tombol "Close"
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeInfoBox');
    const box = document.getElementById('infoBox');
    
    closeBtn.addEventListener('click', function() {
        box.classList.add('hidden');
    });
});

// Event listener untuk menangani pergerakan bubble yang bisa digeser
document.addEventListener('DOMContentLoaded', function() {
    const bubble = document.querySelector('.bubble');

    bubble.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === bubble) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, bubble);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    // Membatasi pergerakan bubble di dalam window
    function constrainToBounds(el) {
        const rect = el.getBoundingClientRect();
        const parentRect = el.offsetParent.getBoundingClientRect();

        if (rect.left < parentRect.left) xOffset = 0;
        if (rect.top < parentRect.top) yOffset = 0;
        if (rect.right > parentRect.right) xOffset = parentRect.width - rect.width;
        if (rect.bottom > parentRect.bottom) yOffset = parentRect.height - rect.height;

        setTranslate(xOffset, yOffset, el);
    }

    // Tambahkan event listener untuk membatasi pergerakan
    document.addEventListener('mousemove', function() {
        if (isDragging) {
            constrainToBounds(bubble);
        }
    });

    // Tambahkan event listener untuk sentuhan pada perangkat mobile
    bubble.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchend', dragEnd, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
});

// Fungsi tambahan jika diperlukan
function addAdditionalEventListeners() {
    // Tambahkan event listener atau kode lain jika diperlukan di sini
}

// Memanggil fungsi tambahan saat DOM siap
document.addEventListener('DOMContentLoaded', addAdditionalEventListeners);


