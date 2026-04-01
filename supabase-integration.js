/**
 * HealHolistic — Supabase Integration
 * Drop this file in your static repo root.
 * Include BEFORE other scripts: <script src="supabase-integration.js"></script>
 *
 * Replace SUPABASE_URL and SUPABASE_ANON_KEY with values from your .env in healholistic-hub
 */

const SUPABASE_URL = 'https://ragvfehyhkwuxtdrkbns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZ3ZmZWh5aGt3dXh0ZHJrYm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MzkwMTksImV4cCI6MjA5MDUxNTAxOX0.dl5A4N5qLT0LtHFBk6Qr02asjwWZUArgesnmTHhP9z8';

// Init client (uses CDN script loaded before this)
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ─────────────────────────────────────────────
   1. BLOG POSTS
   Usage: call loadBlogs('#blog-cards') on Blog.html
   ───────────────────────────────────────────── */
async function loadBlogs(containerSelector, limit = 10) {
  const { data, error } = await _supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, featured_image, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) { console.error('loadBlogs error:', error); return; }

  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = data.map(post => `
    <div class="blog-card">
      ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" loading="lazy" />` : ''}
      <div class="blog-card__body">
        <span class="blog-card__category">${post.category}</span>
        <h3 class="blog-card__title">${post.title}</h3>
        <p class="blog-card__excerpt">${post.excerpt}</p>
        <a href="${post.slug}.html" class="blog-card__link">Read More →</a>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────────
   2. SINGLE BLOG POST
   Usage: call loadBlogPost('my-slug', '#post-content') on a blog detail page
   Get slug from URL: const slug = new URLSearchParams(location.search).get('slug')
   ───────────────────────────────────────────── */
async function loadBlogPost(slug, containerSelector) {
  const { data, error } = await _supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) { console.error('loadBlogPost error:', error); return; }

  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Inject SEO
  if (data.seo_title) document.title = data.seo_title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && data.seo_description) metaDesc.setAttribute('content', data.seo_description);

  container.innerHTML = `
    <h1>${data.title}</h1>
    <div class="post-meta">
      <span>${data.category}</span> · 
      <span>${new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
    </div>
    ${data.featured_image ? `<img src="${data.featured_image}" alt="${data.title}" class="post-hero" />` : ''}
    <div class="post-content">${data.content}</div>
  `;
}

/* ─────────────────────────────────────────────
   3. TESTIMONIALS
   Usage: call loadTestimonials('#testimonials-section') on home.html / about.html
   ───────────────────────────────────────────── */
async function loadTestimonials(containerSelector, limit = 6) {
  const { data, error } = await _supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) { console.error('loadTestimonials error:', error); return; }

  const container = document.querySelector(containerSelector);
  if (!container) return;

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  container.innerHTML = data.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-card__stars">${stars(t.rating)}</div>
      <p class="testimonial-card__content">"${t.content}"</p>
      <div class="testimonial-card__meta">
        <strong>${t.name}</strong>
        <span>${t.service}</span>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────────
   4. SERVICES
   Usage: call loadServices('#services-grid') on home.html
   ───────────────────────────────────────────── */
