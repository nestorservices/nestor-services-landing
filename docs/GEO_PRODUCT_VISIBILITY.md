# GEO Product Visibility and Claim Register

Last reviewed: 2026-11-09

## Purpose and evidence rules

This document is the working reference for keeping Nestor's public product
descriptions aligned with verified availability. It is not an automated
monitor, product specification, or substitute for release validation.

Capability status describes the strength and availability of evidence, not
whether code exists:

- `VERIFIED_PRODUCTION`: behavior or public availability was confirmed in the
  live production product.
- `VERIFIED_LIMITED`: confirmed only in a controlled pilot, restricted
  availability, or limited operating context.
- `PLANNED`: documented as intended or under development, but not verified as
  an available capability.
- `UNVERIFIED`: evidence is insufficient to approve a public capability claim.

Record the source and the date checked. A public description or source-code
implementation alone does not prove end-to-end production availability.
When evidence is limited, keep wording correspondingly qualified.

## Brand positioning

| Brand | Approved positioning | Public identity and relationship |
| --- | --- | --- |
| Nestor Services | **Recruitment Beyond Keywords. Hiring Beyond Resumes.** | Parent company providing recruitment and talent acquisition services and operating the Nestor product ecosystem. |
| Nestor Hire | **Discover Candidate Potential Beyond CV Keywords.** | Recruitment management and candidate discovery platform; recruiter and hiring-team decisions remain human-led. |
| Nestor Assess | **Evaluate Skills Beyond the Resume.** | Separate, invitation-based technical assessment product operated by Nestor Services. Public information: <https://www.nestorservices.in/nestor-assess>. Candidate portal: <https://assess.nestorservices.in/>; access requires an invitation. |
| Nestor Core | Development/pilot positioning only. | HR operations product in development and limited pilot; do not present as a generally available HRMS or payroll product. |

Recruitment considers context such as relevant experience, industry exposure,
career progression, transferable skills, compensation and location preferences,
role requirements, and professional potential. This is a positioning
philosophy, not a claim that every factor is automatically evaluated by a
product. Recruiters and hiring teams make progression decisions. Do not imply
exclusive market differentiation or guaranteed hiring outcomes.

## Capability register

Verification date below means the evidence was reviewed on that date. It does
not mean every internal workflow was independently exercised. Recheck before
expanding any claim.

