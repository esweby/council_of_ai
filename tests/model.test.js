import test from 'node:test';
import assert from 'node:assert/strict';
import {createCase,reviseBriefing,freezeDocument,sign,approve,approved,agreed,prompt,markdown,validateImport} from '../model.js';
function setup(){const c=createCase('Test');reviseBriefing(c,'A constrained proposal.');freezeDocument(c,'An agreed plan.');return c;}
function signatures(c){for(const m of c.members)sign(c,m.id,'Signed','I agree to this version.','None');}
test('openings stay independent and targeted chair comments stay scoped',()=>{const c=setup();c.interventions.push({id:'a',target:c.members[0].id,type:'Context',text:'Private instruction'});const a=prompt(c,'Opening',c.members[1].id,'Peer response should be absent');assert.ok(!a.text.includes('Peer response'));assert.ok(!a.text.includes('Private instruction'));assert.ok(prompt(c,'Opening',c.members[0].id).text.includes('Private instruction'));});
test('all members must sign; chair approval is separate',()=>{const c=setup();assert.throws(()=>approve(c,'Go'));signatures(c);assert.equal(agreed(c),true);assert.equal(approved(c),false);approve(c,'Implement this scope');assert.equal(approved(c),true);assert.match(markdown(c),/CHAIR APPROVED/);});
test('blocking objection and missing reservations cannot count as agreement',()=>{const c=setup();assert.throws(()=>sign(c,c.members[0].id,'Signed','Yes',''));signatures(c);sign(c,c.members[0].id,'Changes requested','Cannot agree','Needs a test');assert.equal(agreed(c),false);});
test('document or briefing changes invalidate signatures and approval',()=>{const c=setup();signatures(c);approve(c,'Go');freezeDocument(c,'Changed plan');assert.equal(agreed(c),false);assert.equal(approved(c),false);signatures(c);approve(c,'Go again');reviseBriefing(c,'New constraints');assert.equal(agreed(c),false);assert.equal(approved(c),false);assert.equal(c.documents.length,2);assert.equal(c.signatures.length,8);});
test('replacement signature requires renewed chair approval',()=>{const c=setup();signatures(c);approve(c,'Go');sign(c,c.members[0].id,'Signed','Still agree','New reservation');assert.equal(agreed(c),true);assert.equal(approved(c),false);});
test('roster changes invalidate agreement and backup round trips',()=>{const c=setup();signatures(c);c.members.push({id:'new',name:'Extra'});assert.equal(agreed(c),false);const backup=JSON.parse(JSON.stringify({schema:1,cases:[c]}));assert.deepEqual(validateImport(backup),backup);assert.throws(()=>validateImport({schema:2,cases:[]}));});

test('roster revisions remain invalid even if the original names return',()=>{const c=setup();signatures(c);c.documents.at(-1).rosterSuperseded=true;assert.equal(agreed(c),false);});

test('initiation explains membership, implementer, roles, chair authority, and signing while preserving briefing',()=>{
const c=setup();const briefing=c.briefings.at(-1);const h=prompt(c,'Initiation',c.members[2].id,'PEER OPINIONS MUST NOT APPEAR');
assert.ok(h.text.startsWith('You are Council Member Kimi'));
for(const text of ['local implementer','independent reviewer','constructive critic','evidence checker','human chair','relayed manually','last reservations','chair’s approval is separate',briefing.body])assert.ok(h.text.includes(text),text);
assert.ok(!h.text.includes('PEER OPINIONS MUST NOT APPEAR'));
assert.equal(h.briefingId,briefing.id);assert.equal(h.memberId,c.members[2].id);assert.equal(c.briefings.at(-1).body,briefing.body);
assert.ok(prompt(c,'Opening',c.members[1].id).text.startsWith('You are Council Member DeepSeek'));
assert.ok(!prompt(c,'Grounding',c.members[0].id).text.includes('You are Council Member'));
});

