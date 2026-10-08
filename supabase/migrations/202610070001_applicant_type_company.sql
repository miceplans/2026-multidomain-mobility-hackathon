-- 참가 유형을 일반/기업으로 구분하고, 기업은 지역과 기업 코드를 받는다.
-- 신청서는 팀장 정보와 첨부파일만 받으므로 아이디어·팀원 관련 필수 항목은 해제한다.
alter table public.applications
  add column if not exists applicant_type text,
  add column if not exists company_region text,
  add column if not exists company_industry text,
  add column if not exists company_code text;

alter table public.applications
  drop constraint if exists applications_applicant_type_check,
  drop constraint if exists applications_company_fields_check;

alter table public.applications
  add constraint applications_applicant_type_check
    check (applicant_type in ('일반', '기업')),
  add constraint applications_company_fields_check
    check (
      (applicant_type = '기업'
        and company_region in ('부산', '울산', '경남')
        and nullif(btrim(company_industry), '') is not null
        and nullif(btrim(company_code), '') is not null)
      or (applicant_type = '일반' and company_region is null and company_industry is null and company_code is null)
      or applicant_type is null
    );

alter table public.applications
  drop constraint if exists applications_participation_type_check,
  drop constraint if exists applications_industry_check,
  drop constraint if exists applications_eligibility_confirmed_check,
  drop constraint if exists applications_exclusion_confirmed_check,
  alter column participation_type drop not null,
  alter column industry drop not null,
  alter column item_name drop not null,
  alter column item_summary drop not null,
  alter column proposal_background drop not null,
  alter column introduction_and_differentiation drop not null,
  alter column feasibility_and_business_viability drop not null,
  alter column expected_effects drop not null,
  alter column eligibility_confirmed drop not null,
  alter column exclusion_confirmed drop not null;
