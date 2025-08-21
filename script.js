// Ganti dengan API Key Anda
const NEWS_API_KEY = 'bc5dbdb0006f44129e174bd1a373a75f';
const GNEWS_API_KEY = '0082211e3eaf8024bed6f8e4ecbd072e';
// const MEDIASTACK_API_KEY = '...'; // Nonaktif

// URL yang sudah benar
const url1 = `https://newsapi.org/v2/everything?q=artificial%20intelligence&apiKey=${NEWS_API_KEY}`;
const url2 = `https://gnews.io/api/v4/search?q=artificial%20intelligence&token=${GNEWS_API_KEY}`;
// const url3 = `...`; // Nonaktif

// Simpan semua artikel berita di sini
let allArticles = [];

// Fungsi untuk mengambil dan menampilkan berita saat halaman dimuat
async function fetchAllNews() {
    try {
        const responses = await Promise.all([
            fetch(url1),
            fetch(url2)
            // fetch(url3) // Pastikan ini dikomentari
        ]);

        const data = await Promise.all(responses.map(res => res.json()));
        
        const articlesFromNewsAPI = data[0].articles ? data[0].articles.map(formatNewsAPIArticle) : [];
        const articlesFromGNews = data[1].articles ? data[1].articles.map(formatGNewsArticle) : [];
        
        allArticles = [...articlesFromNewsAPI, ...articlesFromGNews];

        allArticles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        displayNews(allArticles);

    } catch (error) {
        console.error("Gagal mengambil berita:", error);
        document.getElementById('news-container').innerHTML = "<p>Gagal memuat berita. Coba lagi nanti.</p>";
    }
}

// Fungsi untuk menampilkan berita ke dalam #news-container
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ""; 

    if (articles.length === 0) {
        newsContainer.innerHTML = "<p>Tidak ada berita yang ditemukan.</p>";
        return;
    }

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
        const imageUrl = article.image ? article.image : 'https://via.placeholder.com/400x200.png?text=No+Image';
        articleElement.innerHTML = `
            <img src="${imageUrl}" alt="${article.title}" class="article-image">
            <div class="article-content">
                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                <p>Sumber: ${article.source} | Waktu: ${new Date(article.timestamp).toLocaleString()}</p>
            </div>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Fungsi search
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filteredArticles = allArticles.filter(article => {
        return article.title.toLowerCase().includes(query);
    });
    displayNews(filteredArticles);
}

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Fungsi formatting
function formatNewsAPIArticle(article) {
    return {
        title: article.title,
        url: article.url,
        timestamp: article.publishedAt,
        source: article.source.name,
        image: article.urlToImage
    };
}

function formatGNewsArticle(article) {
    return {
        title: article.title,
        url: article.url,
        timestamp: article.publishedAt,
        source: article.source.name,
        image: article.image
    };
}

// Panggil fungsi ini saat halaman pertama kali dimuat
window.addEventListener('load', fetchAllNews);