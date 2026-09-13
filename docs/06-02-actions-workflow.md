# 06-02. 테스트·빌드·Pages 워크플로 작성

**6. 배포 · 자동 검증과 배포**

이전: [06-01 배포 준비](06-01-deployment-setup.md) · [전체 목차](00-overview.md) · 다음: [06-03 배포 확인](06-03-deploy-and-check.md)

## 1. 설명

PR에서는 테스트와 빌드만 실행하고, `main` 반영 후에만 Pages에 배포합니다.
테스트 실패를 무시하거나 배포를 독립 실행하면 검증되지 않은 버전이 공개됩니다.
이번에는 **참가자가 Copilot app에 프롬프트를 입력해 자신의 게임 저장소에 워크플로를 생성**합니다.
YAML을 직접 작성하거나 참고 샘플을 복사하는 것이 필수는 아닙니다.
생성할 워크플로는 검사·빌드 job 성공을 배포의 필수 조건으로 둡니다.
수동 실행도 `main`에서만 배포하며 PR에는 배포 토큰 권한을 주지 않습니다.

## 2. 시작 상태

- [ ] Pages Source가 GitHub Actions이고 `github-pages` 환경은 `main`을 허용한다.
- [ ] 05단계의 테스트와 빌드가 통과했고 잠금 파일이 있다.
- [ ] 현재 세션은 기능 브랜치이며 원격 푸시 전이다.
- [ ] **Plan** 모드에서 아래 설계를 검토한다.

## 3. 실행: 검토 후 파일 작성

아래 **텍스트 프롬프트 블록만** Copilot app의 게임 작업 세션에 복사합니다.
GitHub에서 읽는 안내서와 참고 YAML은 app 대화에 자동 전달되지 않습니다.
계획 프롬프트에는 필요한 조건을 모두 포함하며, 승인 프롬프트는 같은 세션에서 검토한 계획을 참조합니다.

### 3-1. Plan에서 배포 계획 요청

```text
내가 이 저장소에서 완성한 Space Invaders 게임을
GitHub Actions로 GitHub Pages에 배포할 계획을 제안해줘.
배포 대상은 현재 참가자 게임 저장소이며 실습 안내 저장소가 아니다.
완성 YAML이나 외부 템플릿을 제공하지 않으므로 현재 프로젝트와 아래 조건으로 설계해줘.

AGENTS.md, PRD.md, TRD.md, TEST_RESULTS.md, package.json과 잠금 파일,
Vite·Playwright 설정, 기존 .github/workflows 파일을 읽기 전용으로 확인해줘.
필수 파일이 없거나 설정이 조건과 다르면 임의로 바꾸지 말고 차이를 알려줘.

- 생성할 파일은 저장소 루트 기준 .github/workflows/pages.yml이다.
- 워크플로 이름은 Check and deploy Pages로 한다.
- main 대상 pull_request에서는 테스트·빌드만 실행한다.
- main push 또는 main에서의 workflow_dispatch만 Pages 배포를 허용한다.
  다른 브랜치의 수동 실행과 PR은 아티팩트 업로드·배포를 하지 않는다.
- Ubuntu runner와 Node.js 24를 사용하고 잠금 파일로 npm ci를 실행한다.
- npm test → npx playwright install --with-deps chromium →
  npm run test:e2e → npm run build 순서로 실행한다.
  실제 scripts와 Chromium 프로젝트·webServer 수명 관리가 맞는지 확인한다.
- Vite base는 './'이며 dist의 게임 빌드 결과만 Pages 아티팩트로 올린다.
  저장소 전체, 개발 문서, 테스트, node_modules는 배포하지 않는다.
- build와 deploy job을 분리하고 deploy는 needs: build로 성공한 빌드에 의존한다.
  실패를 continue-on-error나 always()로 무시하지 않는다.
- 기본 권한은 contents: read로 하고 deploy에만 pages: write와 id-token: write를 준다.
  pull_request_target이나 개인 액세스 토큰을 사용하지 않는다.
- actions/configure-pages, actions/upload-pages-artifact, actions/deploy-pages를 사용한다.
- 배포 환경은 github-pages이며 실제 배포 출력 page_url을 환경 URL로 연결한다.
- deploy job의 concurrency 그룹은 pages-deployment, cancel-in-progress는 false로 한다.
  PR 검사가 진행 중 배포를 취소하지 않게 한다.

내가 GitHub 웹에서 확인한 Pages Source는 GitHub Actions이며,
github-pages 환경의 배포 브랜치는 main으로 제한하는 실습이다.
실제 원격 설정을 확인하지 못하면 미확인이라고 구분해줘.
변경할 파일, 각 조건의 구현 방법, 로컬 확인 명령과
내가 직접 확인할 원격 설정을 제시해줘.
파일 수정·설치·커밋·푸시·PR·원격 설정 변경·배포는 하지 말고 승인을 기다려줘.
```