| Capability / availability | Product | Status | Evidence and scope | Production verification date | Public claim approved | Relevant public pages | Last GEO review |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Recruitment and talent-acquisition services | Nestor Services | VERIFIED_PRODUCTION | Live parent homepage presents recruitment, talent acquisition, managed hiring, and employer contact routes. This verifies the public service offer, not a guaranteed outcome. | 2026-11-09 | YES, as a service offer | <https://www.nestorservices.in/> | 2026-11-09 |
| Public job listing and candidate application entry | Nestor Hire | VERIFIED_PRODUCTION | Live public jobs listing and job/application routes previously verified; the Services homepage also links to current openings. | 2026-11-09 | YES | <https://hire.nestorservices.in/jobs> | 2026-11-09 |
| Candidate discovery and recruiter-led recruitment management | Nestor Hire | VERIFIED_LIMITED | Production-facing descriptions and project context support candidate discovery and recruiter workflows; this review did not exercise authenticated recruiter operations. Avoid claims of autonomous decisions or guaranteed fit. | 2026-11-09 | YES, with recruiter-led wording | <https://hire.nestorservices.in/> | 2026-11-09 |
| Resume parsing / extracted resume details | Nestor Hire | UNVERIFIED | Internal project documentation names a Resume Parser, but code or documentation is not sufficient proof of current production behavior. | Not verified in this review | NO, pending production evidence | <https://hire.nestorservices.in/> | 2026-11-09 |
| Automated AI fitment score or automated hiring decision | Nestor Hire | UNVERIFIED | No approved evidence establishes an automatic fitment score or hiring decision. Do not describe matching language as such a feature. | Not verified in this review | NO | <https://hire.nestorservices.in/> | 2026-11-09 |
| Invitation-only assessment access | Nestor Assess | VERIFIED_LIMITED | Public Services and Assess information identify invitation-required access; Assess operating documentation describes a controlled, human-supervised pilot. | 2026-11-09 | YES, explicitly invitation-based / limited where discussing availability | <https://www.nestorservices.in/nestor-assess>; <https://assess.nestorservices.in/> | 2026-11-09 |
| Technical evaluation and recruiter review | Nestor Assess | VERIFIED_LIMITED | Controlled-pilot documentation describes role-specific evaluation and human recruiter review. This does not establish automated decisions, proctoring, or general availability. | 2026-11-09 | YES, with pilot/invitation context | <https://www.nestorservices.in/nestor-assess> | 2026-11-09 |
| Python practical assessment path | Nestor Assess | VERIFIED_LIMITED | Assess pilot/security documentation records bounded Python evaluation in the controlled environment. Availability remains limited; no claim of broad public access. | 2026-11-09 | YES, only if clearly qualified as limited/pilot | <https://www.nestorservices.in/nestor-assess> | 2026-11-09 |
| SQL execution in candidate assessments | Nestor Assess | PLANNED | Assess security documentation says SQL remains deferred/disabled. | 2026-11-09 | NO | <https://www.nestorservices.in/nestor-assess> | 2026-11-09 |
| HR operations product availability | Nestor Core | VERIFIED_LIMITED | Live parent homepage explicitly labels Core “In development / pilot” and says availability is limited to development and pilot use. This verifies the availability qualifier, not each listed workflow. | 2026-11-09 | YES, only as development / limited pilot | <https://www.nestorservices.in/> | 2026-11-09 |
| Employee records, attendance, leave, and payroll support workflows | Nestor Core | UNVERIFIED | These are described as areas under development on the live homepage; individual production workflows were not verified. Treat them as development scope, not generally available functionality. | Not verified in this review | NO as live/general-availability claims; YES only as planned development scope | <https://www.nestorservices.in/> | 2026-11-09 |

### Claim safety

Do not publicly claim, without new evidence and approval:

- AI-generated fitment scores, autonomous candidate ranking, or automated
  hiring decisions.
- That every contextual factor in the recruitment philosophy is automatically
  evaluated.
- Assessment proctoring, surveillance, guaranteed integrity, or automated
  assessment decisions.
- Live SQL execution in Nestor Assess.
- Generally available Nestor Core HRMS, attendance, leave, payroll, or
  statutory-compliance functionality.
- Ratings, customer counts, guaranteed outcomes, or unsupported performance
  comparisons.

## Release-to-GEO process

For each meaningful production release:

1. Identify a new or materially changed capability.
2. Confirm deployment completion and verify the behavior in production.
3. Establish external availability and any pilot, invitation, or tenant limits.
4. Check whether users search for or need the capability; do not add keywords
   solely for volume.
5. Compare the evidence with current public descriptions.
6. Propose the smallest accurate copy change, if one is justified.
7. Obtain owner approval for new or materially expanded public claims.
8. Publish through the normal review/release path and verify the live result.
9. Update this register with the evidence, date, approved claim, and relevant
   pages.

Minor UI fixes do not require a public announcement. A release is not GEO
evidence until its production behavior and availability have been checked.

## Review cadence

- After significant product releases: review affected claims and register
  evidence.
- Weekly: review verified capability changes only; do not treat this as
  automated monitoring.
- Monthly: review observed AI-search visibility and public-source accuracy.
- Quarterly: review positioning, product distinctions, and differentiation.

Record actual observations and source URLs. Do not infer broad AI-search
behavior from one response or invent visibility scores.

The preserved baseline report remains at
`/Users/shashankmalviya/Documents/New project/nestor-geo-baseline-2026-11-09.md`.
Do not overwrite it. Future measurements should record branded recognition,
non-branded discovery, correct product identity, official citations,
unsupported claims, relevant alternatives, and measurable AI referral traffic.

## Change log

- 2026-11-09: Established initial product positioning, evidence register,
  claim-safety rules, release-to-GEO process, review cadence, and baseline
  preservation reference. Public production pages checked; unauthenticated
  recruiter workflows and individual Core workflows were not independently
  tested.
