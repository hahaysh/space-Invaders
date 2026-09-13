# 04-02. 첫 조작 가능한 화면 만들기

**4. 설계 구현 · M1 시작·이동·발사**

이전: [04-01 구현 계획](04-01-implementation-plan.md) · [전체 목차](00-overview.md) · 다음: [04-03 핵심 게임](04-03-core-gameplay.md)

## 1. 설명

처음부터 완성 게임을 만들지 않고 **시작해서 이동하고 발사할 수 있는 화면**을 먼저 만듭니다.
이 단계에는 적·충돌·승패·재시작이 없습니다. 일부 기능이 보인다고 전체 PRD를 완료로 표시하지 않습니다.
참가자는 Copilot app에서 작업을 요청하며, 필요한 셸 명령은 에이전트가 해당 작업 공간에서 실행합니다.
CLI나 VS Code를 별도로 열어 작업할 필요는 없습니다.

## 2. 시작 상태

- [ ] 루트 `AGENTS.md`, `PRD.md`, `TRD.md`, `IMPLEMENTATION_PLAN.md`를 승인했다.
- [ ] M1은 미착수이고 기존 사용자 변경과 작업 브랜치를 확인했다.
- [ ] Node.js 24 LTS가 준비되어 있다. 버전이 다르면 01-01의 준비 단계로 돌아간다.
- [ ] Copilot app에서 **Plan** 모드를 선택했다.

## 3. 실행: M1만 구현하고 조작하기

### 3-1. Plan에서 이번 변경 범위 확인하기

```text
AGENTS.md, PRD.md, TRD.md, IMPLEMENTATION_PLAN.md를 읽어줘.
저장소·브랜치·기존 변경과 Node/npm 버전을 읽기 전용으로 확인해줘.
M1만 실행할 세부 계획과 변경 경로·검증 명령을 제시해줘.
title→playing, 800×600 Canvas, DOM 상태·점수·시작 버튼,
40×20/y550 플레이어의 좌우/A/D 이동과 x 제한, Space 발사/0.2초 간격이 범위다.
단일 RAF, blur·상태 전환의 키 해제, 긴 dt 제한도 포함한다.
적·충돌·승패·재시작·일시정지는 아직 구현하지 않는다.
파일 변경·설치·서버 실행·커밋·푸시 없이 내 승인을 기다려줘.
```

### 3-2. Interactive에서 승인된 구현과 검증 실행하기

계획을 읽고 M1만 포함하는지 확인한 뒤 모드를 바꿉니다.

```text
M1 세부 계획을 승인한다. AGENTS.md를 읽고 M1만 구현해줘.
승인한 index.html, src/game.js, src/main.js, src/styles.css,
tests/game.test.js, e2e/game.spec.js, playwright.config.js,
vite.config.js, package.json, package-lock.json, .gitignore와
IMPLEMENTATION_PLAN.md의 M1 진행 상태만 변경해줘.

Node24, vanilla ES modules/Canvas2D, Vite와 @playwright/test를 사용한다.
호환되는 안정 버전을 확인해 정확한 버전으로 고정하고 선택 근거를 알려줘.
npm의 latest 태그가 beta/rc 등 사전 배포판이면 그대로 채택하지 마.
package.json부터 작성하고 devDependencies를 선언한 뒤 npm install을 실행해줘.
package-lock.json을 생성·보존하고 이후 재현 설치에는 npm ci를 사용한다.
scripts는 dev: vite, build: vite build, preview: vite preview,
test: node --test tests/*.test.js, test:e2e: playwright test로 해줘.
Vite base는 './'이고 런타임 외부 CDN이나 에셋 서버를 사용하지 마.
.gitignore에는 node_modules, dist, test-results, playwright-report 등 생성물을 제외해줘.
Playwright 의존성이 설치된 뒤 npx playwright install chromium을 실행해줘.
실패하면 원인과 실제 출력을 보고하고 임의의 다른 도구를 설치하지 마.

게임 규칙은 src/game.js에 DOM 없이 두고 명시적 dt로 순수 테스트한다.
0.2초 미만/도달 발사, 좌우 경계, title 입력 무시, 화면 밖 탄환 제거를 검증해줘.
DOM 상태·점수·버튼을 사용자에게 읽을 수 있게 만들고 실제 입력의 시작 E2E를 작성해줘.
Playwright testDir는 e2e로 제한하고 Chromium 프로젝트를 구성해줘.
webServer는 npm run dev -- --host 127.0.0.1 --port 5173 --strictPort,
url/baseURL은 http://127.0.0.1:5173으로 맞추고 reuseExistingServer는 false로 해줘.
포트가 사용 중이면 모르는 프로세스를 종료하지 말고 알려줘.

npm test, npm run test:e2e, npm run build를 실제 실행해줘.
각 명령의 결과·실패·미확인을 구분하고 수정이 필요하면 원인·수정안을 먼저 보고해줘.
tests의 성공을 전체 REQ 통과로 확대하지 마.
diff와 실행 증거를 보여주고 M1은 참가자 확인 대기라고 보고해줘.
커밋·푸시·M2 구현은 하지 마.
```

