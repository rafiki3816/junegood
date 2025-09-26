# 웹 보안 설정 가이드

## 구현된 보안 기능

### 1. **보안 헤더 (Security Headers)**
- X-Frame-Options: SAMEORIGIN - 클릭재킹 방지
- X-Content-Type-Options: nosniff - MIME 타입 스니핑 방지
- X-XSS-Protection: 1; mode=block - XSS 공격 방지
- Content-Security-Policy - 콘텐츠 보안 정책
- Referrer-Policy - 리퍼러 정보 제어
- Permissions-Policy - 브라우저 기능 권한 제어

### 2. **인증 시스템 보안 (Authentication Security)**
- 비밀번호 해싱 (클라이언트 사이드 - 프로덕션에서는 서버 사이드 필요)
- 로그인 시도 제한 (5회 실패 시 15분 잠금)
- 세션 타임아웃 (30분 비활동 시 자동 로그아웃)
- 비밀번호 복잡도 검증
- CSRF 방지 토큰

### 3. **입력 검증 및 살균 (Input Validation & Sanitization)**
- XSS 방지를 위한 HTML 이스케이핑
- SQL 인젝션 방지
- 파일 업로드 검증 (타입, 크기, 확장자)
- URL 검증 및 살균
- 이메일 형식 검증

### 4. **추가 보안 조치**
- HTTPS 강제 적용 (SSL 인증서 필요)
- 보안 쿠키 설정 (HttpOnly, Secure, SameSite)
- 디렉토리 리스팅 방지
- 민감한 파일 접근 차단
- 핫링킹 방지

## 즉시 적용 필요 사항

### 1. **관리자 비밀번호 변경**
현재 기본 비밀번호: `junegood2024!`
- 즉시 강력한 비밀번호로 변경 필요
- 최소 12자 이상, 대소문자, 숫자, 특수문자 포함 권장

### 2. **SSL 인증서 설치**
HTTPS 사용을 위한 SSL 인증서 설치 필요:
- Let's Encrypt (무료)
- 또는 신뢰할 수 있는 인증 기관 인증서

### 3. **서버 사이드 인증 구현**
현재 클라이언트 사이드 인증은 임시 방편:
- Node.js, PHP, Python 등으로 서버 사이드 인증 구현
- JWT 토큰 또는 세션 기반 인증 사용
- 비밀번호는 bcrypt 또는 Argon2로 해싱

## 사용 방법

### 보안 유틸리티 사용 예시

```javascript
// HTML 이스케이핑
const safe = SecurityUtils.escapeHtml(userInput);

// 입력 살균
const sanitized = SecurityUtils.sanitizeInput(userInput);

// 이메일 검증
if (SecurityUtils.validateEmail(email)) {
    // 유효한 이메일
}

// 파일 업로드 검증
const validation = SecurityUtils.validateFileUpload(file, {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png']
});

// Rate limiting
const check = SecurityUtils.rateLimiter.check(userIP);
if (!check.allowed) {
    // 너무 많은 요청
}
```

### 보안 인증 시스템 사용

```javascript
// 로그인
const result = login(username, password);
if (result.success) {
    // 로그인 성공
} else {
    // 에러 메시지 표시: result.error
}

// 페이지 보호
JournalsAuth.protectPage(); // 인증되지 않은 사용자 리다이렉트

// 비밀번호 변경
const changeResult = JournalsAuth.changePassword(oldPass, newPass);
```

## 정기 점검 사항

1. **월간**
   - 로그 파일 검토
   - 실패한 로그인 시도 모니터링
   - 비정상적인 트래픽 패턴 확인

2. **분기별**
   - 보안 패치 및 업데이트 적용
   - 비밀번호 정책 검토
   - 백업 및 복구 테스트

3. **연간**
   - 전체 보안 감사
   - 침투 테스트
   - SSL 인증서 갱신

## 긴급 대응

보안 침해 발생 시:
1. 즉시 사이트 접근 차단
2. 로그 보존 및 분석
3. 영향받은 계정 비밀번호 재설정
4. 취약점 패치
5. 사용자 통지 (필요시)

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)