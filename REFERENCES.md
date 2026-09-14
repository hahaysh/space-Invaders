# 참고 자료와 확인 범위

조사 기준일: 원본 2026-09-13, App 설정·Skill 및 v2 정리 2026-09-14

[현재 v2 목차](docs/00-전체-실습-안내.md) · [저장소 안내](README.md)

## 원본 저장소

- 저장소: [Microsoft Build26 LAB502](https://github.com/microsoft/Build26-LAB502-make-github-copilot-work-your-way-custom-tools-context-and-workflows)
- 분석 기준 커밋: [`763f9fec1caefd2d4660e0dd7e9308bc80aa41cd`](https://github.com/microsoft/Build26-LAB502-make-github-copilot-work-your-way-custom-tools-context-and-workflows/tree/763f9fec1caefd2d4660e0dd7e9308bc80aa41cd)

원본의 안내문을 순서대로 번역하는 작업이 아닙니다. 계획 승인, 반복 수정, 지속적인 작업 지침 등의 아이디어를 참고해 **Copilot app에서 문서 기반으로 게임을 개발하고 배포하는 새 시나리오**를 작성합니다.

## 원본과 새 실습의 대응

아래 경로는 위 기준 커밋의 원본 저장소 기준입니다.

| 원본 경로 | 확인한 내용 | 새 실습에서의 처리 |
|---|---|---|
| `docs/00-intro.md` | 게임 생성과 커스터마이징 학습 목표 | 도구 체험보다 문서 기반 개발 사이클 중심으로 재설계 |
| `docs/01-setting-up-the-environment.md` | 로컬 Git·Copilot CLI 준비 | Public 저장소 생성과 app 프로젝트·세션 준비로 대체 |
| `docs/02-installing-the-community-plugin.md` | Marketplace·Plugin 설치 | 기본 과정의 필수 설치에서 제외 |
| `docs/03-generating-the-space-invaders-game.md` | 계획·명확화·승인·단일 HTML 생성 | 아이디어·PRD·TRD·계획·구현으로 분리 |
| `docs/04-screenshot-sharing.md` | Playwright 캡처와 Hub 공유 | 실행 결과 확인을 활용하되 자동 외부 업로드는 제외 |
| `docs/05-exploring-copilot-customizations.md` | VS Code 커스터마이징 화면 | app에서 확인된 기능만 안내 |
| `docs/06-creating-instructions.md` | 구현 후 저장소 지침 작성 | 구현 전 최소 `AGENTS.md` 작성, 설계 후 보완 |
| `docs/07-creating-a-skill.md` | HTML 업로드 Skill 작성 | 입력·검증·완료 기준의 개념 참고, Hub 업로드는 제외 |
| `docs/08-recap.md` | 커스터마이징 종류와 용도 | 필요한 개념만 정리 |
| `docs/self-paced-setup.md` | 개인 환경, Hub, 브라우저 준비 | app·게임·테스트에 필요한 의존성으로 축소 |
| `docs/bonus-01-copilot-cloud-agent.md` | 기능 요청, PR 검토, 수정 | 변경 요청과 검토 개념 참고, Cloud agent는 필수 아님 |
| `docs/bonus-02-using-an-mcp-server.md` | Hub MCP 연결과 도구 사용 | 선택적인 참고 자료 |
| `docs/bonus-03-creating-a-reusable-prompt.md` | 재사용 프롬프트 작성 | 반복 가능한 입력·출력·점검 형식 참고 |
| `src/game-samples/baseline-invaders.html` | Canvas, 게임 상태, 입력, 충돌, 시간 처리 | 개념 참고 후 두 독립적인 역사적 샘플 구현 |
| `src/plugins/space-invaders-makers` | Plugin·Agent·Skill·Hook 구현 | 역할과 외부 의존성 확인, 자동 설치·실행하지 않음 |
| `.github/extensions/lab502-community-canvas/extension.mjs` | app 안의 Community Hub 대시보드 | 게임의 Canvas 2D와 구분, 기본 과정에 복제하지 않음 |
| `docs/assets`, `img`, `src/game-samples/images` | 안내 화면·브랜딩·갤러리 이미지 | 게임 실행 필수 에셋이 아님, 일괄 복사하지 않음 |
| `.github/workflows/community-hub.yml` | Hub의 .NET CI | 게임의 Actions·Pages 워크플로는 새로 작성 |

원본의 모든 기본·보너스 실습 문서, Plugin 관련 구현과 기준 게임을 읽었습니다. 다른 게임 샘플은 주로 외부 의존성 및 일부 기능을 확인했으며, 모든 게임의 실행·정확성을 검증한 것은 아닙니다. 이미지 파일은 역할과 경로를 조사했으며 모든 이미지를 시각적으로 검토하지 않았습니다.

2026-09-14 추가한 [08 난이도 선택](docs/08-01-난이도-선택-설계.md)과 [09 목숨](docs/09-01-목숨-설계.md)는 사용자 아이디어를 바탕으로 새로 설계한 선택 확장입니다. 적 속도, 목숨 차감·재도전·점수 정책은 이 실습의 결정이며 원본의 규칙을 옮긴 것이 아닙니다. 이전 25개 실습의 demo01에서 확장까지 구현·배포했으며, 두 역사적 샘플에는 확장 기능이 없습니다. 현재 20개 실습 v2의 demo02 리허설은 대기 중입니다.

### 그대로 적용하지 않을 부분

- Community Hub는 공유·갤러리·활동 기록 서비스이며 브라우저 게임 실행에 필수적이지 않습니다.
- Plugin의 Hook에는 세션·도구 사용 등의 활동 전송이 포함됩니다. 참가자 동의 없이 설치하거나 활성화하지 않습니다.
- 원본의 안내와 실제 경로·설정에 차이가 있습니다. 예를 들어 실제 Plugin 경로는 `src/plugins/space-invaders-makers`입니다. 안내에 남은 다른 이름을 복사하지 않습니다.
- 단일 HTML이라는 이유만으로 외부 의존성이 없는 것은 아닙니다. 일부 원본 변형에는 CDN 라이브러리나 웹 폰트가 있습니다.
- 원본에는 이 실습의 PRD·TRD 작성 과정이나 게임용 Pages 배포 과정이 없습니다. 이를 원본에 있던 실습이라고 설명하지 않습니다.

## 공식 문서로 보완한 사항

| 자료 | 근거와 적용 범위 |
|---|---|
| [Copilot app 세션](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) | GitHub·로컬 폴더 프로젝트, 작업 공간 선택, Plan·Interactive·Autopilot, 파일 참조 |
| [Copilot app 커스터마이징](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app) | 지침 설정, Skill·Plugin·MCP 관리 |
| [App 저장소 설정](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/repository-configuration) | `.github/github-app.yml`, scripts의 name/command 목록, triggers 생략 시 수동, auto_open_in_browser, 외부 변경 review/accept |
| [Skill 작성 형식](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) | `.github/skills/game-check/SKILL.md`, name/description frontmatter; CLI 제목의 문서이며 CLI 명령을 App UI로 전용하지 않음 |
| [Agent Skills 개념과 지원](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | App을 포함한 지원 범위; 파일 작성과 실제 Skill 인식·호출은 따로 확인 |
| [Copilot app PR 관리](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests) | 세션에서 PR 요청과 변경 검토 |
| [Copilot app Canvas](https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions) | 공유 작업 화면의 개념과 확장 구조 |
| [CLI 지침 파일](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) | `AGENTS.md` 탐색 및 지침 변경의 세션 재적용 주의사항. app UI의 동작을 직접 검증한 자료는 아님 |
| [Pages 사용자 정의 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) | Pages 아티팩트 업로드·배포, 권한, 작업 의존성, 배포 환경 |
| [Pages 게시 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) | GitHub Actions를 게시 소스로 선택하는 설정과 공개 범위 |

## 실제 확인과 미확인 구분

원본 조사는 **공개 문서와 소스 확인**입니다. 별도의 실행 증거는 아래와 같이 구분합니다.

| 대상 | 실제 확인 | 경계 |
|---|---|---|
| 역사적 first-release | Node 35·Chromium 10, 빌드·하위 경로 | 로컬 샘플, 실제 원격 배포의 근거가 아님 |
| 역사적 improved-release | Node 42·Chromium 13, 빌드·하위 경로·P | 두 샘플에는 난이도·목숨 없음 |
| 이전 demo01 | 전체 25개 실습, 난이도·목숨, 공개 게임 | 자율 API 실행·직접 fast-forward 병합 예외 |
| 현재 v2 / demo02 | 전체 안내 1개·실습 20개 작성 | **새 리허설 대기 중**, 성공으로 간주하지 않음 |

demo01의 고정 근거:

- 공개 게임: <https://hahaysh.github.io/space-Invaders-demo01/>
- 최종 main: [`97cd3e1fca2face6bf84c034412ae31a60fa6056`](https://github.com/hahaysh/space-Invaders-demo01/commit/97cd3e1fca2face6bf84c034412ae31a60fa6056)
- [Actions 34793874053](https://github.com/hahaysh/space-Invaders-demo01/actions/runs/34793874053): Node 33·Chromium 28·빌드·배포 성공
- 이전 고정 안내서: [`c545b103`](https://github.com/hahaysh/space-Invaders/tree/c545b103/docs), **역사적 기준**이지 현재 v2 소스가 아님

위 이력은 보존하며 demo01이나 샘플 코드·테스트·역사적 제목을 v2에 맞춰 재작성하지 않습니다.
사람의 빈 저장소 App 시작·전체 App/PR UI 승인 경로와 AGENTS 자동 로딩은 미검증입니다.
명시적으로 AGENTS를 읽게 한 실행을 자동 적용의 증거로 제시하지 않습니다.
App 설정의 신뢰 수락·수동 실행, Skill 인식·실제 호출도 새 대상 App에서 확인해야 합니다.
직접 읽기 대체 실행은 가능하지만 Skill 통합 성공이라고 기록하지 않습니다.
긴 테스트 정지의 호스트 원인은 아직 미확정입니다. 철회한 외부 스크립트 의심은 실제 결함이 아니었습니다.

v2에서는 문서 PR → 기본 게임 PR → 검증·배포 PR을 구분하고 개선마다 최신 main의 새 이슈 세션을 엽니다.
직접 fast-forward 예외를 참가자 경로로 사용하지 않으며 필요한 사람의 PR·환경 승인을 유지합니다.
실행 횟수·테스트 수를 맞추는 대신 실제 필수 동작과 공개 URL을 확인합니다.
공개 증거는 이슈 댓글에 즉시 보존하고, 파일의 로컬/원격 상태를 구분해 기록 PR 반복을 막습니다.
자세한 샘플 실행 이력은 [샘플 안내](src/game-samples/README.md)와 해당 `TEST_RESULTS.md`에 있습니다.

## 출처·라이선스 처리

원본에는 [MIT LICENSE](https://github.com/microsoft/Build26-LAB502-make-github-copilot-work-your-way-custom-tools-context-and-workflows/blob/763f9fec1caefd2d4660e0dd7e9308bc80aa41cd/LICENSE)와 [CC BY-SA 4.0 LICENSE-DOCS](https://github.com/microsoft/Build26-LAB502-make-github-copilot-work-your-way-custom-tools-context-and-workflows/blob/763f9fec1caefd2d4660e0dd7e9308bc80aa41cd/LICENSE-DOCS)가 있습니다. 개별 에셋의 권리 범위를 모두 확인한 것은 아닙니다.

현재 안내서와 샘플은 원본의 아이디어와 구조를 참고한 새 설명·구현이며, 원본 게임 코드·이미지·Plugin 파일·본문을 복사하거나 번역해 포함하지 않았습니다. 저장소에 포함한 화면 이미지는 새 샘플의 실제 로컬 빌드를 촬영한 것입니다. 이후 실제 재사용이 생기면 파일별 출처와 변경 내용을 기록하고 해당 라이선스가 요구하는 고지를 유지합니다. 출처 링크만으로 라이선스 의무를 대신하지 않습니다.

Microsoft 및 제3자의 로고·캐릭터·행사 QR 이미지는 기본 샘플에 사용하지 않습니다. 참가자의 우주 방어도 직접 그린 도형과 자체 스타일을 사용합니다.
