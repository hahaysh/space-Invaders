# 06-02. 테스트·빌드·Pages 워크플로 작성

**6. 배포 · 자동 검증과 배포**

이전: [06-01 배포 준비](06-01-deployment-setup.md) · [전체 목차](00-overview.md) · 다음: [06-03 배포 확인](06-03-deploy-and-check.md)

## 1. 설명

PR에서는 테스트와 빌드만 실행하고, `main` 반영 후에만 Pages에 배포합니다.
테스트 실패를 무시하거나 배포를 독립 실행하면 검증되지 않은 버전이 공개됩니다.
아래 워크플로는 검사·빌드 job 성공을 배포의 필수 조건으로 둡니다.
수동 실행도 `main`에서만 배포하며 PR에는 배포 토큰 권한을 주지 않습니다.

## 2. 시작 상태

- [ ] Pages Source가 GitHub Actions이고 `github-pages` 환경은 `main`을 허용한다.
- [ ] 05단계의 테스트와 빌드가 통과했고 잠금 파일이 있다.
- [ ] 현재 세션은 기능 브랜치이며 원격 푸시 전이다.
- [ ] **Plan** 모드에서 아래 설계를 검토한다.

## 3. 실행: 검토 후 파일 작성

```text
AGENTS.md, TRD.md, 테스트 설정과 package.json을 읽고 Pages CI 계획을 제안해줘.
아래 안내의 YAML과 현재 프로젝트가 맞는지 읽기 전용으로 검토해줘.
Node 24, npm ci, Node 테스트, Playwright Chromium e2e, Vite build 순서로 검증한다.
PR은 검증만, main push와 main에서의 workflow_dispatch만 배포한다.
Vite base './'와 dist 출력, e2e 서버의 CI 종료 동작도 점검해줘.
필요한 파일 변경과 로컬 확인 명령을 제시하고 승인 전에는 변경하지 마.
```

참가자가 계획을 승인한 후 **Interactive**로 전환합니다.

```text
검토한 계획을 승인한다. .github/workflows/pages.yml을 작성해줘.
아래 YAML을 기준으로 사용하되 기존 파일이 있으면 덮어쓰지 말고 차이를 검토해줘.
필요한 관련 설정 수정은 방금 승인한 범위에서만 하고 문서에 이유를 반영해줘.
로컬 테스트·빌드 실행을 허용한다. 누락된 의존성은 잠금 파일로 복원하고,
브라우저 누락 시 Chromium을 설치해줘. 푸시·PR·원격 실행은 하지 마.
실행 결과와 diff를 보여주고 기다려줘.
```

### 완전한 워크플로 예시

참가자 저장소의 `.github/workflows/pages.yml` 내용입니다.
실습 안내 저장소의 파일을 바꾸는 요청이 아닙니다.

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
