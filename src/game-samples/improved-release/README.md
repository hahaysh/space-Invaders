# 궤도 수호대 — 일시정지 개선 릴리스

최초 로컬 체크포인트 `0162756`을 복사하고 **CHG-01: P 키 일시정지·재개**만 추가한 독립 실행 샘플이다.
같은 수치·게임 규칙·도구·잠금 파일을 사용하며 원본 샘플은 수정하지 않는다.
원본의 패키지 이름·버전은 비교를 위해 그대로 유지한다. 화면과 이 문서가 개선판임을 구분한다.

## 실행과 조작

Node.js 24 LTS가 필요하다. 이 폴더를 작업 루트로 사용한다.

```powershell
npm ci
npx playwright install chromium
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

브라우저 `http://127.0.0.1:5173`에서 조작한다.
Enter/버튼 시작, ←/→ 또는 A/D 이동, Space 유지 발사, **P 일시정지·재개**, 종료 후 R/버튼 재시작.
P는 playing/paused에서만 동작한다. 정지·재개와 창 이탈은 키를 해제하므로 이동·발사는 다시 눌러야 한다.
창 이탈 자체는 자동 일시정지가 아니다. 정지 UI에는 새 버튼이 없다.

## 검증

수동 개발 서버를 종료한 뒤 실행한다. 모르는 프로세스로 포트가 점유되어 있으면 종료하지 않는다.

```powershell
npm test
npm run test:e2e
npm run build
node scripts\check-build.mjs
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

E2E는 자체 `127.0.0.1:5173` 서버를 관리한다. 빌드 검사는 임의 loopback 포트의
`/improved-release/`에서 상대 HTML·JS·CSS, 시작, P 정지·재개를 확인하고 종료한다.
실제 결과는 [TEST_RESULTS.md](TEST_RESULTS.md), 최초 이력은 [FIRST_RELEASE_RESULTS.md](FIRST_RELEASE_RESULTS.md)로 분리했다.
화면 캡처·보고서는 무시된 `test-results`에 생성되며 새 checkout에는 포함되지 않는다.

## 안내서 수행 범위

1. 07-01: 코드보다 먼저 `CHANGE_REQUEST.md`에 AC1~7과 기준 체크포인트 작성.
2. 07-02: PRD·TRD·계획·검증 계획 갱신, 최초 결과 분리.
3. 07-03: 기존 상태·키·시간 구조를 재사용하여 작은 변경 구현.
4. 07-04: 새 검사와 기존 REQ-01~08 회귀·빌드·하위 경로 검사 실행.
5. 07-05: 실제 로컬 근거와 남은 미확인 정리만 수행. 원격 PR·재배포 제외.

이는 사용자가 허용한 **자동 산출물 리허설**이다. 참가자별 프롬프트·승인·중간 커밋·app UI 전환을
그대로 수행했다고 주장하지 않는다. 실제 배포가 없으므로 `0162756`을 배포 SHA로 부르지 않는다.
`ideation.md`는 최초 테마·후속 아이디어 배경으로 변경하지 않았다.
`AGENTS.md`의 최초 버전만 허용하던 문장은 새 허용 범위와 충돌하므로 개선판으로 좁혀 갱신했다.

## 정적 전달과 제한

런타임 외부 CDN·이미지·게임 엔진은 없다. 빌드 결과는 `dist`만이다.
`.github/workflows/pages.yml`은 이 폴더가 독립 저장소 루트일 경우의 예제이며 상위 저장소에서는 활성화되지 않는다.
실제 Actions·Pages 공개 URL, 인간 플레이와 OS 포커스 전환, app UI·지침 자동 적용은 별도 확인이 필요하다.
