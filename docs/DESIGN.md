# Council of AI — design draft

Status: proposed, 28 October 2026. This describes intended behaviour, not implemented features.

## Purpose

Make independent AI review enjoyable and easy to manage while keeping a human responsible for its direction and outcome. Preserve separate browser conversations and the implementer’s limited grounding role.

Success means less context preparation, clearer disagreements, and an actionable decision. Model agreement is not proof; competitive framing is optional flavour, not an evidence standard.

## Initial scope

Build a local application for one chair with multiple cases and configurable council members. Default council members, in speaking order, are **Gippity (ChatGPT)**, **DeepSeek**, **Kimi**, and **Gemini**; names, order, and count are editable. The human is the chair, and the local implementer (for example Codex or Claude) is a separate technical witness. The application requires no AI API or account connection.

Include case editing and versioning, template-based prompts, clipboard handoffs, pasted responses, a timeline, manual claim tracking, chair interventions, decisions, persistence, and export/import. Exclude automatic sending, browser control, model calls, autonomous summarisation, and execution of implementation instructions.

## Session flow

A case moves through Draft → Openings → Debate → Final document → Signatures → Chair decision → Closed. A grounding check can occur during openings or debate. Pausing is available in every active phase. The chair can skip stages, reopen a case, or end it without a decision; record these actions in the timeline. Skipping agreement or signatures produces an incomplete or chair-only outcome, never a completed council agreement.

### Case briefing

Capture title, problem, outcome, project facts, constraints, proposal, alternatives, uncertainties, and questions. The chair reviews and freezes a version before preparing openings. Every handoff references its exact briefing version.

After responses exist, editing the briefing creates a new version. Preserve the old version and mark related responses and recommendations as potentially affected until reviewed. Do not rewrite historical prompts.

### Independent openings

Prepare the same substantive briefing for every member, without other members’ responses. Request position, strongest objection, suggested improvement, confidence, and missing evidence. Track prepared, copied, and response-recorded states separately. Copying does not establish that a prompt was sent.

### Debate

Suggest the next member in a configurable circuit; the chair can override the order or ask all members. Each handoff includes selected disputed claims, relevant replies, chair directions, and the current briefing. Show exactly what will be copied and allow editing.

Use a default budget of one rebuttal circuit after openings, then a grounding check and decision. This is a reminder, not a restriction. Show when the budget is reached and let the chair continue explicitly.

### Implementer grounding

Generate questions about disputed project facts, feasibility, code evidence, cost, and constraints. Paste the implementer’s response into a distinct witness entry. Keep its assertions attributable and open to challenge. It does not approve the council’s outcome.

### Final document and agreement

Consolidate the debate into one versioned final document containing the problem, agreed approach, reasons, scope, changes from the original proposal, evidence references, tests, unresolved assumptions, and next actions. Circulate the complete text to every participating council member for review. Members may propose amendments; the chair controls incorporation and circulation.

Agreement means accepting this exact document as the council’s shared conclusion, with any remaining reservations disclosed. It does not require pretending that all uncertainty has disappeared. A blocking objection returns the document to revision; never turn refusal or silence into agreement.

### Signatures and last reservations

Freeze the final document body and assign an immutable version ID. Every participating member must explicitly sign that same version and provide their last reservations, or explicitly state “None”. The application stores the member name, document version, agreement status, exact signature statement, reservations, source response/handoff, and recorded timestamp. Signatures are model-authored acknowledgements pasted by the chair, not cryptographic signatures or independently verified identities.

Use statuses Pending, Signed, and Changes requested. A signature must explicitly accept the identified version; a missing reservation field is incomplete. Reservations can describe accepted limitations or residual uncertainty. If a reservation says the document must change before acceptance, record Changes requested rather than Signed.

Show a signature register for Gippity, DeepSeek, Kimi, and Gemini by default. Complete council agreement requires a valid signature from every participating member against the same current document version. Freeze the participating roster when circulation starts. Roster changes require an explicit chair action and renewed circulation and signatures; preserve the former roster and responses so dissent cannot disappear silently.

