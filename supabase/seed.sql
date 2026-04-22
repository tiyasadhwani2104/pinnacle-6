insert into accounts (platform, handle) values
  ('X', '@alpha_watch'),
  ('Telegram', '@signal_desk'),
  ('Forum', 'voicegrid_mod'),
  ('Email', 'alertnode@updates-mail.net'),
  ('X', '@civic_scope'),
  ('Telegram', '@channel_seventeen')
on conflict (platform, handle) do nothing;

insert into hashtags (tag) values
  ('#urgent'),
  ('#verifyNow'),
  ('#breaking'),
  ('#truthDrop'),
  ('#citizenUpdate'),
  ('#secureLink'),
  ('#electionWatch'),
  ('#publicAlert')
on conflict (tag) do nothing;

insert into urls (url) values
  ('https://account-check-portal.co/login'),
  ('https://fake-secure-update.net/verify'),
  ('https://daily-civic-wire.info/relief'),
  ('https://public-alerts-now.info/report'),
  ('https://election-helpdesk.support/channel'),
  ('https://news-bulletin-hub.net/live')
on conflict (url) do nothing;

insert into posts (account_id, source_platform, content, narrative_label, created_at)
select id, 'X',
'Urgent security notice: national scholarship portal requires account reconfirmation within 20 minutes. Use the link provided to avoid losing access.',
'credential-phishing',
now() - interval '6 hours'
from accounts where handle = '@alpha_watch'
union all
select id, 'Telegram',
'Officials have secretly delayed disaster relief funds in three districts. Share this before mainstream channels remove it.',
'civic-disinformation',
now() - interval '5 hours 30 minutes'
from accounts where handle = '@signal_desk'
union all
select id, 'Forum',
'Several posts are repeating a claim that verified election hotlines are compromised and should be ignored.',
'election-disruption',
now() - interval '5 hours'
from accounts where handle = 'voicegrid_mod'
union all
select id, 'Email',
'Action required: your defense internship portal login will expire today unless identity verification is completed immediately.',
'credential-phishing',
now() - interval '4 hours 30 minutes'
from accounts where handle = 'alertnode@updates-mail.net'
union all
select id, 'X',
'Multiple accounts are pushing the same rumor that emergency services are being redirected away from border districts.',
'coordinated-rumor',
now() - interval '4 hours'
from accounts where handle = '@civic_scope'
union all
select id, 'Telegram',
'A recycled message claims public safety maps were altered overnight and only one unofficial channel has the correct version.',
'map-disinformation',
now() - interval '3 hours 30 minutes'
from accounts where handle = '@channel_seventeen'
union all
select id, 'X',
'Breaking: citizens are being told to log in again through a new secure access page to preserve subsidy eligibility.',
'credential-phishing',
now() - interval '3 hours'
from accounts where handle = '@alpha_watch'
union all
select id, 'Telegram',
'This message insists a hidden memo proves regional voting booths will close early, encouraging people to rely on rumor instead of official updates.',
'election-disruption',
now() - interval '2 hours 30 minutes'
from accounts where handle = '@signal_desk'
union all
select id, 'Forum',
'Users are amplifying a narrative that official weather alerts cannot be trusted and that only reposted screenshots are reliable.',
'public-safety-disinformation',
now() - interval '2 hours'
from accounts where handle = 'voicegrid_mod'
union all
select id, 'Email',
'Verify your account now to retain access to the public grants dashboard. Delays may lead to suspension.',
'credential-phishing',
now() - interval '90 minutes'
from accounts where handle = 'alertnode@updates-mail.net'
union all
select id, 'X',
'Coordinated posts are recycling the same talking points to claim relief trucks were intentionally withheld from one community.',
'coordinated-rumor',
now() - interval '60 minutes'
from accounts where handle = '@civic_scope'
union all
select id, 'Telegram',
'A rapidly forwarded message says only one unofficial helpdesk link can confirm polling station changes.',
'election-disruption',
now() - interval '30 minutes'
from accounts where handle = '@channel_seventeen';

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#urgent'
where p.content like 'Urgent security notice:%'
on conflict do nothing;

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#secureLink'
where p.content like 'Urgent security notice:%'
on conflict do nothing;

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#truthDrop'
where p.content like 'Officials have secretly delayed disaster relief funds%'
on conflict do nothing;

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#citizenUpdate'
where p.content like 'Officials have secretly delayed disaster relief funds%'
on conflict do nothing;

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#electionWatch'
where p.narrative_label = 'election-disruption'
on conflict do nothing;

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#publicAlert'
where p.narrative_label in ('public-safety-disinformation', 'map-disinformation')
on conflict do nothing;

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#verifyNow'
where p.narrative_label = 'credential-phishing'
on conflict do nothing;

