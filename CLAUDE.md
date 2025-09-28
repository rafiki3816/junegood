# CLAUDE.md - AI Assistant Guide

## Project Overview
**Junegood** is a personal portfolio website showcasing travels, works, and journals with an admin system for content management.

## Quick Commands
```bash
# Start local development server
python3 -m http.server 8000

# Git operations
git add . && git commit -m "message" && git push origin main

# Check for issues
find . -name "*.html" | xargs -I {} python3 -m py_compile {}
```

## Key Information

### Admin Credentials
- **Username**: admin
- **Password**: junegood2024!
- **Login URL**: /journals-login.html
- ⚠️ **IMPORTANT**: Change password immediately in production

### Project Structure
```
/ (root)
├── index.html          → Main landing page (centered menu)
├── sub1.html          → About Me page
├── sub2.html          → Works/Portfolio page
├── sub3.html          → Travel photos gallery
├── sub4.html          → Public journals page
├── journals-admin.html → Admin dashboard
└── journals-login.html → Admin login page

/css/
├── main-responsive.css    → Main page styles
└── sub*-responsive.css    → Subpage styles

/js/
├── *-vanilla.js          → Pure JS versions (preferred)
├── jquery-3.5.1.min.js   → jQuery library (legacy support)
└── security-utils.js     → Security utilities

/photos/
└── [CityName]/          → Travel photo collections
    ├── images/          → Full-size photos
    └── lightbox.html    → Photo viewer page
```

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Libraries**: jQuery 3.5.1 (for lightbox/gallery only)
- **Fonts**: Google Fonts (Sacramento, Raleway, Sunflower)
- **Security**: CSP headers, XSS protection, rate limiting

### Common Tasks

#### 1. Modify Menu Position
```css
/* css/main-responsive.css */
.band {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

#### 2. Add New Journal
1. Login to `/journals-admin.html`
2. Click "Create New Journal"
3. Fill form and save
4. Journal auto-appears in `/sub4.html`

#### 3. Update Security
```javascript
// js/journals-auth-secure.js
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: hashPassword('NEW_SECURE_PASSWORD')
};
```

#### 4. Add Travel Photos
1. Create folder: `/photos/NewCity/`
2. Add photos to: `/photos/NewCity/images/`
3. Copy lightbox template from another city
4. Update links in `sub3.html`

### Important Files
- `.htaccess` - Apache security configuration
- `SECURITY.md` - Security documentation
- `README.md` - Complete project documentation
- `js/security-utils.js` - XSS prevention utilities
- `js/journals-auth-secure.js` - Enhanced authentication

### Design Principles
1. **Minimalist UI** - Clean, simple interface
2. **Mobile-First** - Responsive breakpoints: 768px, 1024px, 1440px
3. **Security-First** - Input sanitization, CSRF protection
4. **Performance** - Lazy loading, optimized images

### Testing Checklist
- [ ] All pages load without console errors
- [ ] Navigation works on mobile/tablet/desktop
- [ ] Admin login and session timeout work
- [ ] Journals display correctly
- [ ] Photo galleries load with lightbox
- [ ] Security headers are applied
- [ ] Forms validate input properly

### Deployment Notes
1. **Enable HTTPS** - Uncomment HTTPS redirect in `.htaccess`
2. **Change admin password** - Update in `journals-auth-secure.js`
3. **Set permissions** - `chmod 755` for directories, `644` for files
4. **Create journals folder** - `mkdir journals && chmod 755 journals`
5. **Install SSL** - Use Let's Encrypt or similar

### GitHub Repository
- **URL**: https://github.com/rafiki3816/junegood.git
- **Main Branch**: main
- **Deploy**: GitHub Pages, Netlify, or Vercel compatible

### Known Issues
- Some images in sub1-3.html missing alt attributes (accessibility)
- jQuery dependency for photo galleries (planned migration to vanilla JS)
- Client-side auth (needs server-side implementation for production)

### Contact for Issues
- GitHub Issues: https://github.com/rafiki3816/junegood/issues
- Owner: Dongjune Kim

---

*Last Updated: 2025-09-27*
- 하드코딩은 절대 금지
- 소프트 코딩이 기본 원칙
- 사진이 없으면 jpeg 와 jpg 모두 체크 할것.
- 사진의 날짜는 갤러리 폴더명을 확인해 볼 것
- jpeg 우선적으로 이미지 파악하기
- 정형적인 이모티콘 사용 금지
- Ux 30년차마스터 전문가로 User Frinedly 를 최우선하여 작업