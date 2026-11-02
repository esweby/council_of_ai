# Council of AI

A local workspace for bringing independent AI chats into a discussion that you chair.

Bring a proposal from your implementer, collect independent opinions in your existing browser chats, run a focused debate, and record your own decision. Keep the useful friction of reading and passing the floor while removing the repetitive work of preparing prompts and tracking disagreements.

## Status

First local prototype. The dashboard supports briefings, manual handoffs, responses, chair interventions, claims, final document versions, member signatures with reservations, and separate chair approval. No API keys or dependencies are required.

## Principles

- **You chair the council.** Interject, redirect, challenge, pause, or close a discussion at any point.
- **No API key required for the core workflow.** Use your existing browser chats and copy/paste handoffs. Their own access limits and subscriptions still apply.
- **Independent openings first.** Each member assesses the same briefing before seeing other members’ opinions.
- **The implementer is a technical witness.** Ask it for project evidence and feasibility checks without letting it own the debate.
- **The council signs its conclusion.** Every participating member agrees to one final document and signs with their last reservations. A refusal remains visible and blocks a completed council agreement.
- **Your decision is explicit.** Council recommendations become an implementation brief only when you approve them.
- **Local by default.** Store council records on your device and export them in portable formats.

## Council members

The default council and speaking order are:

1. **Gippity** — ChatGPT.
2. **DeepSeek** — DeepSeek.
3. **Kimi** — Kimi.
4. **Gemini** — Gemini.

Names, membership, and speaking order remain editable. You are the chair; the local implementer (such as Codex or Claude) is a separate technical witness.

## First version

A local dashboard with a case briefing, configurable council members, response boxes, a discussion timeline, a claim ledger, and a persistent chair input. A “Copy next prompt” button prepares each handoff; you review it, use your chosen browser chat, and paste the response back.

The dashboard does not need its own language model. Initial prompt assembly uses templates; claims, summaries, and decisions are entered or reviewed by the chair. It must never imply that it has independently assessed the truth of a response.

## Example session

1. **Briefing:** paste the implementer’s case file and freeze a version.
2. **Openings:** use each member’s copy button to initialise their independent chat. Paste their response into their own named opening card and save it. Every member has a separate draft and saved history.
3. **Start round 1:** when every opening is saved, the first speaker receives all opening remarks labelled `FROM: Council Member …`, plus instructions to write to the next speaker.
4. **Debate:** copy the current speaker’s prompt, paste their reply into that turn’s textbox, and press **Save reply & prepare [next member]**. The application saves the reply and automatically builds the next prompt with attributed openings and debate history.
5. **Rounds:** after each member has spoken once, choose **Start round 2** (and repeat) or **Move to final document**. A model may propose a document, but cannot declare everyone’s agreement.
6. **Chair input:** interject at any time. The pending debate prompt is refreshed with applicable chair directions; previous copied prompts and turn drafts are retained.
7. **Final document:** review a proposed document, freeze it, collect every member’s signature and last reservations against that version, then record your separate approval.

A started round snapshots its briefing, member order, and opening remarks. Opening revisions preserve previous text and apply to later rounds. A changed briefing requires new opening remarks; a changed roster starts a new round rather than reassigning existing turns.

Earlier responses linked to identifiable opening handoffs are adopted into their member’s card. Unassigned shared drafts and responses remain accessible under **Earlier work to place**, so you can put them in the correct card. Backups preserve cases, rounds, and drafts. No existing records are deleted by this update.

Optional implementer checks, signature handoffs, historical manual handoffs, and claims remain under **Debate → Other tools**.

Use **Shuffle speaking order** at the top to randomise the next round’s order. Every click changes the order. Started rounds, opening remarks, reply drafts, and signatures remain intact; the sidebar shows the upcoming order.

Each member’s copy button has an optional **Persona** field. Enter a perspective such as “pragmatic architect” or “evidence-focused sceptic”; leaving the field saves it for that case and updates the member’s initiation, opening, rebuttal, and pending debate prompts. Prior copied prompts, remarks, and turn drafts are preserved. Clear the field to remove the persona.

Use **Implementer intervention** in the chair panel at any point. Enter the council member’s question (or your own), copy the generated request into your implementer chat, paste its reply back, and choose **Inject implementer reply**. Each exchange is saved as implementer evidence, separately from chair directions. The pending council prompt refreshes without advancing the turn or clearing its draft. Follow-ups use the same controls and include earlier exchanges; interventions can address everyone or one member and are scoped to their briefing version.

