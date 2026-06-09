# Architecture Decision Records

Thư mục này chứa các Architecture Decision Records (ADR) cho repository `tpb-web-bff`, theo template [MADR](https://adr.github.io/madr/) (Markdown Any Decision Records).

## ADR Index

| ID | Title | Status | Date |
|----|-------|--------|------|
| [ADR-0001](./0001-repository-strategy.md) | Repository Strategy: Poly_Repo | Accepted | 2026-05-21 |
| [ADR-0002](./0002-branching-strategy.md) | Branching Strategy: GitLab Flow | Accepted | 2026-05-21 |

## Template

Khi tạo ADR mới, sử dụng template sau:

```markdown
# ADR-NNNN: <title>

- Status: proposed | accepted | deprecated | superseded
- Date: YYYY-MM-DD
- Deciders: <list>

## Context and Problem Statement

## Decision Drivers

## Considered Options

## Decision Outcome

### Consequences

## Pros and Cons of the Options

## More Information / Links
```

## Quy trình tạo ADR

1. Copy template vào file mới: `NNNN-short-title.md`
2. Điền nội dung với status `proposed`
3. Tạo MR để review
4. Sau khi approve, đổi status thành `accepted`
5. Cập nhật bảng index ở file này

## Quy ước đánh số

- Format: `NNNN` (4 chữ số, zero-padded)
- Số tăng tuần tự, không reuse số đã dùng
- ADR deprecated/superseded giữ nguyên số, thêm link tới ADR thay thế
