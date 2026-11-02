# Council prompt templates

Draft templates for manual review and copy/paste. Braced fields are placeholders. The dashboard will assemble these deterministically; no model call is required.

Default council: **Gippity (ChatGPT)** → **DeepSeek** → **Kimi** → **Gemini**. The human chairs; the implementer is a separate technical witness. Each member signs only for itself.

## Request a case file from the implementer

Prepare a self-contained case file for independent external review. Describe the problem, desired outcome, relevant project facts and constraints, proposed solution, alternatives considered, uncertainties, and specific questions. Separate observations from assumptions. Include relevant evidence without credentials or unnecessary private material. Explain what evidence would change your recommendation.

## Member initiation

The Briefing screen automatically prepares a member-specific introduction followed by the complete frozen implementer briefing and an independent opening request. It explains the human chair’s authority, the implementer’s witness role, manually relayed chats, and the member’s changing roles as reviewer, critic, alternative advocate, evidence checker, and final-document collaborator. It sets the shared-document signature and last-reservations expectation up front. The same introduction is included in Opening handoffs; peer responses are omitted.

Use each member’s named **Copy for …** button, then record replies against those initiation handoffs in The floor. Unsaved briefing edits must be frozen first; copied handoffs retain the exact text and briefing version used. Existing historical prompts remain unchanged.

## Independent opening

You are a member of a council reviewing the case below. The human chair owns the direction and final decision. Assess the proposal independently before seeing other members’ views.

Case: {case_title}
Briefing version: {briefing_version}

{briefing}

Provide: your position; strongest objection; suggested improvement; confidence with reasons; missing evidence; and a concrete test that could change your view. Distinguish facts, assumptions, and preferences. Keep claims specific and avoid inventing project details.

## Rebuttal handoff

Case: {case_title}
Briefing version: {briefing_version}

{briefing_or_chair_reviewed_summary}

Chair directions:
{applicable_interventions}

Selected discussion, with authors and entry IDs:
{selected_context}

Address the strongest unresolved objection. Identify the claim you dispute, explain why, and propose a change or test. State where you agree and whether your position changed. Do not repeat settled points merely to prolong the debate. List any additional context needed.

## Implementer grounding check

You are acting as a technical witness for the case below. Help ground the discussion in project evidence.

{briefing}

The chair requests checks on:
{disputed_facts_and_proposed_changes}

For each item, explain feasibility, relevant project evidence, likely cost, and constraints. Distinguish what you verified from what you infer. Identify external reviewers’ assumptions that do not match the project. The chair will decide how to proceed.

## Draft the shared final document

Using the supplied discussion, draft the council’s shared final document: problem, agreed approach, reasons, scope, changes from the original proposal, evidence references, unresolved assumptions, tests, and next actions. Attribute disagreements and do not manufacture consensus. Mark it as a draft for member review. The human chair controls revisions and subsequent implementation approval.

{chair_selected_discussion}

## Final document review and signature

You are {member_name}, signing only on your own behalf. Review the complete final document below as the proposed shared council conclusion. Accept it only if you can support this exact version, with your remaining reservations disclosed. Do not infer another member’s agreement.

Case: {case_title}
Document version: {final_document_version}
Participating council members: {participating_members}

{complete_final_document}

Respond in this format:

- Member: {member_name}
- Document version: {final_document_version}
- Status: Signed / Changes requested
- Signature statement: “I, {member_name}, agree to document {final_document_version} as the council’s shared conclusion, subject to the last reservations recorded below.” If you cannot agree, explicitly decline to sign and explain why instead.
- Last reservations: list remaining concerns, limitations, or uncertainty; explicitly write “None” if there are none.
- Required amendments: list changes required before you can sign, or “None”.

If any concern blocks acceptance, select Changes requested rather than Signed. Do not sign merely to end the discussion. Your signature acknowledges the document; it does not authorise implementation. Changes to the document require a new review and signature.

## Final document signature register

Document version: {final_document_version}

| Member | Status | Signed version | Last reservations | Source response |
| --- | --- | --- | --- | --- |
| Gippity (ChatGPT) | Pending | — | Awaiting statement | — |
| DeepSeek | Pending | — | Awaiting statement | — |
| Kimi | Pending | — | Awaiting statement | — |
| Gemini | Pending | — | Awaiting statement | — |

Adjust the roster explicitly before circulation if needed. Preserve each member’s statement verbatim. A pending response, refusal, or signature on an earlier version does not count as agreement on the current version. Record timestamps when responses are entered; do not invent a signing time.

## Chair decision record

- Signed council document version:
- Council agreement status:
- Member signatures and last reservations:
- Council recommendation:
- Remaining dissent:
- My decision:
- My reasons:
- Uncertainty I accept:
- Checks required before implementation:
- Approved implementation scope:

Approval is a separate explicit action in the application. Completing this template alone does not approve execution.


## Automatic round relay

The first debater receives the frozen briefing and every saved opening as:

```text
FROM: Council Member DeepSeek
Opening remarks:
[DeepSeek’s saved text]

FROM: Council Member Kimi
Opening remarks:
[Kimi’s saved text]
```

The prompt identifies the current member, round, turn, and next recipient. It asks the member to summarise agreement/disagreement and the latest message, address the strongest unresolved issue, and write to the next member. Where positions converge, it allows a concrete **PROPOSED DOCUMENT** with scope, checks, and reservations. It explicitly prohibits inventing consent or signing for others.

Saving a response constructs the next prompt automatically. It includes the opening snapshot, all earlier debate turns (with FROM/TO and round labels), and relevant chair directions. The response format is FROM, TO, ROUND, SUMMARY, RESPONSE or PROPOSED DOCUMENT, and REMAINING RESERVATIONS / QUESTIONS. Full context is included without silent truncation. The chair chooses each additional round or final review.
