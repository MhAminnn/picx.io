// Function to detect if developer tools are open
function isDevToolsOpen() {
    const threshold = 160; // Set a threshold in pixels
    const width = window.outerWidth - window.innerWidth > threshold;
    const height = window.outerHeight - window.innerHeight > threshold;
    return width || height;
}

// Function to show an alert that cannot be closed
function showUncloseableAlert() {
    if (!document.getElementById('devToolsAlert')) {
        const alertDiv = document.createElement('div');
        alertDiv.id = 'devToolsAlert';
        alertDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            z-index: 9999;
            text-align: center;
            padding: 20px;
        `;
        alertDiv.textContent = 'Browser dev tools terdeteksi! Operasi di batasi, gunakan Chrome browser.';
        document.body.appendChild(alertDiv);
    }
}

// Check for dev tools every second
setInterval(() => {
    if (isDevToolsOpen()) {
        showUncloseableAlert();
    }
}, 1000);


// Existing code
const searchForm = document.getElementById('searchForm');
const resultDiv = document.getElementById('result');
const authorAvatar = document.getElementById('authorAvatar');
const authorName = document.getElementById('authorName');
const videoTitle = document.getElementById('videoTitle');
const carousel = document.getElementById('carousel');
const loader = document.getElementById('loader');
const likeCountElem = document.getElementById('likeCount');
const commentCountElem = document.getElementById('commentCount');
const shareCountElem = document.getElementById('shareCount');

let currentSlide = 0;
let totalSlides = 0;

// Updated Cookie alert functionality
function createCookieAlert() {
    const cookieAlert = document.createElement('div');
    cookieAlert.id = 'cookieAlert';
    cookieAlert.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #f1f1f1;
        padding: 20px;
        text-align: center;
        display: none;
        line-height: 1.2; // Mengurangi jarak antar baris teks
    `;

    const message = document.createElement('p');
    message.textContent = 'Selamat Datang! Baca petunjuk sebelum menggunakan Picx.Io';
    message.style.marginBottom = '15px'; // Menambah jarak antara teks dan tombol

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accept All';
    acceptButton.style.cssText = `
        background-color: #1877f2; // Warna biru Facebook
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 10px; // Menambah border radius
    `;

    cookieAlert.appendChild(message);
    cookieAlert.appendChild(acceptButton);
    document.body.appendChild(cookieAlert);

    return { cookieAlert, acceptButton };
}

function showCookieAlert() {
    const { cookieAlert, acceptButton } = createCookieAlert();
    cookieAlert.style.display = 'block';

    acceptButton.addEventListener('click', () => {
        cookieAlert.style.display = 'none';
        setCookie('cookiesAccepted', 'true', 365);
    });
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

// Check for cookie consent when the page loads
window.addEventListener('load', () => {
    if (getCookie('cookiesAccepted') !== 'true') {
        showCookieAlert();
    }
});

// Existing event listeners and functions
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loader.style.display = 'block';
    const url = encodeURIComponent(document.getElementById('urlInput').value);
    const apiUrl = `https://api.tiklydown.eu.org/api/download/v3?url=${url}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 200) {
            const result = data.result;
            const images = result.images;

            const imagesHtml = images.map((image, index) => `
                <div class="carousel-item">
                    <img src="${image}" alt="Image ${index + 1}">
                </div>
            `).join('');

            carousel.innerHTML = imagesHtml;
            currentSlide = 0;
            totalSlides = images.length;
            updateCarousel();

            authorAvatar.src = result.author.avatar;
            authorName.textContent = result.author.nickname;
            videoTitle.textContent = result.title;
            likeCountElem.textContent = `Likes: ${result.statistics.likeCount}`;
            commentCountElem.textContent = `Comments: ${result.statistics.commentCount}`;
            shareCountElem.textContent = `Shares: ${result.statistics.shareCount}`;

            resultDiv.style.display = 'block';
        } else {
            alert('Error fetching data.');
        }
    } catch (error) {
        alert('Error fetching data.');
    } finally {
        loader.style.display = 'none';
    }
});

function updateCarousel() {
    const offset = currentSlide * -100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function changeSlide(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

let startX = 0;
let isDragging = false;

carousel.addEventListener('mousedown', (e) => {
    startX = e.pageX;
    isDragging = true;
});

carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const endX = e.pageX;
    handleSwipe(startX, endX);
    isDragging = false;
});

carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(startX, endX);
});

function handleSwipe(start, end) {
    const threshold = 50;
    if (start - end > threshold) {
        changeSlide(1);
    } else if (end - start > threshold) {
        changeSlide(-1);
    }
}

const toggleBtn = document.querySelector('.toggle-btn');
const menuOverlay = document.querySelector('.menu-overlay');
const closeBtn = document.getElementById('close-btn');

toggleBtn.addEventListener('click', () => {
    menuOverlay.classList.toggle('open');
});

closeBtn.addEventListener('click', () => {
    menuOverlay.classList.remove('open');
});