import {now,openingFor,saveOpening,adoptLegacyOpenings,currentRound,pendingTurn,roundComplete,startRound,saveDebateReply,refreshDebatePrompt} from '../model.js';
function ready(){const c=createCase('Council relay');reviseBriefing(c,'Original project constraints.');for(const m of c.members)saveOpening(c,m.id,`${m.name} independent opening`);return c;}
test('openings are separate append-only records; missing openings prevent debate',()=>{
 const c=createCase('Separate members');reviseBriefing(c,'Proposal');
 saveOpening(c,c.members[0].id,'First opening');assert.throws(()=>startRound(c));
 saveOpening(c,c.members[1].id,'Second opening');saveOpening(c,c.members[0].id,'Revised first');
 assert.equal(openingFor(c,c.members[1].id).text,'Second opening');assert.equal(c.responses.length,3);
 assert.equal(openingFor(c,c.members[0].id).text,'Revised first');
});
test('first debater receives every attributed opening and clear recipient instructions',()=>{
 const c=ready(),r=startRound(c),t=pendingTurn(r),h=c.handoffs.find(h=>h.id===t.handoffId);
 assert.equal(t.memberId,c.members[0].id);assert.equal(t.toMemberId,c.members[1].id);
 for(const m of c.members)assert.ok(h.text.includes(`FROM: Council Member ${m.name}\nOpening remarks:\n${m.name} independent opening`));
 assert.ok(h.text.includes('initial debater'));assert.ok(h.text.includes('Council Member DeepSeek'));assert.ok(h.text.includes('PROPOSED DOCUMENT'));assert.ok(h.text.includes('Do not infer consent'));
});
test('saving a turn preserves the reply and automatically prepares the next member',()=>{
 const c=ready(),r=startRound(c),first=pendingTurn(r),firstPrompt=c.handoffs.find(h=>h.id===first.handoffId).text;
 saveDebateReply(c,first.id,'Gippity’s message for DeepSeek');
 assert.equal(c.responses.at(-1).author,'Gippity');assert.equal(c.responses.at(-1).text,'Gippity’s message for DeepSeek');
 const next=pendingTurn(r),h=c.handoffs.find(h=>h.id===next.handoffId);
 assert.equal(next.memberId,c.members[1].id);assert.equal(next.toMemberId,c.members[2].id);
 assert.ok(h.text.includes('Gippity’s message for DeepSeek'));assert.ok(h.text.includes('FROM: Council Member Gippity'));
 assert.equal(c.handoffs.find(h=>h.id===first.handoffId).text,firstPrompt);
 assert.throws(()=>saveDebateReply(c,first.id,'Accidental second save'));
 assert.equal(c.responses.at(-1).text,'Gippity’s message for DeepSeek');
});
test('rounds complete once every member speaks and next rounds retain history',()=>{
 const c=ready(),r=startRound(c);assert.throws(()=>startRound(c));
 for(const m of c.members){const t=pendingTurn(r);assert.equal(t.memberId,m.id);saveDebateReply(c,t.id,`${m.name} turn in round 1`);}
 assert.ok(roundComplete(r));assert.equal(pendingTurn(r),undefined);assert.equal(c.rounds.length,1);
 const second=startRound(c);assert.equal(second.number,2);assert.equal(pendingTurn(second).memberId,c.members[0].id);
 const h=c.handoffs.find(h=>h.id===pendingTurn(second).handoffId);for(const m of c.members)assert.ok(h.text.includes(`${m.name} turn in round 1`));
 const restored=validateImport(JSON.parse(JSON.stringify({schema:1,cases:[c]}))).cases[0];assert.equal(currentRound(restored).number,2);assert.equal(pendingTurn(currentRound(restored)).id,pendingTurn(second).id);
});
test('opening snapshots and completed turns survive revisions; changed briefing needs new openings',()=>{
 const c=ready(),r=startRound(c);saveOpening(c,c.members[2].id,'Changed Kimi opening');
 saveDebateReply(c,pendingTurn(r).id,'First reply');
 const h=c.handoffs.find(h=>h.id===pendingTurn(r).handoffId);assert.ok(h.text.includes('Kimi independent opening'));assert.ok(!h.text.includes('Changed Kimi opening'));
 reviseBriefing(c,'New constraints');assert.equal(currentRound(c),null);assert.throws(()=>startRound(c));assert.equal(c.rounds.length,1);assert.equal(openingFor(c,c.members[0].id),undefined);
});
test('chair intervention refreshes only pending prompt and preserves copied prompt and reply identity',()=>{
 const c=ready(),r=startRound(c),t=pendingTurn(r),old=c.handoffs.find(h=>h.id===t.handoffId);old.copiedAt='copied';
 c.interventions.push({id:'chair',type:'Redirect',target:'all',text:'Focus on cost'});const fresh=refreshDebatePrompt(c);
 assert.ok(fresh.text.includes('Focus on cost'));assert.ok(!old.text.includes('Focus on cost'));assert.equal(t.id,fresh.turnId);assert.equal(old.copiedAt,'copied');
});
test('legacy responses migrate only with an identifiable opening handoff',()=>{
 const c=ready();const h=prompt(c,'Opening',c.members[2].id);c.handoffs.push(h);
 c.responses.push({id:'old',handoffId:h.id,author:'Kimi',briefingId:h.briefingId,text:'Legacy Kimi',at:now()},{id:'unassigned',text:'Unassigned'});
 adoptLegacyOpenings(c);assert.equal(openingFor(c,c.members[2].id).text,'Legacy Kimi');assert.equal(c.responses.at(-1).stage,undefined);
});