async function loadServices(containerSelector) {
  const { data, error } = await _supabase
    .from('services')
    .select('id, name, slug, tagline, short_description, icon, hero_image, pricing, duration')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) { console.error('loadServices error:', error); return; }

  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = data.map(s => `
    <div class="service-card">
      ${s.hero_image ? `<img src="${s.hero_image}" alt="${s.name}" loading="lazy" />` : ''}
      <div class="service-card__body">
        ${s.icon ? `<span class="service-card__icon">${s.icon}</span>` : ''}
        <h3 class="service-card__name">${s.name}</h3>
        <p class="service-card__tagline">${s.tagline}</p>
        <p class="service-card__desc">${s.short_description}</p>
        <div class="service-card__meta">
          ${s.pricing ? `<span>💰 ${s.pricing}</span>` : ''}
          ${s.duration ? `<span>⏱ ${s.duration}</span>` : ''}
        </div>
        <a href="${s.slug}.html" class="service-card__link">Learn More →</a>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────────
   5. GALLERY
   Usage: call loadGallery('#gallery-grid') on any gallery page
   ───────────────────────────────────────────── */
async function loadGallery(containerSelector, albumId = null) {
  let query = _supabase
    .from('gallery_images')
    .select('*, albums(name)')
    .order('sort_order', { ascending: true });

  if (albumId) query = query.eq('album_id', albumId);

  const { data, error } = await query;

  if (error) { console.error('loadGallery error:', error); return; }

  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = data.map(img => `
    <figure class="gallery-item">
      <img src="${img.url}" alt="${img.caption}" loading="lazy" />
      ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
    </figure>
  `).join('');
}

/* ─────────────────────────────────────────────
   6. CONTACT / LEAD FORM SUBMISSION
   Usage: attach to your form element on form.html
   
   <form id="contact-form">
     <input name="name" required />
     <input name="email" type="email" required />
     <input name="phone" />
     <textarea name="message"></textarea>
     <button type="submit">Submit</button>
   </form>
   <script>attachLeadForm('#contact-form');</script>
   ───────────────────────────────────────────── */
function attachLeadForm(formSelector, source = 'Contact Form') {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    const { error } = await _supabase.from('leads').insert({
      name: form.name?.value || '',
      email: form.email?.value || '',
      phone: form.phone?.value || '',
      message: form.message?.value || '',
      source: source,
      status: 'New',
      priority: 'Cold',
      form_submissions: 1,
    });

    if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }

    if (error) {
      console.error('Form submit error:', error);
      alert('Something went wrong. Please try again.');
    } else {
      form.reset();
      // Show success message — customize as needed
      const success = document.createElement('div');
      success.className = 'form-success';
      success.textContent = '✅ Thank you! We will get back to you soon.';
      form.parentNode.insertBefore(success, form.nextSibling);
      setTimeout(() => success.remove(), 5000);
    }
  });
}

/* ─────────────────────────────────────────────
   7. SEO META TAGS (inject dynamically per page)
   Usage: call loadSEO('/blog') on any page
   Pass the page_url value stored in your seo_pages table
   ───────────────────────────────────────────── */
async function loadSEO(pageUrl) {
  const { data, error } = await _supabase
    .from('seo_pages')
    .select('*')
    .eq('page_url', pageUrl)
    .single();

  if (error || !data) return;

  if (data.title) document.title = data.title;

  const setMeta = (name, content, attr = 'name') => {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  };

  setMeta('description', data.meta_description);
  setMeta('robots', data.robots);
  setMeta('keywords', data.keywords);
  setMeta('og:title', data.og_title, 'property');
  setMeta('og:description', data.og_description, 'property');
  setMeta('og:image', data.og_image, 'property');

  if (data.canonical_url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = data.canonical_url;
  }
}

/* ─────────────────────────────────────────────
   8. SITE SETTINGS (phone, email, address etc.)
   Usage: call loadSiteSettings() on any page that shows contact info
   Then access: window.HH_SETTINGS['phone'], window.HH_SETTINGS['email'] etc.
   ───────────────────────────────────────────── */
async function loadSiteSettings() {
  const { data, error } = await _supabase
    .from('site_settings')
    .select('key, value');

  if (error) { console.error('loadSiteSettings error:', error); return {}; }

  window.HH_SETTINGS = Object.fromEntries(data.map(row => [row.key, row.value]));

  // Auto-fill elements with data-setting attribute
  // e.g. <span data-setting="phone"></span>
  document.querySelectorAll('[data-setting]').forEach(el => {
    const key = el.getAttribute('data-setting');
    if (window.HH_SETTINGS[key]) el.textContent = window.HH_SETTINGS[key];
  });

  return window.HH_SETTINGS;
}

// Export all functions globally
window.HH = {
  loadBlogs,
  loadBlogPost,
  loadTestimonials,
  loadServices,
  loadGallery,
  attachLeadForm,
  loadSEO,
  loadTransactions,
  loadSiteSettings,
};