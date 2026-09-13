# Space Invaders 참고 샘플

[실습 전체 목차](../../docs/00-overview.md) · [출처와 확인 범위](../../REFERENCES.md)

이 폴더에는 실습의 공통 경로를 따라 생성한 **최초 버전과 개선 버전**을 독립적으로 실행할 수 있는 프로젝트로 보관합니다. 샘플을 복사해서 시작하는 것은 기본 실습 경로가 아닙니다.

> 현재 샘플 구현 준비 중입니다. 아래 경로와 실행 절차는 샘플 완성 후 해당 검증 기록과 함께 확인해야 합니다.

## 두 체크포인트

| 경로 | 대응 단계 | 포함할 결과 |
|---|---|---|
| `first-release` | 01~06 | 최초 문서, 게임, 테스트, Pages 워크플로 |
| `improved-release` | 07 | 일시정지·재개 변경 요청, 수정된 문서·코드·테스트·워크플로 |

`release`라는 폴더명은 실습상의 버전 구분이며, GitHub Release를 생성하거나 실제 인터넷 배포를 마쳤다는 의미가 아닙니다. 원격 배포 여부는 각 프로젝트의 `TEST_RESULTS.md`로 확인합니다.

## 실행 방법

Node.js 24 LTS 환경에서 한 번에 한 샘플을 선택합니다. 아래 PowerShell 명령은 **이 실습 안내 저장소의 루트**에서 실행하는 예입니다. Copilot app에서 에이전트에게 해당 경로를 지정해 실행을 요청해도 됩니다.

```powershell
Set-Location .\src\game-samples\first-release
npm ci
npx playwright install chromium
npm test
npm run test:e2e
npm run build
npm run dev -- --host 127.0.0.1
```

개선 버전은 첫 줄의 경로를 `.\src\game-samples\improved-release`로 바꿉니다. 서버가 출력하는 실제 URL을 열고, 사용 후 해당 서버만 종료합니다.

의존성은 프로젝트별로 설치합니다. 샘플의 `node_modules`, `dist`, Playwright 결과 파일은 저장소에 커밋하지 않습니다.

## 비교하면서 읽기

1. 각 버전의 `PRD.md`에서 REQ-01~08을 읽습니다.
2. `TRD.md`에서 요구사항을 어떤 구조로 구현했는지 확인합니다.
3. `IMPLEMENTATION_PLAN.md`와 `TEST_PLAN.md`에서 작업과 테스트의 연결을 확인합니다.
4. `TEST_RESULTS.md`에서 실제 수행 결과와 미확인 항목을 구분합니다.
5. 개선 버전의 `CHANGE_REQUEST.md`와 CHG-01을 읽고 수정된 부분을 비교합니다.

소스 비교 예시입니다. 차이가 있으면 `git diff --no-index`는 종료 코드 1을 반환하며, 이는 테스트 실패라는 뜻이 아닙니다.

```powershell
git diff --no-index -- .\src\game-samples\first-release\src\game.js .\src\game-samples\improved-release\src\game.js
```

기능 변경이 없던 문서는 억지로 수정하지 않습니다. 예를 들어 일시정지를 추가해도 게임 콘셉트나 에이전트 작업 규칙이 그대로라면 해당 문서는 동일할 수 있습니다.

## 배포 설정의 위치

각 샘플의 `.github\workflows\pages.yml`은 **그 샘플을 독립적인 저장소 루트에서 사용할 경우**의 배포 설정입니다. 이 폴더 안에 있는 상태로는 현재 안내 저장소의 Actions 워크플로로 자동 실행되지 않습니다.

실습 참가자는 자신의 저장소 루트에서 문서·코드·워크플로를 생성합니다. 배포 전에 GitHub Pages 소스를 GitHub Actions로 선택하고, 브랜치·권한·공개 범위를 확인해야 합니다. 배포 아티팩트는 `dist`만 사용합니다.

## 참고 결과이지 정답이 아닙니다

에이전트 출력은 달라질 수 있습니다. 함수 이름이나 문서 표현보다 다음을 기준으로 점검합니다.

- 요구사항과 실제 동작이 일치하는가?
- 최초 버전에 개선 기능을 미리 구현하지 않았는가?
- 개선 후에도 기존 테스트와 게임 규칙을 유지하는가?
- 테스트 통과를 실제 app 조작 또는 공개 배포 성공으로 바꾸어 말하지 않는가?

샘플은 원본 게임 파일을 복사하지 않고 새로 구현합니다. 실제 수행 환경과 리허설 방식은 완성 시 이 문서와 각 검증 기록에 명시합니다.
