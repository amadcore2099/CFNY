/* ==================================================
   EDITABLE CONTENT
================================================== */

const SITE_DATA = {
  pages: {
    production: {
      title: 'PRODUCTION',
      intro: 'This version is set up so you only add year, title, subtitle, and YouTube ID in one data list.',
      videos: [
        { year: '2025', title: 'Miss Pooja', subtitle: 'Lakh Hile Majajan Jandi Da', youtubeId: 'C0dv7kjX1Sk' },
        { year: '2025', title: 'J. Esko', subtitle: 'Like That', youtubeId: 'WeCos4aCC60' },
        { year: '2025', title: 'Channi Nattan', subtitle: 'Gangsta Luv', youtubeId: 'jMqIpCddv7s' },
        { year: '2025', title: 'Russ', subtitle: 'Movin’ Album Promo', youtubeId: 'BUU5SxAGbu4' },
        { year: '2024', title: 'Heems', subtitle: 'BUKAYO SAKA', youtubeId: 'q5w12XA2Cmw' },
        { year: '2024', title: 'JJ ESKO FT ANNURAL KHALID', subtitle: 'Mistakes', youtubeId: 'cC47jPDezss' },
        { year: '2024', title: 'LOE SHIMMY & CASH COBAIN', subtitle: 'Confession', youtubeId: 'iCCYnAwPcvI' },
        { year: '2024', title: 'SHEROZ & HENNY', subtitle: 'Yaar Jigri', youtubeId: 'vrZiFXlE-Vg' },
        { year: '2024', title: 'Heems', subtitle: 'Rakhi', youtubeId: '3d_cGjvZNTA' }
        { year: '2023', title: 'RAF SAPERRA ', subtitle: 'RANJHA', youtubeId: 'M7lc1UVf-VE' }
        { year: '2023', title: 'SHEROZ, HENNY, G HOUR', subtitle: 'Mission', youtubeId: 'Zc135mSu7I' }
      ]
    },

    marketing: {
      title: 'MARKETING',
      intro: 'Marketing page using the same layout and video system.',
      videos: [
        { year: '2025', title: 'Marketing Project One', subtitle: 'Social Tease', youtubeId: 'M7lc1UVf-VE' },
        { year: '2024', title: 'Marketing Project Two', subtitle: 'Digital Trailer', youtubeId: 'aqz-KE-bpKQ' },
        { year: '2023', title: 'Marketing Project Three', subtitle: 'Launch Clip', youtubeId: 'LXb3EKWsInQ' }
      ]
    },

    label: {
      title: 'LABEL',
      intro: 'Label page using the same layout and video system.',
      videos: [
        { year: '2025', title: 'Label Release One', subtitle: 'Official Video', youtubeId: 'M7lc1UVf-VE' },
        { year: '2024', title: 'Label Release Two', subtitle: 'Visualiser', youtubeId: 'ScMzIvxBSi4' },
        { year: '2023', title: 'Label Release Three', subtitle: 'Teaser Edit', youtubeId: '5qap5aO4i9A' }
      ]
    },

    about: {
      title: 'ABOUT',
      intro: 'A simple about page that matches the rest of the site.',
      videos: []
    }
  }
};

/* ==================================================
   CONSTANTS
================================================== */

const DEFAULT_PAGE = 'production';
const ANIMATION_DURATION = 420;
const LIGHTBOX_CLOSE_DELAY = 260;
const IFRAME_REVEAL_DELAY = 180;

/* ==================================================
   PAGE SETUP
================================================== */

const currentPageKey = document.body.dataset.page || DEFAULT_PAGE;
const currentPage = SITE_DATA.pages[currentPageKey] || SITE_DATA.pages[DEFAULT_PAGE];

/* ==================================================
   DOM REFERENCES
================================================== */

const dom = {
  introTitle: document.querySelector('.intro-title'),
  introCopy: document.querySelector('.intro-copy'),
  lightbox: document.getElementById('videoLightbox'),
  frameWrap: document.getElementById('videoFrameWrap'),
  closeBtn: document.getElementById('videoClose'),
  fallback: document.getElementById('videoFallback')
};

/* ==================================================
   STATE
================================================== */

let activeClone = null;
let isAnimating = false;