Any change to the document body, source briefing, or participating roster reopens review and requires fresh signatures for a new document version. Preserve all previous documents and signatures as historical records. Signature entries are attached separately to the frozen body, so recording another member’s signature does not itself invalidate existing signatures. Changing a member’s signature or reservations preserves its history and requires that member’s explicit replacement statement against the current version.

The chair may pause, continue debate, or close without agreement. Such outcomes remain visibly incomplete and cannot be exported as a council-agreed document.

### Chair decision

After council sign-off, separately record the chair’s decision, reasons, accepted uncertainty, and approval. The application cannot infer chair approval from signatures, votes, model responses, or elapsed time. Council agreement does not authorise implementation.

Only an explicit chair action creates an approved implementation brief. The brief references the signed document and includes each member’s last reservations verbatim. A chair departure from the shared conclusion must be labelled as the chair’s own decision, not attributed to the council. Editing an approved decision requires renewed chair approval; editing the document or source briefing additionally requires renewed council signatures. Preserve earlier approved versions. Drafts and incomplete discussion records remain exportable with clear status labels. Export never executes work or sends it to an implementer.

## Chair control

Keep a persistent “Chair’s input” area alongside the discussion. The chair can add context, challenge a claim, redirect discussion, request grounding, pause, or close. Choose a target member, selected members, or the whole council.

Interventions appear at their actual point in the timeline. Track which member handoffs include each intervention; adding a comment does not mean an external chat has received it. Constraint changes create a briefing revision and a review flag for affected material.

In Manual mode, the chair writes and chooses each handoff. In Guided mode, the application suggests the next handoff, but the chair reviews, edits, and copies it. Future automation must have an explicit bounded scope and pause before dispatching further messages after an intervention. Manual handoffs already copied cannot be recalled.

## Main screen

- Case header: phase, briefing version, round budget, save state, pause/close controls.
- Member rail: editable members, speaking order, opening and response status.
- Discussion timeline: attributed responses, handoffs, interventions, grounding, and decisions.
- Claim ledger: claims, objections, evidence references, status, and unresolved questions.
- Final document: versioned text, amendment requests, and circulation controls.
- Signature register: each member’s status, signed version, and last reservations.
- Chair input: always accessible, with intervention type and audience.
- Handoff preview: full editable prompt, included context, version, and copy action.

Use council language lightly: “Give the floor”, “Call the implementer”, and “Record your decision”. Optional badges such as “Evidence requested” and “Changed my mind” should reward useful contributions, not manufactured conflict. Avoid a model leaderboard or a truth score.

## Claim ledger

The chair creates and edits entries, optionally pasting a model-proposed list for review. Each claim has an ID, text, author/source response, evidence links or excerpts, related objections, and a status: open, supported, disputed, resolved, or deferred. These are chair-maintained discussion labels, not automatic truth judgements. Preserve dissent and reasons when resolving a claim.

## Proposed data model

| Entity | Main fields |
| --- | --- |
| Case | ID, title, phase, paused state, member order, budget, timestamps |
| BriefingVersion | ID, case ID, version, structured content, creation time |
| Member | ID, display name, optional role and chat URL |
| Handoff | ID, recipient, exact prompt, briefing version, included entry IDs, prepared/copied timestamps |
| Response | ID, member or witness, handoff ID, raw text, recorded time, affected-version review state |
| Intervention | ID, type, text, target IDs, created time, included-in-handoff references |
| Claim | ID, text, source references, evidence, objections, status, resolution reason |
| FinalDocumentVersion | ID, case ID, immutable body, briefing version, participating roster, source IDs, creation time |
| MemberSignature | ID, member ID, document version, status, exact statement, last reservations, source response/handoff, recorded time, superseded signature ID |
| DecisionVersion | ID, signed document version, recommendation, dissent, chair decision, rationale, accepted uncertainty, source IDs, approval state/time |
| Event | ID, case ID, event type, related IDs, timestamp |

Store raw pasted text alongside structured records. Do not overwrite original prompts or responses when annotations change. Corrections should preserve revision history. Treat pasted model output as text; never execute embedded code or instructions.