계획이 현재 게임의 scripts·빌드 경로와 맞는지 확인한 후 **Interactive**로 전환합니다.
세션이 바뀌어 승인할 계획을 찾을 수 없다면 계획부터 다시 확인합니다.

### 3-2. 승인 후 워크플로 생성 요청

```text
방금 검토한 GitHub Actions → GitHub Pages 배포 계획을 승인한다.
AGENTS.md와 현재 게임의 package.json·잠금 파일·Vite·Playwright 설정을 다시 읽고,
참가자 게임 저장소 루트의 .github/workflows/pages.yml을 생성해줘.
대화에서 승인한 계획을 찾을 수 없으면 추정하지 말고 다시 요청해줘.
기존 파일이 있으면 덮어쓰지 말고 승인한 변경만 반영해줘.

워크플로 이름 Check and deploy Pages, PR은 테스트·빌드만,
main push/main 수동 실행만 배포, Node24와 npm ci,
Node 테스트·Chromium 설치·E2E·빌드 순서를 유지해줘.
dist만 업로드하고 deploy는 성공한 build에 의존하게 해줘.
기본 contents: read, deploy의 pages: write/id-token: write,
github-pages 환경과 실제 page_url, deploy에만 배포 동시성 제어를 적용해줘.
Vite 상대 경로와 기존 게임 요구사항을 유지하고 개인 토큰을 요구하지 마.

필요한 관련 설정 수정은 방금 승인한 범위에서만 하고 문서에 이유를 반영해줘.
로컬 테스트·빌드 실행을 허용한다. 누락된 의존성은 잠금 파일로 복원하고,
브라우저 누락 시 설치된 Playwright로 Chromium을 설치해줘.
생성한 파일 내용·diff, 조건별 반영 위치, 실제 로컬 실행 결과를 보여줘.
미수행 원격 Actions와 공개 URL 확인을 완료라고 말하지 마.
커밋·푸시·PR·병합·원격 설정 변경·배포는 하지 말고 검토를 기다려줘.
```

### 생성 결과 비교용 참고 YAML

**이 YAML은 프롬프트에 반드시 붙여 넣어야 하는 입력이나 직접 복사할 정답이 아닙니다.**
에이전트가 생성한 참가자 저장소의 `.github/workflows/pages.yml`을 비교·점검하는 예시입니다.
표현이나 step 이름이 달라도 승인 조건을 만족하면 됩니다. 실습 안내 저장소의 파일을 바꾸는 요청이 아닙니다.