import {orderedMembers,shuffleOrder} from '../model.js';
test('shuffle changes the next order without losing members or opening remarks',()=>{
 const c=ready(),before=c.members.map(m=>m.id);shuffleOrder(c,()=>0.999);
 assert.notDeepEqual(orderedMembers(c).map(m=>m.id),before);
 assert.deepEqual(orderedMembers(c).map(m=>m.id).sort(),before.slice().sort());
 for(const m of c.members)assert.equal(openingFor(c,m.id).text,`${m.name} independent opening`);
 const r=startRound(c);assert.deepEqual(r.members.map(m=>m.id),c.speakingOrder);
 assert.equal(pendingTurn(r).memberId,c.speakingOrder[0]);assert.equal(pendingTurn(r).toMemberId,c.speakingOrder[1]);
});
test('shuffle preserves active round, pending turn, prompts, and final signatures',()=>{
 const c=ready(),r=startRound(c),old=JSON.stringify(r),pending=pendingTurn(r),promptText=c.handoffs.find(h=>h.id===pending.handoffId).text;
 shuffleOrder(c,()=>0);assert.equal(currentRound(c),r);assert.equal(JSON.stringify(r),old);
 assert.equal(c.handoffs.find(h=>h.id===pending.handoffId).text,promptText);
 for(let i=0;i<c.members.length;i++)saveDebateReply(c,pendingTurn(r).id,'Saved reply '+i);
 const next=startRound(c);assert.deepEqual(next.members.map(m=>m.id),c.speakingOrder);
 const signed=setup();signatures(signed);approve(signed,'Approved');shuffleOrder(signed,()=>0);assert.equal(approved(signed),true);
});

import {setPersona} from '../model.js';
test('personas apply only to their member and persist with the case',()=>{
 const c=ready();setPersona(c,c.members[0].id,'Pragmatic architect');
 assert.ok(prompt(c,'Opening',c.members[0].id).text.includes('CHAIR-ASSIGNED PERSONA: Pragmatic architect'));
 assert.ok(!prompt(c,'Opening',c.members[1].id).text.includes('Pragmatic architect'));
 assert.ok(!prompt(c,'Grounding',c.members[0].id).text.includes('Pragmatic architect'));
 const restored=validateImport(JSON.parse(JSON.stringify({schema:1,cases:[c]}))).cases[0];assert.equal(restored.personas[c.members[0].id],'Pragmatic architect');
 setPersona(c,c.members[0].id,'');assert.ok(!prompt(c,'Opening',c.members[0].id).text.includes('CHAIR-ASSIGNED PERSONA'));
});
test('persona edits refresh pending debate prompt without changing prior prompts or turn identity',()=>{
 const c=ready(),r=startRound(c),t=pendingTurn(r),old=c.handoffs.find(h=>h.id===t.handoffId);old.copiedAt='copied';
 setPersona(c,t.memberId,'Evidence-focused sceptic');assert.equal(pendingTurn(r).id,t.id);
 assert.ok(c.handoffs.find(h=>h.id===t.handoffId).text.includes('Evidence-focused sceptic'));
 assert.ok(!old.text.includes('Evidence-focused sceptic'));assert.equal(old.copiedAt,'copied');
});

