# ADR-0002: Branching Strategy — GitLab Flow

- Status: accepted
- Date: 2026-05-21
- Deciders: TPBank Web Platform Team (SRE, Frontend, Backend, CMS Engineering, Release Manager)

## Context and Problem Statement

Cần chọn một branching strategy duy nhất cho tất cả repository trong hệ thống TPBank Corporate Website. Strategy phải hỗ trợ 5 môi trường logic (dev, sit, uat, pre-prod, prod) với ánh xạ rõ ràng branch/tag -> environment, đồng thời phù hợp với GitLab on-premise và quy trình review/approval của ngân hàng.

## Decision Drivers

- Hỗ trợ 5 môi trường logic với deploy source xác định
- Phù hợp với GitLab on-prem (protected branches, MR approvals)
- Đơn giản cho team size trung bình (15-20 developers)
- Có buffer review giữa merge và production deploy
- Hỗ trợ hotfix khẩn cấp với back-merge bắt buộc
- Content-heavy CMS không phù hợp feature flags

## Considered Options

1. **GitFlow** — develop + release branches + main
2. **Trunk-Based Development** — main only + feature flags
3. **GitLab Flow** — environment branches (main -> sit -> uat -> pre-prod -> prod)

## Decision Outcome

Chọn **Option 3: GitLab Flow** với environment branches.

### Branch-to-Environment Mapping

| Environment | Deploy Source | Cluster | Namespace |
|-------------|-------------|---------|-----------|
| dev | local docker-compose | local | — |
| sit | branch `sit` | UAT cluster | sit-tpb-web |
| uat | branch `uat` | UAT cluster | uat-tpb-web |
| pre-prod | branch `pre-prod` | PROD cluster | preprod-tpb-web |
| prod | tag `v*.*.*` từ branch `prod` | PROD cluster | prod-tpb-web |

### Flow

```
feature/* ──MR──► main ──ff──► sit ──MR──► uat ──MR──► pre-prod ──MR+tag──► prod
```

### Protected Branch Policy

| Branch | MR Required | Min Reviewers | Pipeline Green | Force Push |
|--------|------------|---------------|----------------|------------|
| main | Yes | 2 | Required | Disabled |
| sit | Yes | 1 | Required | Disabled |
| uat | Yes | 1 | Required | Disabled |
| pre-prod | Yes | 2 | Required | Disabled |
| prod | Yes | 2 (incl. release manager) | Required | Disabled |

### Hotfix Flow

1. Cut `hotfix/*` branch từ tag prod gần nhất
2. Fix + test
3. MR vào `prod` (1 reviewer khẩn cấp)
4. Tag `vN.M.P+1`
5. ArgoCD deploy
6. **Bắt buộc** back-merge về `main`
7. Cherry-pick/fast-forward xuống `sit`

### Consequences

**Tốt:**
- Mỗi environment có duy nhất 1 deploy source xác định
- Tích hợp tự nhiên với GitLab protected branches và MR approvals
- Buffer review rõ ràng giữa các stage
- Đơn giản hơn GitFlow (không có develop/release parallel)

**Xấu:**
- Nhiều environment branches cần maintain
- Promotion flow có thể chậm nếu review bottleneck
- Cần discipline back-merge hotfix

## Pros and Cons of the Options

### GitFlow

**Ưu điểm:**
1. Mature, well-documented
2. Rõ ràng phân biệt develop vs release vs hotfix
3. Phù hợp release cycle dài

**Nhược điểm:**
1. Quá phức tạp cho team size trung bình
2. develop + release branches tạo merge overhead
3. Không map tự nhiên với 5 environments
4. Dễ conflict khi maintain nhiều long-lived branches

### Trunk-Based Development

**Ưu điểm:**
1. Đơn giản nhất, ít branches
2. Fast feedback loop
3. Phù hợp CI/CD mature teams

**Nhược điểm:**
1. Cần feature flags infrastructure (overhead cho CMS content)
2. Không có buffer review giữa merge và prod
3. Không phù hợp text-content-heavy CMS
4. Bank compliance cần explicit approval gates giữa environments
5. Rủi ro cao nếu team chưa mature về testing

### GitLab Flow (environment branches)

**Ưu điểm:**
1. Đối xứng tự nhiên với 5 môi trường logic
2. Đơn giản hơn GitFlow, không có develop/release parallel
3. An toàn hơn Trunk-Based: có buffer review giữa stages
4. Tích hợp tự nhiên với GitLab protected environment branches + MR approvals
5. Phù hợp compliance ngân hàng (explicit approval per environment)

**Nhược điểm:**
1. Nhiều environment branches cần maintain
2. Promotion flow sequential có thể chậm
3. Cần automation cho fast-forward merges

## More Information / Links

- [GitLab Flow documentation](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ADR-0001: Repository Strategy](./0001-repository-strategy.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — Chi tiết workflow và naming convention
