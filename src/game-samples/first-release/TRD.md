# 기술 설계 — 최초 릴리스

## 스택·파일 책임

Node.js 24 LTS, vanilla ES modules, Canvas 2D, Vite, Node 내장 테스트, Playwright Chromium을 사용한다.
의존성 버전은 npm의 안정 배포를 확인해 정확한 버전과 잠금 파일로 고정한다.

| 파일 | 책임 | 요구사항 |
|---|---|---|
| `index.html` | 한국어 문서, Canvas, 접근 가능한 상태·점수·버튼 | 01, 08 |
| `src/game.js` | 순수 상태 생성·명령·키 처리·사각형 충돌·시간 갱신 | 01~07 |
| `src/main.js` | DOM 연결, 키·포커스 이벤트, 단일 RAF, 자체 도형 렌더링 | 01~03, 06~08 |
| `src/styles.css` | 색상·레이아웃·포커스·축소 표시 | 08 |
| `tests/game.test.js` | 명시적 dt와 상태를 이용한 결정적 규칙 검사 | 01~07 |
| `e2e/game.spec.js` | 실제 사용자 키·버튼과 공개 DOM·Canvas 픽셀 관찰 | 01~03, 07~08 |
| `playwright.config.js` | Chromium, 독립 관리 서버, 실패 추적 | 08 |
| `vite.config.js` | `base: './'`, 기본 `dist` 출력 | 08 |
| `package.json`, `package-lock.json`, `.gitignore` | 명령·재현 가능한 의존성·생성물 제외 | 08 |
| `scripts/check-build.mjs` | QA에서 추가한 빌드 하위 경로 제공·Chromium 검사 | 08 |

## 순수 API와 상태

`createGame(status)`는 새 판을 만든다. `command(game, action)`은 유효 상태에서만 새 판으로 전환한다.
`keyInput(game, code, pressed, repeat)`은 명령 또는 눌린 키 집합을 반환한다.
`clearInput(game)`은 키를 지운다. `step(game, dt)`는 입력 상태를 읽어 새 상태를 반환한다.
인자를 직접 변경하지 않으며 DOM·RAF·실시간 시계·난수에 접근하지 않는다.
상태는 상태명, 플레이어, 적 배열, 탄환 배열, 점수, 방향, 키 집합, 시뮬레이션 시간,
발사 대기시간, 다음 탄환 번호로 구성한다. 종료 상태의 step은 같은 상태를 반환한다.

## 갱신·충돌·종료

1. 유한하고 음수가 아닌 dt인지 검사하고 PRD의 상한을 적용한다.
2. 발사 입력이 있고 대기시간이 끝났으면 현재 시뮬레이션 시각에 발사한다.
3. 남은 dt를 최대 1/240초 및 다음 발사 시점으로 나눈다.
4. 플레이어 이동·경계 제한 → 적 편대 이동/반전/하강 → 탄환 이동.
5. 각 탄환은 첫 번째 살아 있는 겹친 적만 제거하고 즉시 소모한다. 소비 여부로 중복 처리하지 않는다.
6. 화면 밖 탄환 제거 → 살아 있는 적 기준 패배 우선 종료 → 다음 발사 시점 처리.

편대는 경계까지 필요한 시간으로 나누고 나머지를 반전 방향으로 이동한다.
한 세부 갱신에서 탄환은 최대 2.5픽셀, 적은 약 0.267픽셀 이동하므로
정상 크기 적·탄환의 수직 겹침 구간을 한 번에 통과하지 않는다.
충돌 함수는 엄격한 `<`/`>` 비교를 쓴다. 경계만 접촉하는 것은 명중이 아니다.
발사 대기시간은 dt로만 줄이며 부동소수점 반올림 허용치는 `64 * Number.EPSILON`초다.
반복 감산 때문에 정확한 0.2초 경계가 한 프레임 늦어지는 것을 막되 눈에 띄는 조기 발사는 허용하지 않는다.

## 브라우저 입력·시각

리스너는 최초 한 번 등록한다. RAF는 부팅 때 한 번 시작하고 콜백 끝에서 다음 하나를 예약한다.
시작·재시작은 RAF를 만들지 않는다. RAF timestamp 차이를 초로 바꿔 step에 넘긴다.
blur·상태 전환에서 키를 지우고 이전 timestamp를 없앤다. focus·visibility 복귀도 timestamp를 없앤다.
버튼에 포커스가 있으면 Enter/Space의 기본 활성화에 맡기며 다른 전역 처리와 겹치지 않는다.
키 반복은 명령과 새 키 상태 생성에 사용하지 않는다. 기존에 눌린 키만 유지된다.

렌더러는 상태를 읽기만 한다. DOM의 `data-state`는 사용자에게 보여 주는 상태값과 같은 공개 관찰점이다.
테스트용 전역 상태, 강제 승패 키, 속도 변경 모드를 만들지 않는다.

## 검증·설치·배포 계획

manifest → 최초 `npm install` → 잠금 파일 → 이후 `npm ci` 순서다.
`npm test` = `node --test tests/*.test.js`, `npm run test:e2e` = `playwright test`,
`npm run build` = `vite build`, `npm run dev` = `vite`, `npm run preview` = `vite preview`.
Chromium은 설치된 Playwright로 준비하며 실제 결과는 TEST_RESULTS에만 기록한다.

E2E webServer 명령은 `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`.
url/baseURL은 `http://127.0.0.1:5173`, `reuseExistingServer: false`이다.
Playwright가 시작·응답 확인·종료를 관리한다. 포트 충돌이면 실패를 보고하고 다른 프로세스를 종료하지 않는다.
순수 검사는 승패 경계까지 다루고, 브라우저는 실제 조작을 검사한다. 수동 한 판 승리는 별도 기록한다.

QA 보완으로 `node scripts/check-build.mjs`를 빌드 뒤 실행한다. `dist` 파일만
임의의 사용 가능한 loopback 포트의 `/first-release/` 아래에 제공하고 Chromium으로
상대 JS/CSS 요청·시작 버튼·상태·점수·오류를 검사한 뒤 서버와 브라우저를 닫는다.
이는 Playwright 개발 서버와 독립이며 실제 Pages의 권한·배포를 검증하지 않는다.
브라우저 긴 플레이 검사는 Playwright 시계로 RAF 시간을 진행하며 실제 키 입력만 사용한다.

`.github/workflows/pages.yml`은 이 샘플을 독립 저장소 루트에 놓을 경우를 위한 완전한 예제다.
PR은 검사만, main push/main 수동 실행은 검사 성공 뒤 `dist`만 업로드·배포한다.
쓰기 권한과 배포 동시성은 deploy job에만 둔다. 상위 저장소에서 자동 실행되는 워크플로가 아니다.

## 설계 검토·승인 범위

2026-09-13 사용자 요청은 REQ-01~08의 문서·샘플 자동 리허설 수행을 허용했다.
참가자가 각 설계·수치·M1/M2/M3를 따로 승인한 것은 아니다.
PRD와 상태·수치·검증 연결을 구현 전에 대조했다. 설계 시점에 구현·테스트는 미수행이다.
다음 허용 작업은 계획 문서 작성 후 최초 샘플 구현·로컬 검증이며, 커밋·원격 배포는 제외한다.
app 지침 자동 적용·인간 플레이·공개 URL은 미확인이다.
CHG-01은 후속 후보일 뿐 현재 코드에 paused 상태나 P 키 동작을 넣지 않는다.