import {implementerRequest,injectImplementer} from '../model.js';
test('implementer intervention is separate evidence and preserves the pending turn and copied prompt',()=>{
 const c=ready(),r=startRound(c),t=pendingTurn(r),old=c.handoffs.find(h=>h.id===t.handoffId);old.copiedAt='copied';
 injectImplementer(c,{question:'Is this feasible?',text:'Verified: this can use the existing storage.',requestedBy:'Gippity'});
 assert.equal(pendingTurn(r).id,t.id);assert.equal(t.responseId,null);assert.ok(!old.text.includes('Verified:'));
 const fresh=c.handoffs.find(h=>h.id===t.handoffId);assert.ok(fresh.text.includes('FROM: Implementer'));assert.ok(fresh.text.includes('Requested by: Gippity'));assert.ok(fresh.text.includes('Verified:'));
 assert.ok(!fresh.text.split('CHAIR DIRECTIONS FOR YOU')[1].split('IMPLEMENTER INTERVENTIONS')[0].includes('Verified:'));
 assert.ok(implementerRequest(c,'What about cost?','Chair').includes('Is this feasible?'));
 assert.ok(markdown(c).includes('Is this feasible?'));
});
test('implementer evidence respects audience and briefing version, including while paused',()=>{
 const c=ready();c.paused=true;injectImplementer(c,{text:'Targeted technical evidence',target:c.members[1].id});
 assert.ok(!prompt(c,'Opening',c.members[0].id).text.includes('Targeted technical evidence'));
 assert.ok(prompt(c,'Opening',c.members[1].id).text.includes('Targeted technical evidence'));
 reviseBriefing(c,'Different project assumptions');assert.ok(!prompt(c,'Opening',c.members[1].id).text.includes('Targeted technical evidence'));
 assert.throws(()=>injectImplementer(c,{text:''}));
});

import {skipReviewer} from '../model.js';
test('skip current reviewer advances without manufacturing a response',()=>{
 const c=ready(),r=startRound(c),first=pendingTurn(r),count=c.responses.length;
 skipReviewer(c,first.id);assert.ok(first.skippedAt);assert.equal(first.responseId,null);assert.equal(c.responses.length,count);
 assert.equal(pendingTurn(r).memberId,c.members[1].id);assert.ok(c.handoffs.find(h=>h.id===pendingTurn(r).handoffId).text.includes('skipped by chair'));
});
test('skip upcoming reviewer reroutes pending prompt, preserves saved turns, and completes round',()=>{
 const c=ready(),r=startRound(c),first=pendingTurn(r);skipReviewer(c,r.turns[1].id);
 assert.equal(pendingTurn(r).id,first.id);assert.equal(first.toMemberId,c.members[2].id);
 saveDebateReply(c,first.id,'Actual reply');const savedPrompt=c.handoffs.find(h=>h.id===first.handoffId).text;
 skipReviewer(c,pendingTurn(r).id);skipReviewer(c,pendingTurn(r).id);assert.ok(roundComplete(r));assert.equal(pendingTurn(r),undefined);
 assert.equal(c.handoffs.find(h=>h.id===first.handoffId).text,savedPrompt);assert.equal(agreed(c),false);
 assert.ok(markdown(c).includes('Skipped debate turns'));assert.throws(()=>skipReviewer(c,first.id));
 const next=startRound(c);assert.equal(next.turns.length,4);assert.ok(next.turns.every(t=>!t.skippedAt));
});