```yaml
name: Check and deploy Pages

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run build
      - name: Upload Pages artifact
        if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    concurrency:
      group: pages-deployment
      cancel-in-progress: false
    steps:
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

워크플로 전체가 아니라 **배포 job에만** Pages 쓰기와 OIDC 권한을 둡니다.
PR에는 `pull_request_target`을 쓰지 않고 기본 읽기 권한만 부여합니다.
배포 동시성 그룹은 deploy job에만 있어 PR 검사가 진행 중 배포를 취소하지 않습니다.
브라우저 테스트 설정도 Chromium을 선택해야 하며 다른 브라우저 실행을 요구하지 않습니다.
`npm test`는 `tests/*.test.js`를 선택하고 Playwright 파일을 중복 수집하지 않아야 합니다.

### 예상 결과

- 워크플로 파일과 승인 범위 안의 관련 설정 diff.
- `npm test`, `npm run test:e2e`, `npm run build`의 실제 로컬 결과.
- `dist`에는 게임 실행 파일만 있고 문서·샘플·테스트가 없는 상태.
- 아직 GitHub Actions 실행 증거나 공개 배포 URL은 없음.

## 4. 함께 점검·확인

| 점검 | 충족 기준 |
|---|---|
| 실패 차단 | `continue-on-error`나 `always()`로 배포하지 않고 `needs: build` 사용 |
| 이벤트 분리 | PR은 검증만, main push·main 수동 실행만 업로드·배포 |
| 경로 | Vite `base: './'`, artifact `path: dist` |
| 권한 | 저장소 전체 쓰기가 아닌 deploy의 Pages·OIDC 권한 |
| 설치 | 잠금 파일과 `npm ci`, CI Chromium은 `--with-deps` |
| 증거 | 로컬 YAML 검토와 실제 원격 실행 성공을 구분 |

```text
생성한 .github/workflows/pages.yml과 실제 게임 설정을 읽기 전용으로 대조해줘.
승인한 계획의 조건마다 YAML의 어느 job/step/조건에 반영했는지 보여줘.
PR, main push, main 수동 실행, 다른 브랜치 수동 실행 각각에서
테스트·빌드·업로드·배포 중 무엇이 실행되는지 표로 설명해줘.
게임의 dist만 Pages에 배포하는지, 검증 실패 시 배포가 차단되는지,
Pages 설정은 참가자의 GitHub 웹 확인이 별도로 필요한지 점검해줘.
충족/보완 필요/미확인으로 구분하고 파일 변경·원격 실행 없이 기다려줘.
```

참가자는 실제 파일이 **자신의 게임 저장소**에 생성되었는지 확인합니다.
GitHub의 Pages Source 설정과 이 워크플로 파일이 모두 준비되어야 다음 배포 단계로 이동합니다.

## 5. 보완과 재확인

```text
검토에서 지적된 워크플로 문제만 수정해줘.
테스트 실패를 무시하거나 Pages 권한을 전체 job으로 넓히지 마.
누락된 스크립트·잠금 파일·Chromium 설정은 원인을 설명하고 승인 범위에서 보완해줘.
변경에 해당하는 로컬 검사와 테스트·빌드를 다시 실행하고 실제 결과를 기록해줘.
원격 Actions 검증은 아직 미수행으로 남기고 푸시하지 마.
```

YAML 파싱이나 로컬 테스트만으로 GitHub 권한·환경 설정까지 검증되지는 않습니다.
실패 차단을 실험하려고 고의로 깨진 테스트를 원격에 올리지는 않습니다.
필요하면 별도 승인 후 로컬에서 실패를 확인하고 원복·재검증합니다.

## 6. 완료 승인

```text
워크플로 diff와 로컬 검증 결과를 승인한다.
승인 파일만 로컬 커밋해줘. 메시지는 한국어의 구체적인 제목과 본문으로 작성해줘.
제목 예시: '06-02: 테스트와 빌드 통과 후에만 Pages를 배포하도록 자동화 구성'
본문에 단계 ID 06-02, 변경 내용·이유, 실제 검증 결과와 미확인 범위를 적어줘.
미수행 원격 검증은 통과라 쓰지 마.
푸시·PR 생성·병합은 하지 말고 다음 실습을 기다려줘.
```

권한·아티팩트·환경의 근거: [Pages 사용자 정의 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

---

이전: [06-01 배포 준비](06-01-deployment-setup.md) · [전체 목차](00-overview.md) · 다음: [06-03 배포 확인](06-03-deploy-and-check.md)
