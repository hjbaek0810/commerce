## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# MiniMall 프로젝트 (user & admin 쇼핑몰)

## 1. 개요
- 제작 기간: 2024. 10. 20 ~ 2025. 1. 10
- 참여인원 : 1명 (프론트엔드 & 백엔드 담당)
- 프로젝트 주제: 사용자가 상품을 쉽게 탐색하고 구매할 수 있는 쇼핑몰 웹 애플리케이션.
관리자 페이지를 통해 상품, 카테고리, 주문을 효율적으로 관리할 수 있는 시스템 구현.

## 2. 주요 기능
**✨ 코드 품질 및 작업 자동화**
- ESLint & Prettier: 코드 스타일 및 품질 유지
- Husky & lint-staged: 커밋 시 자동화된 코드 검사 및 포맷팅 설정

**🌐 백엔드 및 API**
- Next.js & MongoDB: 서버리스 환경에서 효율적인 API 작성
- NextAuth: 소셜 로그인(구글) 및 커스텀 로그인 기능 지원
- Next.js의 SSR와 React Query의 Hydration 기능을 활용해 초기 데이터 로드 최적화

**🛍️ 고객 페이지**
- 로그인 및 회원가입 (`NextAuth` 기반 인증)
- 상품 목록 조회 (`TanStack Query`의 **무한스크롤 기능** 적용)
- 장바구니 및 찜하기 기능
- 주문 처리 및 결제

**🛠️ 관리자 페이지**
- **대시보드**: `Recharts`를 활용한 차트 기반 **데이터 시각화** 및 **필터링 제공**
- 카테고리 관리: `React Hook Form`을 활용하여 테이블 형태로 추가/삭제 기능 구현
- 상품 관리: 카테고리 및 상품 CRUD (생성, 조회, 수정, 삭제)
  - `Cloudinary API`를 활용한 이미지 업로드 및 관리  
- 주문 관리: 주문 상태 업데이트 및 처리
- 사용자 관리: 사용자 목록 조회 및 검색
- **페이지네이션 적용**: **Admin 페이지에서는 페이지네이션(Pagination) 적용**  
  
**🚀 배포**
- Vercel을 통해 서버리스 환경으로 배포 및 관리


## 3. 기술 스택
| 구분          | 기술                                     |
|---------------|------------------------------------------|
| **프론트엔드** | `TypeScript`, `React 18`, `Next.js 14`  |
| **스타일링**   | `Vanilla Extract CSS`                   |
| **상태 관리**  | `TanStack Query v5`                     |
| **백엔드**     | `MongoDB`, `Next.js API Routes`         |
| **인증**       | `NextAuth`                              |
| **이미지 관리**| `Cloudinary API`                        |
| **배포**       | `Vercel`                                |


## 4. 주요 화면
### 유저
#### 1. 홈
   - 슬라이드 배너
   - 60일 이내에 등록된 신상품
   - 조회 높은 순으로 나열한 인기상품

https://github.com/user-attachments/assets/e9d9a43c-1a2e-4ce3-845b-fdab784b6ab8


#### 2. 로그인 & 회원가입

NextOAuth를 이용하여 소셜 로그인 / 자체 로그인 구현

인증이 필요한 API 호출 시 `getServerSession()`을 활용하여 서버에서 사용자 정보를 직접 제공하며, 클라이언트에서는 별도의 사용자 상태 관리를 하지 않도록 최적화.

   - 구글 로그인
  
https://github.com/user-attachments/assets/3ac5b35c-7f7d-4127-9ea5-d3631521b192

   - 회원가입 & 로그인

https://github.com/user-attachments/assets/c7a93412-9fbf-4f31-80bb-86cc26f46a01

#### 3. 상품 목록 조회
   - 카테고리 별 메뉴 탭 분리
   - 정렬 및 검색 기능
   - tanstack-query의 무한 스크롤 활용
   
https://github.com/user-attachments/assets/99ba0b06-3388-49ba-92da-bdb58c8f5802

#### 4. 상품 상세 조회
   - 장바구니, 찜하기, 구매하기 버튼 제공
   - 비회원일 경우 버튼 클릭 시 로그인 페이지로 이동
     - 로그인 후, 이전 경로가 상품 목록 페이지 또는 상품 상세 페이지인 경우 해당 페이지로 자동 리다이렉트하여 원활한 사용자 경험 제공

https://github.com/user-attachments/assets/9fa0b9af-8f62-4d9e-962e-37d05bf28e32


#### 5. 상품 주문하기
   - 유저 정보 입력
   - 주문 상태(주문 완료, 주문 취소, 배송 중, 완료 등)에 따른 UI 변경

https://github.com/user-attachments/assets/ab815de3-0e17-4a09-8c7a-50092d43e8a5


https://github.com/user-attachments/assets/a05632f8-57a1-42fc-b9ef-9316fbf43c8a

6. 내 정보 수정
![image](https://github.com/user-attachments/assets/92a9249d-aecd-4261-a4d9-e35c2708b8bb)

---

### 어드민

#### 1. 어드민 로그인
   - role이 admin인 사용자만 접근 가능
   - 어드민 페이지 URL: `/admin/:path`
   - 일반 사용자와 관리자 접근 권한 분리

https://github.com/user-attachments/assets/fac88fe4-e85a-43f9-8d1f-09b78af89d2c

#### 2. 대시보드
   - 회원, 주문 내역, 매출 데이터를 차트로 시각화

https://github.com/user-attachments/assets/edd5e469-f3bc-4727-aec3-68ad24a833b7


#### 3. 카테고리 관리
   - 카테고리 추가/수정/삭제
   - 카테고리를 기반으로 상품 및 메뉴 구성

https://github.com/user-attachments/assets/6a8f8ede-6ef3-4bce-87ac-dffc152c000c

#### 4. 상품 관리
   - cloudinary API를 활용한 이미지 업로드
   - 업로드된 이미지 URL을 데이터베이스에 저장하여 관리

https://github.com/user-attachments/assets/9ce6f73b-eeac-47ec-af88-653ce53192d7
 

#### 5. 주문 관리
   - 주문 상태에 따라 UI 변경
   - 주문 내역 조회 및 처리

https://github.com/user-attachments/assets/f46306a5-d5d2-4d00-994c-10ec4d8905ad


#### 6. 유저 조회
   ![image](https://github.com/user-attachments/assets/168f6e0a-a01d-4460-8dbb-e470beda59a8)


## 5. 향후 개선 사항
- 다국어 지원 (i18n) 추가
- 모바일 환경 최적화 (반응형 디자인)
- 실시간 채팅 및 고객 지원 기능
- 후기 작성
- 결제 방식 확장
- 이미지 최적화

