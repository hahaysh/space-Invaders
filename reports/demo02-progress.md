# demo02 개선 실습 진행 기록

[저장소 안내](../README.md) · [전체 실습](../docs/00-전체-실습-안내.md)

## 실행 기준과 범위

- 대상: [hahaysh/space-Invaders-demo02](https://github.com/hahaysh/space-Invaders-demo02).
- 고정 안내서: [3637e1ad7897a2e674aa85cb8f3f6154da4b3907](https://github.com/hahaysh/space-Invaders/tree/3637e1ad7897a2e674aa85cb8f3f6154da4b3907/docs).
- 2026-09-14 사용자 위임으로 추천 선택지를 사용해 20개 단계를 순서대로 진행합니다.
- 이슈, 기능 브랜치, PR, 검사, Pages 배포를 실제로 수행합니다. 이전 demo01의 직접 main 반영 예외를 재사용하지 않습니다.
- demo01과 역사적 샘플은 수정하거나 시작 코드로 복사하지 않습니다. 게임 제목은 **우주 방어**이며 적의 공격은 추가하지 않습니다.
- 도구 대행과 사람의 App UI 조작을 구분합니다. App 설정 수락, Skill 호출, 자동 지침 적용은 각각 실제 확인 근거가 있어야 합니다.

**현재 상태:** 08-01까지 **17/20단계(85%)**입니다. 08-02 난이도 구현·Skill 재사용·검사·PR 정상 병합을 마쳤고, main 배포와 실제 공개 확인을 진행합니다. App 설정 수락·Run UI는 아래와 같이 미확인입니다.

**[demo02 공개 게임 실행](https://hahaysh.github.io/space-Invaders-demo02/)** — 일시정지·재개는 공개 확인을 마쳤습니다. 난이도는 배포 확인 중이며 목숨은 아직 구현 전입니다.

## 단계별 진행

이 표는 조정자가 받은 실행 보고를 바탕으로 갱신합니다. 완료 행에는 참가자 저장소의 커밋·이슈·PR 또는 실제 배포 근거를 연결합니다. 검사 결과와 공개 사이트 확인은 별도로 기록합니다.

| 단계 | 실습 | 상태 | 산출물·근거 |
|---|---|---|---|
| 01-01 | 실습 환경 준비 | 완료 | [기준 23f9d7b](https://github.com/hahaysh/space-Invaders-demo02/commit/23f9d7b6f3555a1979d88b9f8c21d085264bf024), 원문 대조·App 문서 브랜치 준비 |
| 01-02 | 개발 문서와 작업 규칙 | 완료 | `AGENTS.md`, [cae937f](https://github.com/hahaysh/space-Invaders-demo02/commit/cae937f); 문서 PR로 main 반영 |
| 02-01 | 게임 아이디어 | 완료 | `ideation.md`, [72fa938](https://github.com/hahaysh/space-Invaders-demo02/commit/72fa938); 두 테마 비교 후 우주 방어 선택 |
| 02-02 | 요구사항 작성 | 완료 | `PRD.md`, [36d74e2](https://github.com/hahaysh/space-Invaders-demo02/commit/36d74e2); 공통 수치와 R01~R10 수용 기준 |
| 02-03 | 기술 설계 | 완료 | `TRD.md`, [e76acf8](https://github.com/hahaysh/space-Invaders-demo02/commit/e76acf8); 구조·입력·시간·검증·배포 설계 |
| 03-01 | 문서 점검과 이슈 등록 | 완료 | [문서 PR](https://github.com/hahaysh/space-Invaders-demo02/pull/1) 정상 병합 → [기본 게임 이슈](https://github.com/hahaysh/space-Invaders-demo02/issues/2) → 새 App 세션 |
| 04-01 | 첫 게임 구현 | 완료 | [구현 705303d](https://github.com/hahaysh/space-Invaders-demo02/commit/705303d), [기록 f3ca87f](https://github.com/hahaysh/space-Invaders-demo02/commit/f3ca87fc008aa72b5ecc7cd0891cf4fda291c770), [실행 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/2#issuecomment-5658643378) |
| 04-02 | 핵심 게임 완성 | 완료 | [d7e987d](https://github.com/hahaysh/space-Invaders-demo02/commit/d7e987d86be42035c837ddfc5d3b9a4bb708c919), [실행 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/2#issuecomment-5658733501); 승리·자연 패배·재시작 |
| 04-03 | App 설정과 README | 수행 완료·UI 미확인 | [기본 게임 PR](https://github.com/hahaysh/space-Invaders-demo02/pull/3), [병합 4c416e8](https://github.com/hahaysh/space-Invaders-demo02/commit/4c416e85e6235eb66744b1867248ca5623fec53a), [실행 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/2#issuecomment-5658791937) |
| 05-01 | 게임 검증과 Skill | 완료 | [검증·배포 이슈](https://github.com/hahaysh/space-Invaders-demo02/issues/4), [e8b102b](https://github.com/hahaysh/space-Invaders-demo02/commit/e8b102b4a3afe367d6460af5b306fb3a3f5aa33e), [완료 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/4#issuecomment-5659060325) |
| 05-02 | 결함 수정과 회귀 검증 | 완료 | [f79cdef](https://github.com/hahaysh/space-Invaders-demo02/commit/f79cdef0bc5dfdbf3edd49837fda36efe7b933f7), [결과 분류](https://github.com/hahaysh/space-Invaders-demo02/issues/4#issuecomment-5659079469); 제품 수정 필요 없음 |
| 06-01 | Pages 배포 준비 | 완료 | [df372f2](https://github.com/hahaysh/space-Invaders-demo02/commit/df372f230298ef6518fd422287441aac8d4505fc), [설정 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/4#issuecomment-5659123635); workflow 게시·main 브랜치만 허용 |
| 06-02 | 배포 워크플로 | 완료 | [7a3abfa](https://github.com/hahaysh/space-Invaders-demo02/commit/7a3abfa1c9d85deb45a51cc24b936767bd6efc3a), [검사 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/4#issuecomment-5659234160); 정책·문법·로컬 검사 |
| 06-03 | PR과 첫 배포 | 완료 | [배포 PR](https://github.com/hahaysh/space-Invaders-demo02/pull/5), [기록 PR](https://github.com/hahaysh/space-Invaders-demo02/pull/6), [최종 확인](https://github.com/hahaysh/space-Invaders-demo02/issues/4#issuecomment-5659560168) |
| 07-01 | 일시정지 요청과 설계 | 완료 | [일시정지 이슈](https://github.com/hahaysh/space-Invaders-demo02/issues/7), [7300acc](https://github.com/hahaysh/space-Invaders-demo02/commit/7300acc21ff09a2d6b11fac46b96f06ab5572e95), [설계 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/7#issuecomment-5659623489) |
| 07-02 | 일시정지 구현과 재배포 | 완료 | [개선 PR](https://github.com/hahaysh/space-Invaders-demo02/pull/8), [main 배포](https://github.com/hahaysh/space-Invaders-demo02/actions/runs/34812636787), [공개 완료 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/7#issuecomment-5659849823) |
| 08-01 | 난이도 선택 설계 | 완료 | [난이도 이슈](https://github.com/hahaysh/space-Invaders-demo02/issues/9), [9cdd019](https://github.com/hahaysh/space-Invaders-demo02/commit/9cdd019c71efd11e7441979b700340a518bd0f23), [설계 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/9#issuecomment-5659950510) |
| 08-02 | 난이도 구현과 재배포 | PR 병합·공개 확인 중 | [난이도 PR](https://github.com/hahaysh/space-Invaders-demo02/pull/10), [PR CI](https://github.com/hahaysh/space-Invaders-demo02/actions/runs/34815166265), [구현·검사 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/9#issuecomment-5660172636) |
| 09-01 | 목숨 설계 | 대기 | - |
| 09-02 | 목숨 구현과 재배포 | 대기 | - |

## 착수 시 확인

연결 전 demo02는 Public·ADMIN·빈 저장소이며 원격 브랜치가 없었습니다. App 프로젝트·격리 세션 생성 후에는 파일 없는 [기준 커밋 23f9d7b](https://github.com/hahaysh/space-Invaders-demo02/commit/23f9d7b6f3555a1979d88b9f8c21d085264bf024)과 원격 main이 관찰됐습니다. 자동 생성의 정확한 내부 UI 동작은 단정하지 않으며 기존 이력을 보존합니다.

준비 확인에서 Git 2.53.0.windows.4, Node 24.14.1, npm 10.8.3, 깨끗한 작업 상태와 공통 기준 커밋을 확인했습니다. 당시 개발 포트 5173과 미리보기 포트 4173은 비어 있었습니다. 준비 대기는 안내서 확정을 위한 것이었으며 사용자 승인이나 실행환경 오류 때문이 아니었습니다.

## 기록 정책

단계별 변경과 실제 확인 결과는 demo02의 문서 커밋, 구현 계획, 테스트 결과와 관련 이슈 댓글에 보존합니다. 이 문서는 그 근거를 모으는 색인입니다. 실패·미확인·운영 예외도 남기며, 기록을 위해 같은 코드의 재배포와 기록 PR을 무한 반복하지 않습니다.

03-01에서는 문서 PR 병합 결과 `1de6e84915cfa8cf7cac4437ee1a280ce8996236`을 확인한 뒤 기본 게임 이슈에서 새 작업 세션을 만들었습니다. 새 세션은 HEAD·origin/main·원격 main·공통 조상이 모두 같은지, 네 설계 문서가 실제로 있는지 확인했습니다. [이슈의 인계 기록](https://github.com/hahaysh/space-Invaders-demo02/issues/2#issuecomment-5658543731)을 보존하며, 이후 코드는 새 세션만 작성하고 조정자는 중복 수정하지 않습니다. 사람의 App/PR UI 조작과 AGENTS 자동 적용은 별도 미확인입니다.

04-01에서는 구현 계획과 20단계 진행표를 먼저 작성한 뒤 M1을 구현했습니다. 실제 `npm ci`, Node 8개, Chromium 입력·DOM·Canvas 검사 5개와 빌드가 통과했고 별도 실제 시간 화면을 확인했습니다. 발견한 favicon 404와 잠금 파일의 환경 미러·자기 링크 문제는 해결하고 실패 기록을 보존했습니다. 원격 기능 브랜치와 작업 HEAD는 `f3ca87f`로 일치하며 깨끗한 상태를 보고했습니다. 이 시점에는 소유 개발 서버 PID 17652만 유지합니다. 사람의 직접 조작·지침 자동 적용·실제 OS 탭 비표시 동작은 미확인이고 합성 검사와 구분합니다.

04-02에서는 같은 이슈 세션에서 적 편대·충돌·점수·승패·재시작을 추가했습니다. Node 19개, Chromium 8개와 빌드가 통과했습니다. 기존 M1 회귀, 실제 키 입력과 제어 시간을 사용한 240점 승리·자연 패배·종료 화면 동결·반복 재시작을 확인했고 일반 시간 입력 화면도 확인했습니다. 원격 커밋은 `d7e987d`이며 작업 상태는 깨끗합니다. 다음 세션으로 넘기기 전 소유 서버·브라우저를 종료하도록 요청했으며, 이 시점에는 종료 완료를 아직 주장하지 않습니다.

04-03에서는 README·수동 App 설정 파일을 만들고 기본 게임 PR의 변경 내용·base·리뷰 상태·로컬 결과를 확인한 뒤 정상 병합했습니다. 원격 main의 코드·README·설정·계획 파일을 확인했습니다. Node 19개, Chromium 8개, 빌드와 preview 실제 입력은 통과했지만 CI는 아직 구성 전입니다. App 창 상태 확인 도구가 안전 정책으로 거부되어 설정 검토·수락과 App Run UI는 미확인으로 남겼으며 우회하지 않았습니다. 파일 생성이나 셸 명령 성공을 App UI 동작 성공으로 대체하지 않습니다. 소유 dev/preview 프로세스 종료·5173/4173 포트 해제·Playwright 탭 닫힘은 확인했고, 내장 browser canvas 패널 닫힘 자체만 미확인입니다.

05-01에서는 최신 main에서 검증·첫 배포 이슈의 새 App 세션을 열고 테스트 계획·결과와 Skill을 작성했습니다. Node 19개, Chromium 8개, 빌드, 루트·저장소 하위 경로의 실제 입력과 dist 자산 네 개의 바이트 일치를 확인했습니다. 생성 직후 기존 세션에서는 Skill 호출이 `not found`로 실패해 완료 처리를 보류했습니다. 커밋된 같은 기능 브랜치를 기준으로 새 읽기·검사 전용 세션을 열자 시작 목록에서 `game-check`를 발견했고 첫 `functions.skill` 호출이 실제로 성공했습니다. [로드·실행 근거](https://github.com/hahaysh/space-Invaders-demo02/issues/4#issuecomment-5659022509)를 기존 작성자가 문서에 반영해 원격 `e8b102b`로 게시했습니다. 최초 실패를 보존하며, 새 세션의 명시적 Skill 호출과 무요청 자동 적용·사람의 App UI 승인을 구분합니다. 검사 세션의 추적 파일은 변경하지 않았고 소유 서버·탭을 종료했습니다.

05-02에서는 R01~R10의 실제 근거를 대조하고 제품 결함·검사 누락·환경 문제·도구 제약을 구분했습니다. 제품 차단이나 필수 근거 누락이 없고 코드 등이 변경되지 않았음을 확인해, 가상 결함을 만들거나 같은 검사를 중복 실행하지 않고 결과 기록만 갱신했습니다. 원격 `f79cdef`, 깨끗한 작업 상태와 빈 개발·미리보기 포트를 확인했습니다. 사람의 직접 확인과 App UI 미확인은 제품 검사 통과로 덮지 않습니다.

06-01에서는 demo02의 Public·ADMIN 권한과 공개될 추적 파일 범위를 확인하고 Pages의 `build_type=workflow`를 설정했습니다. `github-pages` 환경은 기존에 없었으며 `main` 브랜치 한 개만 허용하는 정책을 만들고 다시 조회했습니다. 기존 승인자나 대기 시간을 삭제하지 않았습니다. 설정 기록은 원격 `df372f2`에 보존했고 작업 상태는 깨끗합니다. 이 시점에는 워크플로와 배포가 없으므로 Pages URL은 설정값일 뿐 공개 성공의 근거가 아닙니다. 사람의 설정 UI 조작은 도구 대행과 구분합니다.

06-02에서는 공식 Action의 release·tag를 실제 조회해 전체 SHA를 고정한 Pages 워크플로를 작성했습니다. 이벤트 여덟 경로의 정책, actionlint와 Git Bash 문법, Node 19개·Chromium 8개·빌드를 확인했습니다. PR은 검사만 수행하고 main만 아티팩트 업로드·배포하도록 구분했으며 최소 권한·배포 직렬화·main 전용 환경을 유지했습니다. 원격 기록 `7a3abfa`, 깨끗한 작업 상태와 소유 서버 종료를 확인했습니다. 이 단계에서 원격 Actions는 아직 실행되지 않았으므로 로컬 정책 검사로 원격 CI 성공을 대신하지 않습니다.

06-03의 첫 PR CI에서는 Node 검사가 통과했지만 Chromium 검사 8개 중 1개가 실패했습니다. 반복 패배·재시작 뒤 100ms 이동 관찰에서 Canvas 최소 x의 기대 상한 416에 실제 417이 관찰됐습니다. 빌드·업로드·배포는 건너뛰었고 PR은 병합하지 않았습니다. [실패 기록](https://github.com/hahaysh/space-Invaders-demo02/issues/4#issuecomment-5659265856)을 보존하고 실제 프레임 시간과 이동량을 대조해 재현·최소 수정·회귀·재CI를 진행합니다. 임의로 상한을 늘리거나 게임 속도를 바꾸지 않으며, 이 시점에는 해결 완료나 원인을 확정하지 않습니다. 권한·배포 환경 보호 문제로 보고된 실패는 아닙니다.

이후 실제 rAF의 96/112ms 관측을 근거로 이동량 검사를 프레임 시간 × PRD 속도와 Canvas의 floor/ceil 경계에 맞췄습니다. 제품 코드를 바꾸거나 고정 상한을 임의로 늘리지 않고 검사만 정밀화했습니다. 재CI `34808635152`에서 Node 19개·Chromium 8개·빌드가 통과했고 PR의 업로드·배포는 건너뛰었으며 아티팩트는 없었습니다. 리뷰·병합 가능 상태를 다시 확인한 뒤 PR을 정상 병합했습니다. 공개 동작 확인과 이후 기록 PR 한 번은 남아 있으며, 최초 실패 기록은 삭제하지 않습니다.

그 뒤 main `8898387`의 Actions `34809039826`에서 빌드·업로드·배포가 성공했습니다. 실제 공개 사이트의 HTML·JS·CSS·favicon 네 파일이 성공 아티팩트와 일치했고, 일반 시간의 실제 키·DOM·Canvas 관찰로 시작·이동·발사·점수·자연 승패·재시작·종료 동결을 확인했습니다. 읽기 전용 공개 검사에서 래스터 면적 기대 오류가 발생한 사실을 보존하고 적 24개의 연결 영역 검사로 확인했으며 제품 코드는 바꾸지 않았습니다. 조정자도 GitHub의 성공 상태·배포 SHA와 공개 페이지 응답을 재확인했습니다. 최신 main에서 새 기록 세션을 열어 README·결과의 기록 PR 한 번을 진행하며 기존 작성자는 중단하고 소유 서버·탭을 종료했습니다.

06-03 마무리에서는 기록 PR 하나를 정상 병합해 README의 실제 URL과 결과 요약을 원격 main `bda40293c959bb6af8c01147b105ebd17f2930ab`에 반영했습니다. [후속 Actions 34810372882](https://github.com/hahaysh/space-Invaders-demo02/actions/runs/34810372882)의 빌드·업로드·배포가 성공했고 최초·현재 아티팩트 네 파일과 공개 HTTP 200 응답의 바이트 일치를 확인했습니다. 일반 시간 키·DOM·Canvas로 기본 시작을 다시 확인한 뒤 검증·배포 이슈를 완료 종료했습니다. 추가 기록 PR을 만들지 않았으며 깨끗한 작업 상태와 소유 서버·탭 종료를 확인했습니다. 사람 UI와 App 신뢰 수락·Run·자동 적용의 미확인은 유지합니다.

07-01에서는 일시정지 이슈에서 최신 main 기반 새 App 세션·기능 브랜치 `hahaysh-space-defense-pause`를 준비했습니다. 코드 변경 없이 P 키·paused 상태·시간과 발사 대기 동결·재개 시 delta 초기화 및 기존 규칙 보존을 설계하고 원격 `7300acc`에 반영했습니다. 작업 상태는 깨끗하며 기존 공개 URL과 이전 결과를 보존합니다. 새 세션에서 `game-check`가 발견됐지만 이 설계 단계에서는 아직 호출하지 않았고 구현 단계에서 실제 재사용을 확인합니다.

07-02에서는 일시정지를 구현하고 `game-check`를 실제 호출해 Node 23개·Chromium 11개·빌드와 일반 시간 P 조작, preview 루트·하위 경로를 확인했습니다. PR CI `34812342325`는 빌드 성공, 업로드·배포 건너뛰기를 확인했고 리뷰와 검사 결과를 검토한 뒤 PR을 main `a7a8259728f61e71722b8e1e709c9a9ebd2934ee`로 정상 병합했습니다. 소유 서버·탭 종료와 깨끗한 작업 상태를 확인했습니다. 정확한 main 배포와 공개 P 동작 확인은 아직 남아 있으며, 사람·App UI 미확인은 유지합니다.

이후 해당 main의 Actions `34812636787`에서 빌드·업로드·배포가 성공했습니다. 성공 아티팩트 네 파일과 공개 HTTP 200 응답의 바이트 일치를 확인하고, 일반 시간 실제 P 입력·반복 키 무시·1200ms 정지 중 Canvas와 점수 유지·재개 입력 정리·좌우 이동·발사·재정지·초기화를 확인했습니다. 발사 대기의 정밀한 시간 경계는 화면 관찰로 확대하지 않고 Node 23개·CI 브라우저 11개 근거와 구분했습니다. 공개 확인 댓글을 남긴 뒤 일시정지 이슈를 완료 종료했으며 추가 기록 PR 없이 깨끗한 작업 상태와 소유 서버·탭 종료를 확인했습니다.

08-01에서는 난이도 이슈의 새 App 세션과 `hahaysh-space-defense-difficulty` 기능 브랜치에서 설계 문서 다섯 개만 변경했습니다. 적 이동 속도 32/64/96, 선택 예정값과 이번 게임 설정의 분리, 상태별 선택 잠금, 기본 select의 키보드 입력 보호, 잘못된 값의 명시적 오류와 초기 보통 난이도, 기존 일시정지 유지를 설계했습니다. 원격 `9cdd019`와 작업 HEAD의 일치 및 깨끗한 상태를 확인했습니다. 난이도 구현·실제 Skill 호출·회귀·PR·공개 확인은 다음 단계에서 수행합니다.

08-02에서는 난이도를 구현하고 Skill을 사용해 Node 31개·Chromium 16개·빌드와 기본 선택 UI·잠금·일시정지를 확인했습니다. 초기 select 동기화 결함과 메뉴 재열기 검사 실패를 수정하고 이전 실패 기록을 보존했습니다. PR CI `34815166265` 성공, 리뷰 없음·병합 가능 상태를 다시 확인한 뒤 PR을 main `97766d9e3dfe4542185a4c5a588cd9d46fde18ac`로 정상 병합했습니다. 소유 서버·탭 종료와 깨끗한 작업 상태를 확인했으며, main 배포와 실제 공개 선택·P·잠금 동작 확인 전에는 단계 완료로 집계하지 않습니다.