/* ==================================================
   HELPERS
================================================== */

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getWatchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function getEmbedUrl(videoId) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&color=white`;
}

function getThumbUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function getRect(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
}

function setStyles(element, styles) {
  Object.assign(element.style, styles);
}

/* ==================================================
   PAGE CONTENT
================================================== */

function applyPageIntro() {
  if (dom.introTitle) dom.introTitle.textContent = currentPage.title;
  if (dom.introCopy) dom.introCopy.textContent = currentPage.intro;
}

function createCardMarkup(video) {
  const safeTitle = escapeHtml(video.title);
  const safeSubtitle = escapeHtml(video.subtitle);

  return `
    <div
      class="project-card youtube-card"
      data-video-title="${safeTitle} - ${safeSubtitle}"
      data-watch-url="${getWatchUrl(video.youtubeId)}"
      data-embed-url="${getEmbedUrl(video.youtubeId)}"
    >
      <div class="project-thumb">
        <img
          src="${getThumbUrl(video.youtubeId)}"
          alt="${safeTitle} video thumbnail"
          loading="lazy"
        >
        <div class="project-overlay">
          <div class="play-button">
            <span class="play-icon">▶</span>
          </div>
        </div>
      </div>

      <div class="project-info">
        <h3 class="project-title">${safeTitle}</h3>
        <p class="project-sub">${safeSubtitle}</p>
      </div>
    </div>
  `;
}

function renderVideoSections(pageKey) {
  const page = SITE_DATA.pages[pageKey];
  if (!page) return;

  document.querySelectorAll('.archive-year[data-year]').forEach(section => {
    const year = section.dataset.year;
    const grid = section.querySelector('.project-grid');
    if (!grid) return;

    const videosForYear = page.videos.filter(video => video.year === year);

    if (!videosForYear.length) {
      section.style.display = 'none';
      return;
    }

    section.style.display = '';
    grid.innerHTML = videosForYear.map(createCardMarkup).join('');
  });

  bindVideoCards();
}

/* ==================================================
   LIGHTBOX
================================================== */

function buildIframeMarkup(embedUrl, title = 'YouTube video') {
  return `
    <iframe
      src="${embedUrl}"
      title="${title}"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  `;
}

function setPosterImage(imageSrc) {
  dom.frameWrap.innerHTML = '<div class="video-poster" id="videoPoster"></div>';
  const poster = document.getElementById('videoPoster');

  if (poster) {
    poster.style.backgroundImage = `url("${imageSrc}")`;
    poster.classList.remove('is-hidden');
  }

  dom.frameWrap.classList.remove('is-ready');
}

function openLightbox() {
  dom.lightbox.classList.add('is-open');
  dom.lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeLightbox() {
  dom.lightbox.classList.remove('is-open');
  dom.lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function clearLightbox() {
  dom.frameWrap.innerHTML = '<div class="video-poster" id="videoPoster"></div>';
  dom.frameWrap.classList.remove('is-ready');
  dom.fallback.innerHTML = '';
}

async function openVideo(card) {
  if (isAnimating || !dom.lightbox || !dom.frameWrap || !dom.fallback) return;

  const thumb = card.querySelector('.project-thumb');
  const image = thumb?.querySelector('img');
  const embedUrl = card.dataset.embedUrl;
  const watchUrl = card.dataset.watchUrl;
  const title = card.dataset.videoTitle || 'YouTube video';

  if (!thumb || !image || !embedUrl) return;

  isAnimating = true;

  const startRect = getRect(thumb);

  setPosterImage(image.src);
  dom.fallback.innerHTML = `<a href="${watchUrl}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>`;
  openLightbox();

  await wait(20);

  const targetRect = getRect(dom.frameWrap);

  activeClone = document.createElement('div');
  activeClone.className = 'thumb-clone';
  activeClone.innerHTML = `<img src="${image.src}" alt="">`;

  document.body.appendChild(activeClone);

  setStyles(activeClone, {
    top: `${startRect.top}px`,
    left: `${startRect.left}px`,
    width: `${startRect.width}px`,
    height: `${startRect.height}px`,
    transition: 'none'
  });

  requestAnimationFrame(() => {
    setStyles(activeClone, {
      top: `${targetRect.top}px`,
      left: `${targetRect.left}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`,
      transition: `all ${ANIMATION_DURATION}ms cubic-bezier(.2,.8,.2,1)`
    });
  });

  await wait(ANIMATION_DURATION + 10);

  dom.frameWrap.insertAdjacentHTML('beforeend', buildIframeMarkup(embedUrl, title));
  dom.frameWrap.classList.add('is-ready');

  await wait(IFRAME_REVEAL_DELAY);

  const poster = document.getElementById('videoPoster');
  if (poster) poster.classList.add('is-hidden');

  if (activeClone) {
    activeClone.remove();
    activeClone = null;
  }

  isAnimating = false;
}

async function closeVideo() {
  if (isAnimating || !dom.lightbox || !dom.frameWrap || !dom.fallback) return;

  isAnimating = true;

  const iframe = dom.frameWrap.querySelector('iframe');
  if (iframe) iframe.remove();

  const poster = document.getElementById('videoPoster');
  if (poster) poster.classList.remove('is-hidden');

  closeLightbox();
  dom.fallback.innerHTML = '';

  await wait(LIGHTBOX_CLOSE_DELAY);

  clearLightbox();
  isAnimating = false;
}

/* ==================================================
   EVENTS
================================================== */

function bindVideoCards() {
  document.querySelectorAll('.youtube-card').forEach(card => {
    card.addEventListener('click', () => openVideo(card));
  });
}

function bindGlobalEvents() {
  if (dom.closeBtn) {
    dom.closeBtn.addEventListener('click', closeVideo);
  }

  if (dom.lightbox) {
    dom.lightbox.addEventListener('click', event => {
      if (event.target === dom.lightbox) {
        closeVideo();
      }
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dom.lightbox?.classList.contains('is-open')) {
      closeVideo();
    }
  });
}

/* ==================================================
   INIT
================================================== */

function init() {
  applyPageIntro();
  bindGlobalEvents();

  if (['production', 'marketing', 'label'].includes(currentPageKey)) {
    renderVideoSections(currentPageKey);
  }
}

init();