import {prepareSummary,useSummary,activeSummary,disableSummary} from '../model.js';
test('summary activation replaces covered briefing and discussion but retains newer responses and chair directions',()=>{
 const c=ready(),r=startRound(c);saveDebateReply(c,pendingTurn(r).id,'OLD LONG MESSAGE');
 const request=prepareSummary(c,'My chosen model',600);assert.ok(request.text.includes('OLD LONG MESSAGE'));assert.ok(request.text.includes('Original project constraints.'));
 saveDebateReply(c,pendingTurn(r).id,'NEW MESSAGE AFTER CHECKPOINT');c.interventions.push({id:'new-chair',target:'all',type:'Redirect',text:'NEW CHAIR DIRECTION'});
 const id=pendingTurn(r).id;assert.throws(()=>useSummary(c,request.id,'Short summary',false));
 useSummary(c,request.id,'REVIEWED concise constraints and dissent.',true);
 const h=c.handoffs.find(h=>h.id===pendingTurn(r).handoffId);assert.equal(pendingTurn(r).id,id);
 assert.ok(h.text.includes('REVIEWED concise'));assert.ok(!h.text.includes('OLD LONG MESSAGE'));assert.ok(!h.text.includes('Original project constraints.'));assert.ok(!h.text.includes('Gippity independent opening'));
 assert.ok(h.text.includes('NEW MESSAGE AFTER CHECKPOINT'));assert.ok(h.text.includes('NEW CHAIR DIRECTION'));
 assert.ok(c.responses.some(v=>v.text==='OLD LONG MESSAGE'));disableSummary(c);assert.equal(activeSummary(c),null);assert.ok(c.handoffs.find(h=>h.id===pendingTurn(r).handoffId).text.includes('OLD LONG MESSAGE'));
});
test('shared summary packet does not broaden targeted evidence and expires with its briefing',()=>{
 const c=ready();injectImplementer(c,{text:'MEMBER-ONLY EVIDENCE',target:c.members[1].id});injectImplementer(c,{text:'SHARED VERIFIED CHECK'});
 const request=prepareSummary(c);assert.ok(!request.text.includes('MEMBER-ONLY EVIDENCE'));assert.ok(request.text.includes('SHARED VERIFIED CHECK'));
 useSummary(c,request.id,'Shared evidence has been summarised.',true);const r=startRound(c);
 assert.ok(!c.handoffs.find(h=>h.id===pendingTurn(r).handoffId).text.includes('SHARED VERIFIED CHECK'));
 saveDebateReply(c,pendingTurn(r).id,'First post-summary response');assert.ok(c.handoffs.find(h=>h.id===pendingTurn(r).handoffId).text.includes('MEMBER-ONLY EVIDENCE'));
 reviseBriefing(c,'Changed briefing');assert.equal(activeSummary(c),null);assert.throws(()=>useSummary(c,request.id,'Old summary',true));
});

import {prepareFinalSummary,saveFinalSummary,currentFinalSummary,exportFinalSummary} from '../model.js';
test('outcome summary uses the final document and reservations without debate history',()=>{
 const c=setup();c.responses.push({text:'DEBATE NOISE',author:'Gippity',at:now()});signatures(c);const request=prepareFinalSummary(c);
 assert.ok(request.text.includes('An agreed plan.'));assert.ok(!request.text.includes('DEBATE NOISE'));assert.ok(request.text.includes('Last reservations: None'));
 saveFinalSummary(c,request.id,'Concise agreed plan; chair approval pending.',true);assert.ok(currentFinalSummary(c));assert.ok(exportFinalSummary(c).includes('Last reservations (verbatim)'));
 approve(c,'Proceed');assert.equal(currentFinalSummary(c),null);assert.throws(()=>saveFinalSummary(c,request.id,'Stale',true));
 const fresh=prepareFinalSummary(c);saveFinalSummary(c,fresh.id,'Approved scope.',true);freezeDocument(c,'Revised plan');assert.equal(currentFinalSummary(c),null);
});

import {implementerNote,saveImplementerNote,implementerHandoff,implementerNoteRequest} from '../model.js';
test('final-document implementer notes stay separate per member and appear in the handoff',()=>{
 const c=setup();saveImplementerNote(c,c.members[0].id,'Check the persistence migration.');saveImplementerNote(c,c.members[1].id,'Which tests prove this?');saveImplementerNote(c,c.members[0].id,'Check backup and migration.');
 assert.equal(implementerNote(c,c.members[1].id).text,'Which tests prove this?');assert.equal(c.implementerNotes.length,3);
 const packet=implementerHandoff(c);assert.ok(packet.includes('An agreed plan.'));assert.ok(packet.includes('FROM: Council Member DeepSeek'));assert.ok(packet.includes('Which tests prove this?'));assert.ok(packet.includes('agreement incomplete'));
 assert.ok(implementerNoteRequest(c,c.members[0].id).includes('QUESTIONS FOR IMPLEMENTER'));
 freezeDocument(c,'A new plan');assert.equal(implementerNote(c,c.members[0].id),null);assert.ok(!implementerHandoff(c).includes('Check backup and migration.'));
});

