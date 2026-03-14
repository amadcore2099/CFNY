const videoData = {
  production: [
    { year: '2025', title: 'Miss Pooja', subtitle: 'Lakh Hile Majajan Jandi Da', youtubeUrl: 'https://www.youtube.com/watch?v=C0dv7kjX1Sk' },
    { year: '2025', title: 'J. Esko', subtitle: 'Like That', youtubeUrl: 'https://www.youtube.com/watch?v=WeCos4aCC60' },
    { year: '2025', title: 'Channi Nattan', subtitle: 'Gangsta Luv', youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
    { year: '2025', title: 'Russ', subtitle: 'Movin’ Album Promo', youtubeUrl: 'https://www.youtube.com/shorts/BUU5SxAGbu4' },
    { year: '2024', title: 'Heems', subtitle: 'BUKAYO SAKA', youtubeUrl: 'https://www.youtube.com/watch?v=q5w12XA2Cmw' },
    { year: '2024', title: 'JJ ESKO FT ANNURAL KHALID', subtitle: 'MISTAKES', youtubeUrl: 'https://www.youtube.com/watch?v=cC47jPDezss' },
    { year: '2024', title: 'LOE SHIMMY & CASH COBAIN', subtitle: 'Confession', youtubeUrl: 'https://www.youtube.com/watch?v=iCCYnAwPcvI' },
    { year: '2024', title: 'SHEROZ & HENNY', subtitle: 'YAAR JIGRI"', youtubeUrl: 'https://www.youtube.com/watch?v=vrZiFXlE-Vg' },
    { year: '2024', title: 'HEEMS', subtitle: 'Rakhi', youtubeUrl: 'https://www.youtube.com/watch?v=3d_cGjvZNTA' },
    { year: '2023', title: 'RAF SAPERRA', subtitle: 'Ranjha', youtubeUrl: 'https://www.youtube.com/watch?v=MwFC7trjEXM' },
    { year: '2023', title: 'SHEROZ, HENNY, G HOUR', subtitle: 'Ranjha', youtubeUrl: 'https://www.youtube.com/watch?v=-Zc135mSu7I' },
    { year: '2023', title: 'Heems', subtitle: 'RAPS AT PUNJABI DELI', youtubeUrl: 'https://www.youtube.com/watch?v=0TzZYaM9IDM' },
    { year: '2023', title: 'Heems', subtitle: 'RAPS IN JACKSON HEIGHTS', youtubeUrl: 'https://www.youtube.com/watch?v=Bg0gEo-xuOE' },
    { year: '2022', title: 'ANGIE MARTINEZ IRL PODCAST', subtitle: 'Ashanti', youtubeUrl: 'https://www.youtube.com/watch?v=_j55M6SC8Pw'     
  ],
  marketing: [
    { year: '2025', title: 'Marketing Project One', subtitle: 'Social Tease', youtubeUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE' },
    { year: '2024', title: 'Marketing Project Two', subtitle: 'Digital Trailer', youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
    { year: '2023', title: 'Marketing Project Three', subtitle: 'Launch Clip', youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ' }
  ],
  label: [
    { year: '2025', title: 'Label Release One', subtitle: 'Official Video', youtubeUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE' },
    { year: '2024', title: 'Label Release Two', subtitle: 'Visualiser', youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4' },
    { year: '2023', title: 'Label Release Three', subtitle: 'Teaser Edit', youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A' }
  ]
};

const pageConfig = {
  production: {
    title: 'PRODUCTION',
    intro: 'This version is set up so you only add year, title, subtitle, and a YouTube link in one data list.'
  },
  marketing: {
    title: 'MARKETING',
    intro: 'Marketing page using the same layout and video system.'
  },
  label: {
    title: 'LABEL',
    intro: 'Label page using the same layout and video system.'
  },
  about: {
    title: 'ABOUT',
    intro: 'A simple about page that matches the rest of the site.'
  }
};

const currentPage = document.body.dataset.page || 'production';
const pageData = pageConfig[currentPage] || pageConfig.production;

const introTitle = document.querySelector('.intro-title');
const introCopy = document.querySelector('.intro-copy');
if (introTitle) introTitle.textContent = pageData.title;
if (introCopy) introCopy.textContent = pageData.intro;

const videoLightbox = document.getElementById('videoLightbox');
const videoFrameWrap = document.getElementById('videoFrameWrap');
const videoClose = document.getElementById('videoClose');
const videoFallback = document.getElementById('videoFallback');
let activeClone = null;
let isAnimating = false;

function wait(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

function getYouTubeId(value = '') {
  const input = String(value).trim();
  if (!input) return '';

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) return match[1];
  }

  return '';
}

function getVideoId(item = {}) {
  return item.youtubeId || getYouTubeId(item.youtubeUrl);
}

function getWatchUrl(videoId){ return `https://www.youtube.com/watch?v=${videoId}`; }
function getEmbedUrl(videoId){ return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&color=white`; }
function getThumbUrl(videoId){ return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; }
function escapeHtml(str=''){ return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

function createCard(item){
  const safeTitle = escapeHtml(item.title);
  const safeSubtitle = escapeHtml(item.subtitle);
  const videoId = getVideoId(item);

  if (!videoId) return '';

  const watchUrl = getWatchUrl(videoId);
  const embedUrl = getEmbedUrl(videoId);
  const thumbUrl = getThumbUrl(videoId);

  return `
    <div class="project-card youtube-card" data-video-title="${safeTitle} - ${safeSubtitle}" data-watch-url="${watchUrl}" data-embed-url="${embedUrl}">
      <div class="project-thumb">
        <img src="${thumbUrl}" alt="${safeTitle} video thumbnail" loading="lazy">
        <div class="project-overlay"><div class="play-button"><span class="play-icon">▶</span></div></div>
      </div>
      <div class="project-info">
        <h3 class="project-title">${safeTitle}</h3>
        <p class="project-sub">${safeSubtitle}</p>
      </div>
    </div>`;
}

function renderPage(pageKey){
  const allItems = videoData[pageKey] || [];
  document.querySelectorAll('.archive-year[data-year]').forEach((section) => {
    const year = section.dataset.year;
    const grid = section.querySelector('.project-grid');
    const items = allItems.filter(item => item.year === year);
    if (!grid) return;
    if (!items.length) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';
    grid.innerHTML = items.map(createCard).join('');
  });
  bindVideoCards();
}

function buildIframe(embedUrl, title){
  return `<iframe src="${embedUrl}" title="${title || 'YouTube video'}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}
function getRect(el){ const rect = el.getBoundingClientRect(); return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }; }
function setStyles(el, styles){ Object.assign(el.style, styles); }

async function openVideo(card){
  if (isAnimating || !videoLightbox || !videoFrameWrap || !videoFallback) return;
  isAnimating = true;
  const thumb = card.querySelector('.project-thumb');
  const img = thumb?.querySelector('img');
  const embedUrl = card.dataset.embedUrl;
  const watchUrl = card.dataset.watchUrl;
  const title = card.dataset.videoTitle || 'YouTube video';
  if (!thumb || !img || !embedUrl) { isAnimating = false; return; }
  const start = getRect(thumb);
  videoFrameWrap.innerHTML = '<div class="video-poster" id="videoPoster"></div>';
  const freshPoster = document.getElementById('videoPoster');
  freshPoster.style.backgroundImage = `url("${img.src}")`;
  freshPoster.classList.remove('is-hidden');
  videoFrameWrap.classList.remove('is-ready');
  videoFallback.innerHTML = `<a href="${watchUrl}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>`;
  videoLightbox.classList.add('is-open');
  videoLightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  await wait(20);
  const target = getRect(videoFrameWrap);
  activeClone = document.createElement('div');
  activeClone.className = 'thumb-clone';
  activeClone.innerHTML = `<img src="${img.src}" alt="">`;
  document.body.appendChild(activeClone);
  setStyles(activeClone,{top:`${start.top}px`,left:`${start.left}px`,width:`${start.width}px`,height:`${start.height}px`,transition:'none'});
  requestAnimationFrame(() => {
    setStyles(activeClone,{transition:'all 420ms cubic-bezier(.2,.8,.2,1)',top:`${target.top}px`,left:`${target.left}px`,width:`${target.width}px`,height:`${target.height}px`});
  });
  await wait(430);
  videoFrameWrap.insertAdjacentHTML('beforeend', buildIframe(embedUrl, title));
  videoFrameWrap.classList.add('is-ready');
  await wait(180);
  const poster = document.getElementById('videoPoster');
  if (poster) poster.classList.add('is-hidden');
  if (activeClone) { activeClone.remove(); activeClone = null; }
  isAnimating = false;
}

async function closeVideo(){
  if (isAnimating || !videoLightbox || !videoFrameWrap || !videoFallback) return;
  isAnimating = true;
  const iframe = videoFrameWrap.querySelector('iframe');
  if (iframe) iframe.remove();
  const poster = document.getElementById('videoPoster');
  if (poster) poster.classList.remove('is-hidden');
  videoFrameWrap.classList.remove('is-ready');
  videoLightbox.classList.remove('is-open');
  videoLightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  videoFallback.innerHTML = '';
  await wait(260);
  videoFrameWrap.innerHTML = '<div class="video-poster" id="videoPoster"></div>';
  isAnimating = false;
}

function bindVideoCards(){
  document.querySelectorAll('.youtube-card').forEach((card) => {
    card.addEventListener('click', () => openVideo(card));
  });
}

if (videoClose) videoClose.addEventListener('click', closeVideo);
if (videoLightbox) {
  videoLightbox.addEventListener('click', (event) => {
    if (event.target === videoLightbox) closeVideo();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && videoLightbox?.classList.contains('is-open')) closeVideo();
});

if (['production','marketing','label'].includes(currentPage)) renderPage(currentPage);
