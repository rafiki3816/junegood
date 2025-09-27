# Cloudflare Pages 배포 설정 가이드

## 개요
Cloudflare Pages는 정적 사이트 호스팅 서비스로, 서버 사이드 환경 변수를 직접 지원하지 않습니다.
이 프로젝트는 클라이언트 사이드에서 안전하게 인증을 관리하는 방식을 사용합니다.

## 새로운 인증 시스템

### 특징
1. **첫 로그인 시 자동 설정**: 처음 로그인할 때 입력한 정보가 관리자 계정으로 설정됨
2. **암호화된 저장**: 비밀번호는 해시 처리되어 localStorage에 저장
3. **보안 기능**:
   - 로그인 시도 제한 (5회)
   - 계정 잠금 (15분)
   - 세션 타임아웃 (30분)

## 설정 방법

### 1. 최초 배포 후 설정

1. 사이트 배포 완료 후 `/journals-login.html` 접속
2. 원하는 관리자 계정 정보 입력:
   ```
   Username: [원하는 아이디]
   Password: [안전한 비밀번호]
   ```
3. 처음 로그인한 정보가 관리자 계정으로 자동 설정됨

### 2. 비밀번호 변경

관리자 페이지에서 비밀번호 변경 기능 사용 (추후 구현 예정)

### 3. 비상 초기화

브라우저 콘솔에서 실행:
```javascript
AuthManager.resetAuth();
```
⚠️ 모든 인증 설정이 초기화되며, 다시 첫 로그인부터 설정해야 함

## 파일 구조

```
/js/
├── config-static.js    # 정적 설정 파일 (공개 가능한 설정)
├── auth-manager.js     # 향상된 인증 관리 시스템
├── journals-auth.js    # 기존 인증 (호환성 유지)
└── config.js          # 로컬 개발용 .env 로더
```

## 보안 고려사항

### 장점
- 서버 없이도 기본적인 보안 제공
- 비밀번호 해시 처리
- 무차별 대입 공격 방지
- 세션 타임아웃

### 한계
- 클라이언트 사이드 인증의 근본적 한계
- localStorage 접근 가능한 환경에서 취약
- 프로덕션 환경에서는 서버 사이드 인증 권장

## 로컬 개발

로컬에서는 `.env` 파일 사용 가능:

1. `.env` 파일 생성:
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_password
   ```

2. 개발 서버 실행:
   ```bash
   python3 -m http.server 8000
   ```

## Cloudflare Pages 설정

### 빌드 설정
- **Framework preset**: None
- **Build command**: (비워둠)
- **Build output directory**: `/`

### 환경 변수 (선택사항)
Cloudflare Pages의 환경 변수는 빌드 시에만 사용되므로,
이 프로젝트에서는 사용하지 않음

## 배포 체크리스트

- [ ] 코드 GitHub에 푸시
- [ ] Cloudflare Pages에서 자동 배포 확인
- [ ] 배포 완료 후 `/journals-login.html` 접속
- [ ] 관리자 계정 설정 (첫 로그인)
- [ ] 정상 작동 테스트

## 문제 해결

### 로그인이 안 될 때
1. 브라우저 콘솔 확인 (F12)
2. localStorage 확인
3. 필요시 `AuthManager.resetAuth()` 실행

### 세션이 자꾸 끊길 때
- `config-static.js`에서 `SESSION_TIMEOUT` 값 조정

### 계정이 잠긴 경우
- 15분 대기 또는 `AuthManager.resetAuth()` 실행

## 추가 개선사항 (향후)

1. **서버 사이드 인증**: Cloudflare Workers 활용
2. **2단계 인증**: TOTP 구현
3. **비밀번호 변경 UI**: 관리자 페이지에 추가
4. **감사 로그**: 로그인 기록 저장

---

*Last Updated: 2024*
*Documentation for Cloudflare Pages deployment*