# Washplate

모바일 전용 셀프세차장 간편결제/베이 제어 데모.

## 실행

1) 백엔드(Spring Boot)
- 경로: `backend`
- Java 17, Maven 필요
- DB: MySQL `118.41.249.15:3306` 스키마 `washplate` (root / mysql@0521)

```
cd backend
mvn spring-boot:run
```

2) 프론트(Vite React)
```
cd frontend
npm i
npm run dev
```
- 개발 프록시: `/api` → `http://localhost:8080`

## 주요 API
- `POST /api/auth/login` { phone, name }
- `POST /api/sessions/start` { plateNumber, bayCode }
- `POST /api/sessions/{id}/sync` { minutes, liters, amount }
- `POST /api/sessions/{id}/close`
- `POST /api/device/allow-water?bayCode=BAY-01&allow=true`
- `GET /api/health`

## 구조
- 백엔드: JPA 엔티티(`User`, `Vehicle`, `Bay`, `WashSession`, `Payment`, `Pricing`)
- 프론트: 모바일 고정 UI, 사용자/관리자 라우트, Zustand 상태관리

이 저장소는 하드웨어 제어를 모의(stub)하며, 상용 배포 시 인증·보안 강화 및 장비 연동 프로토콜(RTSP/RS485/MODBUS 등)에 맞춘 어댑터가 필요합니다.


