# Junegood - Personal Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.javascript.com/)

개인 포트폴리오 및 저널 웹사이트입니다. 여행 사진, 작업물, 개인 저널을 전시하는 반응형 웹 애플리케이션입니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [보안 설정](#보안-설정)
- [페이지 구성](#페이지-구성)
- [커스터마이징](#커스터마이징)
- [배포](#배포)
- [기여 방법](#기여-방법)
- [라이선스](#라이선스)

## ✨ 주요 기능

### 🎨 디자인 & UX
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- **모던한 UI**: 미니멀하고 세련된 인터페이스
- **부드러운 애니메이션**: CSS 트랜지션과 JavaScript 인터랙션
- **접근성 지원**: 스크린 리더 및 키보드 네비게이션 지원

### 📸 갤러리 기능
- **여행 사진 갤러리**: 도시별 사진 컬렉션
- **라이트박스**: 향상된 이미지 뷰어
- **캐러셀**: 자동 재생 이미지 슬라이더
- **지연 로딩**: 성능 최적화를 위한 이미지 레이지 로딩

### 📝 저널 시스템
- **관리자 인터페이스**: 저널 작성 및 편집
- **보안 인증**: 로그인 시스템 및 세션 관리
- **마크다운 지원**: 풍부한 텍스트 편집
- **카테고리 관리**: 저널 분류 및 태그

### 🔒 보안 기능
- **XSS 방지**: 입력 살균 및 이스케이핑
- **CSRF 보호**: 토큰 기반 요청 검증
- **로그인 제한**: 무차별 대입 공격 방지
- **보안 헤더**: CSP, X-Frame-Options 등

## 🛠 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - 모던 스타일링 (Flexbox, Grid)
- **Vanilla JavaScript** - jQuery 의존성 최소화
- **Google Fonts** - 웹폰트 (Sacramento, Raleway, Sunflower)

### Libraries & Tools
- **jQuery 3.5.1** - 레거시 컴포넌트용
- **Lightbox** - 이미지 갤러리
- **Carousel** - 이미지 슬라이더

### Security
- **Content Security Policy** - XSS 방지
- **Input Validation** - 데이터 검증
- **Rate Limiting** - API 보호
- **Secure Headers** - 보안 헤더 설정

## 📁 프로젝트 구조

```
junegood/
│
├── index.html              # 메인 페이지
├── sub1.html              # About Me 페이지
├── sub2.html              # Works 페이지
├── sub3.html              # Travels 페이지
├── sub4.html              # Journals 페이지
├── journals-login.html    # 관리자 로그인
├── journals-admin.html    # 저널 관리 페이지
│
├── css/                   # 스타일시트
│   ├── main-responsive.css      # 메인 페이지 스타일
│   ├── sub[1-4]-responsive.css  # 서브 페이지 스타일
│   ├── journals-admin.css       # 관리자 스타일
│   └── journal-article.css      # 저널 글 스타일
│
├── js/                    # JavaScript 파일
│   ├── main-responsive-vanilla.js   # 메인 페이지 스크립트
│   ├── journals-auth.js            # 인증 시스템
│   ├── journals-auth-secure.js     # 강화된 인증
│   ├── journals-admin-vanilla.js   # 관리자 기능
│   ├── journals-display-vanilla.js # 저널 표시
│   ├── security-utils.js          # 보안 유틸리티
│   ├── accessibility.js           # 접근성 기능
│   ├── lazy-load.js              # 이미지 지연 로딩
│   └── sub3-carousel.js          # 캐러셀 기능
│
├── images/                # 이미지 리소스
│   ├── bg.png            # 배경 이미지
│   └── favicon.ico       # 파비콘
│
├── photos/               # 여행 사진 갤러리
│   ├── [도시명]/        # 도시별 사진 폴더
│   │   ├── images/      # 원본 이미지
│   │   ├── thumbnails/  # 썸네일 이미지
│   │   └── lightbox.html # 갤러리 페이지
│   └── ...
│
├── journals/             # 저널 데이터 (자동 생성)
│   └── [journal-files]  # JSON 형식 저널 파일
│
├── .htaccess            # Apache 서버 설정
├── SECURITY.md          # 보안 가이드
└── README.md           # 프로젝트 문서
```

## 🚀 설치 방법

### 1. 저장소 클론

```bash
# HTTPS
git clone https://github.com/rafiki3816/junegood.git

# 또는 SSH
git clone git@github.com:rafiki3816/junegood.git

cd junegood
```

### 2. 웹 서버 설정

#### Apache
```bash
# 프로젝트를 웹 루트로 이동
sudo cp -r junegood /var/www/html/

# 권한 설정
sudo chown -R www-data:www-data /var/www/html/junegood
sudo chmod -R 755 /var/www/html/junegood
```

#### Nginx
```nginx
server {
    listen 80;
    server_name junegood.com;
    root /var/www/junegood;
    index index.html;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### 로컬 개발 서버
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### 3. 초기 설정

1. **관리자 비밀번호 변경**
   - 기본 계정: `admin` / `junegood2024!`
   - 첫 로그인 후 즉시 변경 필요

2. **저널 폴더 생성**
   ```bash
   mkdir journals
   chmod 755 journals
   ```

3. **SSL 인증서 설치** (프로덕션)
   ```bash
   # Let's Encrypt 사용
   sudo certbot --apache -d junegood.com
   ```

## 📖 사용 방법

### 일반 사용자

1. **메인 페이지** (`index.html`)
   - 4개의 메인 메뉴 네비게이션
   - 반응형 디자인으로 모든 디바이스 지원

2. **About Me** (`sub1.html`)
   - 개인 소개 및 프로필
   - 스킬 및 경력 정보

3. **Works** (`sub2.html`)
   - 포트폴리오 작품 전시
   - 프로젝트 상세 정보

4. **Travels** (`sub3.html`)
   - 여행 사진 갤러리
   - 도시별 사진 컬렉션
   - 라이트박스 뷰어

5. **Journals** (`sub4.html`)
   - 공개 저널 읽기
   - 카테고리별 필터링

### 관리자

1. **로그인**
   - `/journals-login.html` 접속
   - 관리자 계정으로 로그인

2. **저널 관리**
   - 새 저널 작성
   - 기존 저널 편집/삭제
   - 카테고리 관리
   - 이미지 업로드

3. **보안 설정**
   - 비밀번호 변경
   - 세션 타임아웃 설정
   - 로그인 기록 확인

## 🔐 보안 설정

### 즉시 적용 필요 사항

1. **관리자 비밀번호 변경**
   ```javascript
   // journals-auth-secure.js
   const DEFAULT_CREDENTIALS = {
       username: 'admin',
       password: hashPassword('YOUR_NEW_STRONG_PASSWORD')
   };
   ```

2. **HTTPS 활성화**
   ```apache
   # .htaccess 파일에서 주석 해제
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteCond %{HTTPS} off
       RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   </IfModule>
   ```

3. **CSP 헤더 커스터마이징**
   ```javascript
   // security-utils.js
   const CSP = SecurityUtils.generateCSP();
   // 필요한 도메인 추가
   ```

### 보안 기능

- **XSS 방지**: 모든 사용자 입력 살균
- **CSRF 토큰**: 폼 제출 시 토큰 검증
- **Rate Limiting**: API 요청 제한
- **세션 관리**: 30분 자동 로그아웃
- **로그인 제한**: 5회 실패 시 15분 잠금
- **보안 헤더**: X-Frame-Options, CSP 등

자세한 내용은 [SECURITY.md](./SECURITY.md) 참조

## 🎨 커스터마이징

### 색상 테마 변경

```css
/* css/main-responsive.css */
:root {
    --primary-color: #blue;
    --secondary-color: #rgba(0, 0, 0, 0.3);
    --hover-color: #rgba(200, 200, 200, 0.5);
}
```

### 폰트 변경

```css
/* Google Fonts import 수정 */
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

#title {
    font-family: 'YourFont', cursive;
}
```

### 메뉴 항목 수정

```html
<!-- index.html -->
<ul class="nav">
    <li><a href="custom-page.html">Custom Menu</a></li>
</ul>
```

## 🌐 배포

### GitHub Pages

1. Repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. Save

### Netlify

```bash
# netlify.toml
[build]
  publish = "/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```json
// vercel.json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코드 스타일 가이드

- **HTML**: 시맨틱 태그 사용, 접근성 속성 포함
- **CSS**: BEM 네이밍, 모바일 퍼스트
- **JavaScript**: ES6+, 주석 포함, 에러 처리

## 📞 문의

- **GitHub Issues**: [https://github.com/rafiki3816/junegood/issues](https://github.com/rafiki3816/junegood/issues)
- **Email**: junegood@example.com

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

---

<p align="center">
  Made with ❤️ by Dongjune Kim
</p>