insert into post_hashtags (post_id, hashtag_id)
select p.id, h.id
from posts p
join hashtags h on h.tag = '#breaking'
where p.narrative_label in ('coordinated-rumor', 'civic-disinformation')
on conflict do nothing;

insert into post_urls (post_id, url_id)
select p.id, u.id
from posts p
join urls u on u.url = 'https://fake-secure-update.net/verify'
where p.content like 'Urgent security notice:%'
on conflict do nothing;

insert into post_urls (post_id, url_id)
select p.id, u.id
from posts p
join urls u on u.url = 'https://daily-civic-wire.info/relief'
where p.content like 'Officials have secretly delayed disaster relief funds%'
on conflict do nothing;

insert into post_urls (post_id, url_id)
select p.id, u.id
from posts p
join urls u on u.url = 'https://election-helpdesk.support/channel'
where p.narrative_label = 'election-disruption'
on conflict do nothing;

insert into post_urls (post_id, url_id)
select p.id, u.id
from posts p
join urls u on u.url = 'https://account-check-portal.co/login'
where p.content like 'Action required: your defense internship portal login%'
   or p.content like 'Breaking: citizens are being told to log in again%'
   or p.content like 'Verify your account now to retain access%'
on conflict do nothing;

insert into post_urls (post_id, url_id)
select p.id, u.id
from posts p
join urls u on u.url = 'https://public-alerts-now.info/report'
where p.narrative_label in ('public-safety-disinformation', 'map-disinformation')
on conflict do nothing;

insert into analysis_results (
  post_id,
  groq_summary,
  groq_risk_score,
  hf_label,
  hf_score,
  coordination_score,
  final_risk_score,
  explanation
)
select
  p.id,
  'High-pressure language and suspicious verification framing indicate likely phishing intent.',
  88.00,
  'phishing',
  0.9600,
  62.00,
  84.30,
  'The text uses urgency, account loss pressure, and an external verification request.'
from posts p
where p.content like 'Urgent security notice:%'
on conflict (post_id) do nothing;

insert into analysis_results (
  post_id,
  groq_summary,
  groq_risk_score,
  hf_label,
  hf_score,
  coordination_score,
  final_risk_score,
  explanation
)
select
  p.id,
  'Narrative encourages distrust in official channels and urges rapid sharing.',
  79.00,
  'disinformation',
  0.9100,
  58.00,
  77.35,
  'The message promotes an unverified civic rumor and weaponizes scarcity of trusted information.'
from posts p
where p.content like 'Officials have secretly delayed disaster relief funds%'
on conflict (post_id) do nothing;

insert into analysis_results (
  post_id,
  groq_summary,
  groq_risk_score,
  hf_label,
  hf_score,
  coordination_score,
  final_risk_score,
  explanation
)
select
  p.id,
  'Repeated election hotline distrust framing suggests coordinated influence behavior.',
  81.00,
  'disinformation',
  0.8900,
  66.00,
  80.80,
  'The post undermines official election guidance and aligns with repeated cross-channel narratives.'
from posts p
where p.content like 'Several posts are repeating a claim that verified election hotlines%'
on conflict (post_id) do nothing;

insert into analysis_results (
  post_id,
  groq_summary,
  groq_risk_score,
  hf_label,
  hf_score,
  coordination_score,
  final_risk_score,
  explanation
)
select
  p.id,
  'Credential harvesting indicators are present in the account-verification request.',
  91.00,
  'phishing',
  0.9800,
  54.00,
  85.60,
  'The email-style text uses a deadline and fake identity verification lure.'
