# v0.4 자동화 구조

현재 버전은 **자동화 뼈대**를 먼저 구축한 상태입니다.

- Daily: `.github/workflows/daily.yml`
- Weekly: `.github/workflows/weekly.yml`
- Monthly: `.github/workflows/monthly.yml`

중요: GitHub Actions가 성공했다고 해서 외부 뉴스가 자동으로 수집되는 것은 아닙니다.
실제 뉴스 수집은 별도 데이터 소스/API 또는 사람이 제공한 자료가 필요합니다.

따라서 v0.4의 안전한 운영 방식은:
1. ChatGPT에서 콘텐츠를 작성/검토
2. 파일 세트에 반영
3. GitHub Desktop으로 Commit → Push
4. GitHub Pages에서 확인

이후 필요하면 뉴스 소스 연결을 단계적으로 자동화합니다.