설치·브라우저 다운로드 권한 요청이 보이면 요청 범위가 승인한 도구와 맞는지 확인합니다.
`package-lock.json`이 있어야 이후 `npm ci`로 같은 의존성 구성을 설치할 수 있습니다.
참고 샘플 리허설에서는 Vite `8.2.2`와 Playwright `1.63.0`을 사용했습니다. 당시 Vite의 latest가 beta를 가리켜 안정판을 별도 선택했습니다. 참가자도 태그 이름이 아닌 실제 버전과 Node 호환성을 확인합니다.

### 3-3. 실제 브라우저에서 확인하기

```text
E2E가 관리하던 서버가 종료되었는지 확인하고, 내가 조작할 개발 서버를
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort로 시작해줘.
실제 응답을 확인한 URL과 이 작업이 시작한 서버의 식별 정보를 알려줘.
세션에 연결해서 유지하고 다른 서버를 종료하지 마. 파일은 수정하지 마.
```

app에서 열 수 있는 미리보기 또는 일반 브라우저로 `http://127.0.0.1:5173`에 접속합니다.
키 입력이 게임에 전달되도록 페이지를 클릭합니다. app의 미리보기 기능이 없으면 일반 브라우저를 사용합니다.

### 예상 결과

- 초기 화면에서 시작 버튼 또는 Enter로 시작한다.
- 좌우/A/D로 이동하고 Space로 발사하지만 아직 적과 종료 화면은 없다.
- 소스·잠금 파일·테스트가 생성되고 M1에 한정한 실행 결과가 보고된다.

## 4. 함께 점검·확인

| 직접 할 일 | 기대 결과 |
|---|---|
| 시작 전 이동·Space 입력 | 플레이어와 탄환이 움직이지 않는다. |
| 시작 버튼, 새로고침 후 Enter | 각각 playing으로 전환하고 점수 0을 표시한다. |
| 좌우 끝까지 이동, A/D 사용 | 플레이어 전체가 화면 안에 남는다. |
| Space 유지 | 연속 발사하되 0.2초 간격을 지키며 오래된 탄환은 사라진다. |
| 이동 키를 누른 채 다른 창으로 전환·복귀 | 키가 붙지 않고 큰 위치 점프가 없다. |
| 브라우저 오류와 요청 확인 | 모듈·스타일 로딩 오류와 런타임 CDN 요청이 없다. |

발사 간격의 정확한 경계는 눈대중이 아닌 순수 테스트 결과로 확인합니다.
참가자는 관찰한 결과만 대화에 전달하고 못 본 항목은 미확인으로 남깁니다.

## 5. 보완과 재확인

**Plan**으로 전환하고 증상·재현 절차를 적어 요청합니다.

```text
M1에서 이동 키를 누른 채 창을 전환하면 복귀 후에도 계속 움직인다.
AGENTS.md와 관련 코드를 읽고 원인·최소 수정 파일·회귀 검증을 제안해줘.
아직 코드나 테스트를 바꾸지 말고 승인을 기다려줘.
```

수정안 승인 후 Interactive에서 해당 파일만 반영하고 관련 테스트와 재현 절차를 다시 수행합니다.
E2E를 다시 실행하기 전에는 **이번 세션에서 시작한 개발 서버만** 식별해서 종료하도록 요청합니다.
실패를 숨기기 위해 테스트를 삭제하거나 기대값을 바꾸지 않습니다.

## 6. 완료 승인

- [ ] M1 자동 검증과 직접 조작을 확인했다.
- [ ] 남은 M2/M3 기능을 완료로 오해하지 않는다.
- [ ] 코드·설정·잠금 파일의 diff와 생성물 제외를 확인했다.

```text
직접 확인한 M1 범위의 결과를 승인한다.
IMPLEMENTATION_PLAN.md의 M1 상태와 실제 검증 근거만 갱신하고 diff를 보여줘.
내가 확인하지 않은 항목은 미확인으로 남겨줘. M2·커밋·푸시는 하지 마.
```

계획 diff까지 확인한 뒤 “검토한 M1 파일만 커밋하고 푸시하지 마. 메시지는 너무 짧지 않은 한국어 설명형 제목과 본문으로 작성하고, 본문에 04-02/M1 단계 ID, 변경 내용과 이유, 실제 검증 결과와 미확인 범위를 적어줘”라고 요청합니다.
조작을 마쳤다면 에이전트에게 이번 실습에서 시작한 서버만 종료하도록 요청합니다.

---

이전: [04-01 구현 계획](04-01-implementation-plan.md) · [전체 목차](00-overview.md) · 다음: [04-03 핵심 게임](04-03-core-gameplay.md)
