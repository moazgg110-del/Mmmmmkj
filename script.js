// Sample Apps Data (يمكنك إضافة أو تعديل التطبيقات بسهولة من هنا)
const appsData = [
  {
    id: 1,
    title: "آلة حاسبة متطورة",
    category: "أدوات",
    desc: "آلة حاسبة ذكية بتصميم عصري لحساب المعادلات بسهولة.",
    icon: "https://cdn-icons-png.flaticon.com/512/3405/3405822.png",
    link: "https://moaz-calc.netlify.app"
  },
  {
    id: 2,
    title: "لعبة منصات المغامرات",
    category: "ألعاب",
    desc: "لعبة خفيفة ممتعة بمستويات متعددة وتحديات حماسية.",
    icon: "https://cdn-icons-png.flaticon.com/512/3093/3093113.png",
    link: "https://moaz-game.netlify.app"
  },
  {
    id: 3,
    title: "تطبيق هزّرها",
    category: "تسلية",
    desc: "تطبيق النكات والضحك اليومي بتصميم جذاب وخفيف.",
    icon: "invalid-url-test.png", // تجربة إظهار الأيقونة البديلة التلقائية
    link: "https://hazarha.netlify.app"
  },
  {
    id: 4,
    title: "منظم المهام اليومية",
    category: "إنتاجية",
    desc: "سجل مهامك وأهدافك اليومية واحفظها مباشرة في جهازك.",
    icon: "https://cdn-icons-png.flaticon.com/512/2098/2098402.png",
    link: "https://moaz-todo.netlify.app"
  }
];

// Favorites management using localStorage
let favorites = JSON.parse(localStorage.getItem('moaz_store_favs')) || [];
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderApps();
  updateFavCount();

  // Search input listener
  document.getElementById('searchInput').addEventListener('input', renderApps);
});

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tabAll').classList.toggle('active', tab === 'all');
  document.getElementById('tabFav').classList.toggle('active', tab === 'fav');
  renderApps();
}

function updateFavCount() {
  document.getElementById('favCount').textContent = favorites.length;
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('moaz_store_favs', JSON.stringify(favorites));
  updateFavCount();
  renderApps();
}

async function shareApp(title, link) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `جرب تطبيق ${title} من متجر معاذ ستور!`,
        url: link
      });
    } catch (err) {
      console.log('Share canceled');
    }
  } else {
    navigator.clipboard.writeText(link);
    showToast("تم نسخ رابط التطبيق للحافظة!");
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function renderApps() {
  const grid = document.getElementById('appsGrid');
  const emptyState = document.getElementById('emptyState');
  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

  grid.innerHTML = '';

  let filteredApps = appsData.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery) || app.desc.toLowerCase().includes(searchQuery);
    const matchesTab = (currentTab === 'all') || (currentTab === 'fav' && favorites.includes(app.id));
    return matchesSearch && matchesTab;
  });

  if (filteredApps.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  filteredApps.forEach(app => {
    const isFav = favorites.includes(app.id);

    const card = document.createElement('div');
    card.className = 'app-card';
    card.innerHTML = `
      <div class="app-header">
        <div class="app-icon-wrapper">
          <img src="${app.icon}" alt="${app.title}" class="app-icon" 
               onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';">
          <i class="fa-solid fa-cubes fallback-icon" style="display: none;"></i>
        </div>
        <div class="app-info">
          <div class="app-title">${app.title}</div>
          <div class="app-desc">${app.desc}</div>
          <span class="app-badge">${app.category}</span>
        </div>
      </div>
      <div class="app-actions">
        <a href="${app.link}" target="_blank" class="btn-download">
          <i class="fa-solid fa-download"></i> تحميل
        </a>
        <button class="btn-icon btn-fav ${isFav ? 'active' : ''}" onclick="toggleFavorite(${app.id})" title="المفضلة">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <button class="btn-icon" onclick="shareApp('${app.title}', '${app.link}')" title="مشاركة">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}
