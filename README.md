# Modern Checklist App

Modern Checklist App은 React + Vite + Tailwind CSS 기반의 프론트엔드와 Express 기반 백엔드를 포함하는 깔끔한 체크리스트 프로젝트입니다.

## 프로젝트 구조

- `back/`
  - `package.json` - 백엔드 의존성 및 실행 스크립트
  - `src/server.js` - RESTful API 엔드포인트 구현
- `front/`
  - `package.json` - 프론트엔드 의존성 및 Vite 실행 스크립트
  - `vite.config.js` - Vite 설정
  - `tailwind.config.js` / `postcss.config.js` - Tailwind CSS 설정
  - `src/` - React 애플리케이션 소스
    - `App.jsx` - 핵심 UI 및 API 연동 로직
    - `components/TodoItem.jsx` - 재사용 가능한 할 일 아이템 컴포넌트
    - `index.css` - Tailwind 기반 스타일

## 실행 방법

1. 백엔드 설치 및 실행

```bash
cd back
npm install
npm run dev
```

2. 프론트엔드 설치 및 실행

```bash
cd front
npm install
npm run dev
```

3. 브라우저에서 확인

- 프론트엔드: `http://localhost:5173`
- 백엔드: `http://localhost:4000`

## API 엔드포인트

- `GET /todos` - `status=all|active|completed`, `search=<query>` 지원
- `GET /todos/stats` - 전체/완료/활성 통계
- `POST /todos` - 새 할 일 생성
- `PUT /todos/:id` - 텍스트 수정 또는 완료 상태 토글
- `DELETE /todos/:id` - 단일 할 일 삭제
- `DELETE /todos?completed=true` - 완료된 항목 일괄 삭제

## 디자인 방향

- Toss 스타일의 깔끔하고 신뢰감 있는 디자인
- 모바일 퍼스트 중앙 정렬 레이아웃
- 부드러운 애니메이션(Fade-in, Slide-up)
- 체크된 항목은 취소선과 투명도로 상태 구분
