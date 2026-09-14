# demo02 개선 실습 진행 기록

[저장소 안내](../README.md) · [전체 실습](../docs/00-전체-실습-안내.md)

## 실행 기준과 범위

- 대상: [hahaysh/space-Invaders-demo02](https://github.com/hahaysh/space-Invaders-demo02).
- 고정 안내서: [3637e1ad7897a2e674aa85cb8f3f6154da4b3907](https://github.com/hahaysh/space-Invaders/tree/3637e1ad7897a2e674aa85cb8f3f6154da4b3907/docs).
- 2026-09-14 사용자 위임으로 추천 선택지를 사용해 20개 단계를 순서대로 진행합니다.
- 이슈, 기능 브랜치, PR, 검사, Pages 배포를 실제로 수행합니다. 이전 demo01의 직접 main 반영 예외를 재사용하지 않습니다.
- demo01과 역사적 샘플은 수정하거나 시작 코드로 복사하지 않습니다. 게임 제목은 **우주 방어**이며 적의 공격은 추가하지 않습니다.
- 도구 대행과 사람의 App UI 조작을 구분합니다. App 설정 수락, Skill 호출, 자동 지침 적용은 각각 실제 확인 근거가 있어야 합니다.

**현재 상태:** 05-02까지 **11/20단계(55%)**입니다. 실제 요구사항 근거를 대조해 제품 차단이나 필수 확인 누락이 없음을 확인했고, 06-01 Pages 배포 준비를 진행합니다. App 설정 수락·Run UI는 아래와 같이 미확인입니다. 전체 실습 완료나 배포 성공은 아직 아닙니다.

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
| 06-01 | Pages 배포 준비 | 진행 중 | 공개 범위·workflow 게시 소스·main 전용 환경 준비 |
| 06-02 | 배포 워크플로 | 대기 | - |
| 06-03 | PR과 첫 배포 | 대기 | - |
| 07-01 | 일시정지 요청과 설계 | 대기 | - |
| 07-02 | 일시정지 구현과 재배포 | 대기 | - |
| 08-01 | 난이도 선택 설계 | 대기 | - |
| 08-02 | 난이도 구현과 재배포 | 대기 | - |
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