import {saveSimpleSignoff,latest} from '../model.js';
test('simple sign-off preserves full reply and links the member to the current document',()=>{
 const c=setup(),reply='AGREED\nSigned: Gippity\nLast reservations: Check migration before rollout.';
 const s=saveSimpleSignoff(c,c.members[0].id,reply,'Signed');assert.equal(s.documentId,latest(c).id);assert.equal(s.fullReply,reply);assert.equal(s.reservations,'Check migration before rollout.');
 const raw='I need the migration tested before I can agree.';const declined=saveSimpleSignoff(c,c.members[1].id,raw,'Changes requested');assert.equal(declined.reservations,raw);assert.equal(agreed(c),false);
 assert.throws(()=>saveSimpleSignoff(c,c.members[2].id,'','Signed'));
});

import {skipApproval,signoffComplete} from '../model.js';
test('skipped approval permits chair decision without implying unanimous council agreement',()=>{
 const c=setup();for(const m of c.members.slice(0,3))saveSimpleSignoff(c,m.id,'AGREED. Last reservations: None','Signed');
 assert.equal(signoffComplete(c),false);skipApproval(c,c.members[3].id);assert.equal(signoffComplete(c),true);assert.equal(agreed(c),false);
 approve(c,'Proceed with Gemini approval skipped.');assert.equal(approved(c),true);assert.ok(implementerHandoff(c).includes('approval skipped: Gemini'));assert.ok(markdown(c).includes('approval skipped: Gemini'));
 saveSimpleSignoff(c,c.members[3].id,'AGREED. Last reservations: Check tests.','Signed');assert.equal(approved(c),false);assert.equal(agreed(c),true);
});
test('skip approval retains existing reservations and is scoped to its document version',()=>{
 const c=setup();saveSimpleSignoff(c,c.members[0].id,'CHANGES REQUESTED. Last reservations: Needs migration testing.','Changes requested');
 skipApproval(c,c.members[0].id);assert.equal(c.signatures.at(-1).reservations,'Needs migration testing.');assert.equal(c.signatures.length,2);
 freezeDocument(c,'Revised');assert.equal(signoffComplete(c),false);
});

import {removeCouncilMember,restoreCouncilMember} from '../model.js';
test('removing the active speaker preserves the round and advances without losing contributions',()=>{
 const c=ready(),r=startRound(c),first=pendingTurn(r),originalId=first.memberId,oldPrompt=c.handoffs.find(h=>h.id===first.handoffId).text;
 removeCouncilMember(c,originalId);assert.equal(currentRound(c),r);assert.ok(first.skippedAt);assert.equal(c.members.length,3);
 assert.equal(pendingTurn(r).memberId,r.members[1].id);assert.equal(c.handoffs.find(h=>h.id===first.handoffId).text,oldPrompt);assert.ok(c.responses.some(v=>v.memberId===originalId));
 while(pendingTurn(r))saveDebateReply(c,pendingTurn(r).id,'Continuing reply');assert.ok(roundComplete(r));const next=startRound(c);assert.equal(next.members.length,3);assert.ok(!next.members.some(m=>m.id===originalId));
});
test('removing an upcoming or completed member reroutes safely and supports restoration',()=>{
 const c=ready(),r=startRound(c),first=pendingTurn(r),nextId=r.members[1].id;
 removeCouncilMember(c,nextId);assert.equal(pendingTurn(r).id,first.id);assert.equal(first.toMemberId,r.members[2].id);
 restoreCouncilMember(c,nextId);assert.equal(currentRound(c),r);assert.ok(r.turns[1].skippedAt);assert.equal(c.members.length,4);
 saveDebateReply(c,first.id,'Saved reply stays');removeCouncilMember(c,first.memberId);assert.equal(currentRound(c),r);assert.ok(c.responses.some(v=>v.text==='Saved reply stays'));
 removeCouncilMember(c,r.members[1].id);removeCouncilMember(c,r.members[2].id);assert.equal(c.members.length,1);assert.throws(()=>removeCouncilMember(c,c.members[0].id));
});