from posts p
where p.content like 'Action required: your defense internship portal login%'
on conflict (post_id) do nothing;

insert into analysis_results (
  post_id,
  groq_summary,
  groq_risk_score,
  hf_label,
  hf_score,
  coordination_score,
  final_risk_score,
  explanation
)
select
  p.id,
  'Multiple coordinated posts appear to reinforce a single rumor about relief disruption.',
  74.00,
  'disinformation',
  0.8700,
  72.00,
  78.05,
  'The narrative appears repeated across accounts and relies on emotionally charged civic distrust.'
from posts p
where p.content like 'Multiple accounts are pushing the same rumor%'
on conflict (post_id) do nothing;

insert into campaign_clusters (
  cluster_name,
  narrative_label,
  repeated_url,
  repeated_hashtag,
  coordination_score
) values
  (
    'Credential Harvest Cluster A',
    'credential-phishing',
    'https://account-check-portal.co/login',
    '#verifyNow',
    82.00
  ),
  (
    'Election Misinformation Wave',
    'election-disruption',
    'https://election-helpdesk.support/channel',
    '#electionWatch',
    78.00
  ),
  (
    'Relief Distrust Narrative',
    'coordinated-rumor',
    'https://daily-civic-wire.info/relief',
    '#breaking',
    71.00
  )
on conflict (cluster_name) do nothing;

insert into audit_chain (event_type, payload_hash, previous_hash, current_hash, created_at)
values (
  'SEED_INIT',
  encode(digest('seed-init', 'sha256'), 'hex'),
  null,
  encode(digest('SEED_INIT' || encode(digest('seed-init', 'sha256'), 'hex') || coalesce(null, '') || to_char(now() - interval '4 hours', 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 'sha256'), 'hex'),
  now() - interval '4 hours'
);

insert into audit_chain (event_type, payload_hash, previous_hash, current_hash, created_at)
select
  'POST_IMPORT',
  encode(digest('post-import-batch-01', 'sha256'), 'hex'),
  a.current_hash,
  encode(digest('POST_IMPORT' || encode(digest('post-import-batch-01', 'sha256'), 'hex') || a.current_hash || to_char(now() - interval '3 hours', 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 'sha256'), 'hex'),
  now() - interval '3 hours'
from audit_chain a
order by a.created_at desc
limit 1;

insert into audit_chain (event_type, payload_hash, previous_hash, current_hash, created_at)
select
  'URL_LINKING',
  encode(digest('url-link-batch-01', 'sha256'), 'hex'),
  a.current_hash,
  encode(digest('URL_LINKING' || encode(digest('url-link-batch-01', 'sha256'), 'hex') || a.current_hash || to_char(now() - interval '2 hours', 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 'sha256'), 'hex'),
  now() - interval '2 hours'
from audit_chain a
order by a.created_at desc
limit 1;

insert into audit_chain (event_type, payload_hash, previous_hash, current_hash, created_at)
select
  'ANALYSIS_SNAPSHOT',
  encode(digest('analysis-snapshot-01', 'sha256'), 'hex'),
  a.current_hash,
  encode(digest('ANALYSIS_SNAPSHOT' || encode(digest('analysis-snapshot-01', 'sha256'), 'hex') || a.current_hash || to_char(now() - interval '90 minutes', 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 'sha256'), 'hex'),
  now() - interval '90 minutes'
from audit_chain a
order by a.created_at desc
limit 1;

insert into audit_chain (event_type, payload_hash, previous_hash, current_hash, created_at)
select
  'CAMPAIGN_CLUSTERED',
  encode(digest('campaign-cluster-01', 'sha256'), 'hex'),
  a.current_hash,
  encode(digest('CAMPAIGN_CLUSTERED' || encode(digest('campaign-cluster-01', 'sha256'), 'hex') || a.current_hash || to_char(now() - interval '30 minutes', 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 'sha256'), 'hex'),
  now() - interval '30 minutes'
from audit_chain a
order by a.created_at desc
limit 1;