## Persistence and portability

Select a storage approach during implementation. Required properties: no account needed, saves survive restart, visible save errors, versioned export schema, and complete case export/import. Markdown exports serve reading and manual handoff; JSON preserves structure for round trips. Exports include source/version references and decision approval status.

Browser-based storage is a possible first approach but must explain backup and deletion behaviour. A local service with file storage is another option. Neither is selected yet. Repository files and personal council records should be separate; runtime records should be excluded from Git by default.

No analytics or background network requests in the initial version. External links open only by user action. Secrets and account credentials are outside the data model. Do not automatically fetch evidence URLs pasted into responses.

## Prompt construction

Use deterministic templates and explicit context selection. Display omitted context; never silently truncate a handoff. The chair can copy a full briefing or a compact handoff, with included sources visible. Compact summaries are written or reviewed by the chair, not assumed to be faithful automatically.

## Acceptance criteria for the first usable build

1. Complete a case with at least two configurable members using only copy/paste, without an API key or application AI calls.
2. Opening handoffs contain the same briefing version and no peer responses.
3. Add a chair intervention in any active phase and see who has and has not received it through recorded handoffs.
4. Override the suggested speaker, edit a prompt, pause, resume, and close without losing content.
5. Revise a briefing and retain prior prompts, responses, and version references with visible review flags.
6. Record a witness check, a disputed claim, dissent, and a separate chair decision.
7. Complete council agreement only when every participating member explicitly signs the same current final document version with last reservations or “None”; pending replies and blocking objections prevent completion. Export an approved implementation brief only after separate chair approval.
8. Restart without losing saved work and round-trip a full case through export/import.
9. Clearly report save failures and never present copied text as confirmed delivery.
10. Render pasted content safely without executing its instructions or scripts.
11. Amend the final document or source briefing and require fresh signatures while retaining historical versions. Record additional signatures without changing the frozen document body.
12. Preserve the roster and signature history, label closure without agreement accurately, and include every member’s last reservations in final exports.

## Implementation milestones

1. Choose the smallest suitable stack and persistence mechanism; implement one case, briefing, members, prompts, and pasted responses.
2. Add interventions, timeline, version references, and manual claim ledger.
3. Add final document circulation, member signatures and reservations, separate chair approval, exports/imports, persistence verification, and usability polish.
4. Evaluate optional browser assistance or API adapters only after the manual workflow is useful. Check service rules and access requirements at that time.

## Open design choices

- Browser-only application or local service with file storage?
- How much context should a rebuttal include by default?
- Which keyboard shortcuts make chair interventions fast?
- Should optional roles rotate automatically or remain manually assigned?

These choices do not block drafting or validating the core workflow.


## Implemented journey revision — 29 October 2026

The main journey is now Briefing → Openings → Debate → Final document → Record. Openings have separate named textboxes and save buttons for each member, keyed by briefing version and member ID. A save appends a response version rather than replacing a peer’s remarks. Drafts persist locally across reloads and browser sessions. Legacy shared drafts remain available for manual attribution; only identifiable historical opening responses are automatically adopted.

Starting a round requires every member’s saved opening. The round snapshots the briefing version, member order, and opening response IDs. Each member speaks once, addressing the next member in the circuit (including the last member back to the first). Prompts contain all opening remarks with FROM labels, prior debate replies with FROM/TO and round labels, and applicable chair directions. They request a short synthesis and a constructive response or explicitly provisional proposal. Consensus is never inferred from a proposal.

Every turn has its own stable ID, draft, handoff, and append-only saved response. Saving the current reply prepares the next member’s prompt; saving an old turn cannot assign it to the new speaker. Completing the circuit offers an explicit next-round action or final review. Rounds and replies remain in history, including after briefing or roster revisions.

Chair comments refresh the pending prompt while preserving older copied handoffs. The turn’s draft remains attached to that speaker. Prompts are still copied manually and delivery is never presumed. Final-document drafting and signatures remain separate from the round relay.
