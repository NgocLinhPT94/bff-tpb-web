# ADR-0001: Repository Strategy — Poly_Repo

- Status: accepted
- Date: 2026-05-21
- Deciders: TPBank Web Platform Team (SRE, Frontend, Backend, CMS Engineering)

## Context and Problem Statement

Hệ thống TPBank Corporate Website gồm 4 thành phần chính (Next.js frontend, NestJS BFF, Strapi v5 CMS, Infrastructure) cần được tổ chức trong source control. Cần quyết định sử dụng Mono_Repo (gộp tất cả trong một repository) hay Poly_Repo (mỗi thành phần một repository riêng).

Ngữ cảnh đặc thù:
- GitLab on-premise (CE/EE) làm SCM
- ArgoCD cho GitOps deployment
- OpenShift Container Platform (2 clusters)
- 4 team khác nhau: frontend, backend, CMS engineering, SRE/platform
- Strapi v5 có lifecycle build đặc thù (admin panel build)

## Decision Drivers

- Khả năng phân quyền độc lập trên GitLab on-prem
- Đơn giản hóa CI/CD pipeline per component
- ArgoCD Application mapping 1-1 với source repo
- Release cadence khác nhau giữa các team
- Audit trail rõ ràng cho compliance ngân hàng
- Khả năng chia sẻ code (DTO, types) giữa frontend và BFF

## Considered Options

1. **Mono_Repo** — Tất cả 4 thành phần trong một repository
2. **Poly_Repo** — Mỗi thành phần một repository độc lập
3. **Hybrid** — Application repos gộp (frontend + BFF), infra riêng

## Decision Outcome

Chọn **Option 2: Poly_Repo** với 4 repository chính + 1 shared-types package:

- `tpb-web-frontend` (Next.js)
- `tpb-web-bff` (NestJS)
- `tpb-web-cms` (Strapi v5)
- `tpb-web-infra` (Helm + Kustomize + ArgoCD)
- `tpb-web-shared-types` (npm package, OpenAPI generated)

### Consequences

**Tốt:**
- Mỗi team sở hữu và quản lý repo riêng, phân quyền đơn giản
- CI/CD pipeline tự nhiên, mỗi push trigger pipeline duy nhất cho repo đó
- ArgoCD Application trỏ 1-1 tới repo, dễ debug và rollback
- Release cadence độc lập giữa các team

**Xấu:**
- Chia sẻ code phức tạp hơn (cần npm package riêng)
- Cross-cut changes cần nhiều MR liên kết
- Khởi tạo boilerplate nhiều hơn

**Biện pháp giảm thiểu nhược điểm:**
- OpenAPI generated client + `@tpb-web/shared-types` package trên GitLab Package Registry
- Convention "linked MRs" trong CONTRIBUTING.md
- Cookiecutter/copier templates trong `tpb-web-infra/scripts/templates/`

## Pros and Cons of the Options

### Mono_Repo

**Ưu điểm:**
1. Atomic commit cross-component (đổi DTO ở BFF + sửa caller ở Next cùng MR)
2. Một workspace tool quản lý dependency chung, version aligned tự động
3. Một CI pipeline với job-level filter theo path, dễ enforce quy chuẩn đồng nhất

**Nhược điểm:**
1. GitLab on-prem CE/EE không có ưu thế Nx/Turborepo Cloud cache -> build chậm khi codebase tăng
2. Phân quyền theo path phức tạp với GitLab CODEOWNERS, không phù hợp 4 team khác nhau
3. ArgoCD app-of-apps phải implement path-based source filter, tăng độ phức tạp
4. Một mistake commit lớn có thể block toàn bộ team khi pipeline đỏ
5. Strapi v5 có lifecycle build đặc thù, không phù hợp gộp chung pnpm workspace

### Poly_Repo

**Ưu điểm:**
1. Phân quyền độc lập trên GitLab on-prem: mỗi team sở hữu repo riêng
2. CI/CD pipeline tự nhiên: mỗi push trigger pipeline duy nhất
3. ArgoCD Application 1-1 đơn giản, dễ debug, dễ rollback từng thành phần
4. Release cadence tách rời: frontend release nhanh, CMS release chậm
5. Audit trail rõ: PR review per repository, CODEOWNERS khu trú dễ kiểm toán

**Nhược điểm:**
1. Chia sẻ code khó hơn -> giảm thiểu bằng OpenAPI generated client + npm package
2. Cross-cut change tốn nhiều PR -> giảm thiểu bằng convention linked MRs
3. Khởi tạo nhiều boilerplate -> giảm thiểu bằng cookiecutter templates

### Hybrid (Application gộp, Infra riêng)

**Ưu điểm:**
1. Giảm overhead chia sẻ code giữa frontend và BFF
2. Infra vẫn tách biệt cho SRE team

**Nhược điểm:**
1. Strapi v5 build lifecycle xung đột với Next/Nest workspace
2. Vẫn cần giải quyết phân quyền frontend vs backend trong cùng repo
3. Không giải quyết triệt để vấn đề release cadence

## More Information / Links

- [GitLab Flow documentation](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
- [ArgoCD Application specification](https://argo-cd.readthedocs.io/en/stable/user-guide/application-specification/)
- [ADR-0002: Branching Strategy](./0002-branching-strategy.md)