Click a completed speaker’s name in the round to review their original prompt and saved reply. **Previous turn**, **Next saved turn**, and **Return to current turn** let you navigate without advancing or resetting the debate. Historical rounds also have **Review turn** buttons. The current reply draft stays attached to its turn.

Use **Skip [member]** beside the current reply’s save button when a reviewer is unavailable or out of quota. **Skip an unavailable reviewer** at the top of the round also lets you skip an upcoming member. The round records the skip and routes subsequent prompts around them; drafts are kept, and no reply or agreement is invented. Skips apply only to that round. Final signatures still require every participating council member.

Use **Summarise** when prompts grow too long. Prepare the complete saved shared-discussion packet for the current briefing, copy it or download it as a text file, and give it to a model you choose. Paste back the summary, review it, and explicitly activate it. Future debate prompts use that summary instead of the original briefing and covered messages, while carrying newer replies and interventions in full. Per-member interventions remain audience-specific. Originals, previous prompts, and summary versions are retained; **Restore full context** reverses the prompt mode. A new briefing requires a new checkpoint. Only dashboard-saved material is included, not unseen external chat history.

At the top of **Final document**, use **Prepare final-document summary prompt** to summarise the frozen outcome, signature register, last reservations, and chair decision without the debate history. Paste back and review the short outcome summary, then save it. It stays prominently above the document with copy/export controls; reservations are included verbatim in the standalone export. Changes to the source document, signatures, or approval make the summary stale and require a fresh review.

The **Final document** also has a separate questions/comments box for every council member. Copy a member-specific review request, paste their reply into their own box, and save it. **Copy final document + council notes** or **Export implementer handoff** gathers the frozen document, approval status, signatures, last reservations, and attributed notes. Notes are versioned separately and never silently carried onto a revised document.

Final sign-off is one box per member: paste the complete reply and choose **Save agreement** or **Save changes requested**. The application links the member, current document version, and timestamp automatically. It keeps the full reply and any reservations; no separate source reference or verification checkbox is required. Existing signature records remain intact.

Use **Skip approval** on a member’s final sign-off card when you want to proceed without their approval. Each member must have an agreement or an explicit skip before the chair approves. Skips remain visibly distinct from agreement in the register and exported handoff; previous replies/reservations are preserved. A revised document requires fresh sign-offs or skips.

Remove a member at any time using the **×** beside their name, or **Remove [name]** in Briefing. Unfinished turns are marked skipped and the relay routes around them, including during an active round. Earlier contributions and drafts stay saved. Future rounds use the remaining council. **Removed members → Restore** brings a member back; a skipped turn stays skipped for that round. A frozen final document keeps its old roster and needs a new version for the updated council.

## Control modes

- **Manual:** choose every speaker and compose each handoff.
- **Guided (default):** review and edit a prepared handoff before copying it.
- **Bounded automatic (future):** authorise a specific automated round, retaining pause and intervention controls. Not part of the initial build.

## Project documents

- [Design draft](docs/DESIGN.md): workflow, interaction model, data, scope, and acceptance criteria.
- [Prompt templates](docs/PROMPTS.md): starting templates for briefings, openings, rebuttals, and grounding checks.

## Development

Requires Node.js 20 or later. From this directory:

```sh
npm start
```

Open http://127.0.0.1:4317. Keep the terminal running while using the application. Stop with Ctrl+C. The server binds only to your computer and serves application files; it does not call AI services.

Run the workflow checks with `npm test`.

The interface uses plain HTML, CSS, and JavaScript with no external dependencies. Cases are saved in this browser’s local storage at this address; unfinished form text is saved separately per case, opening member, and debate turn in browser local storage. Use **Export backup** regularly. Clearing browser data, switching browser profiles, or changing the address can make saved work unavailable. JSON import adds cases alongside existing work; Markdown export produces a readable record or approved brief.

Signatures are statements pasted and checked by the chair, not authenticated or cryptographic identities. Review each statement’s document version and reservations before recording it. The dashboard tracks recorded handoffs; it cannot confirm delivery to a browser chat.

Browser automation and API integrations remain optional later work.

## Privacy

Local storage does not prevent disclosure when you paste context into an external chat. Handoffs should show their complete contents for review before copying. Never store account credentials in this repository.
