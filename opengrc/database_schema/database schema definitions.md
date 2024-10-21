
as of 20-Oct

## core tables

### audits

```
create table

public.audits (

id uuid not null default extensions.uuid_generate_v4 (),

audit_name text not null,

scope text null,

description text null,

related_circulars text[] null,

planned_start_date date null,

planned_end_date date null,

actual_start_date date null,

actual_end_date date null,

key_stakeholders text[] null,

audit_partner text null,

engagement_lead text null,

workflow_status text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

company_info_id uuid null,

auditor_id uuid null,

auditee_id uuid null,

constraint audits_pkey primary key (id),

constraint fk_audits_auditee foreign key (auditee_id) references users (id),

constraint fk_audits_auditor foreign key (auditor_id) references users (id),

constraint fk_audits_company_info foreign key (company_info_id) references company_info (id),

constraint audits_workflow_status_check check (

(

workflow_status = any (

array[

'Planned'::text,

'In Progress'::text,

'Reporting'::text,

'Closed'::text

]

)

)

)

) tablespace pg_default;
```


### authority documents

```
create table

public.authority_documents (

id uuid not null default extensions.uuid_generate_v4 (),

title text not null,

type text null,

identifier text null,

issuing_body text null,

version text null,

publication_date date null,

description text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

company_info_id uuid null,

product_owner_id uuid null,

compliance_manager_id uuid null,

constraint authority_documents_pkey primary key (id),

constraint fk_auth_docs_company_info foreign key (company_info_id) references company_info (id),

constraint fk_auth_docs_compliance_manager foreign key (compliance_manager_id) references users (id),

constraint fk_auth_docs_product_owner foreign key (product_owner_id) references users (id),

constraint authority_documents_type_check check (

(

type = any (

array[

'Circular'::text,

'Certification'::text,

'Standard'::text

]

)

)

)

) tablespace pg_default;
```


### citations

```
create table

public.citations (

id uuid not null default extensions.uuid_generate_v4 (),

authority_document_id uuid null,

citation_text text not null,

reference_identifier text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

company_info_id uuid null,

compliance_manager_id uuid null,

control_id uuid null,

tasks_count integer null default 0,

constraint citations_pkey primary key (id),

constraint citations_authority_document_id_fkey foreign key (authority_document_id) references authority_documents (id),

constraint fk_citations_company_info foreign key (company_info_id) references company_info (id),

constraint fk_citations_compliance_manager foreign key (compliance_manager_id) references users (id),

constraint fk_citations_control foreign key (control_id) references controls (id)

) tablespace pg_default;
```


### controls

```
create table

public.controls (

id uuid not null default extensions.uuid_generate_v4 (),

control_id text not null,

domain text null,

control_requirements text null,

risk_statement text null,

current_implementation text null,

enhancements text null,

compliance_level text null,

implementation_guidance text null,

control_type text null,

control_frequency text null,

control_design text null,

technological_enabler text null,

management_level text null,

compliance_status text null,

workflow_status text null,

framework_name text null,

framework_version text null,

framework_description text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

control_owner_id uuid null,

process_owner_id uuid null,

compliance_spoc_id uuid null,

company_info_id uuid null,

citation_ids uuid[] null,

constraint controls_pkey primary key (id),

constraint controls_control_id_key unique (control_id),

constraint fk_controls_company_info foreign key (company_info_id) references company_info (id),

constraint controls_compliance_spoc_id_fkey foreign key (compliance_spoc_id) references users (id),

constraint controls_control_owner_id_fkey foreign key (control_owner_id) references users (id),

constraint controls_process_owner_id_fkey foreign key (process_owner_id) references users (id),

constraint check_control_type check (

(

control_type = any (

array[

'Preventive'::text,

'Detective'::text,

'Corrective'::text

]

)

)

),

constraint controls_workflow_status_check check (

(

workflow_status = any (

array[

'Draft'::text,

'In Review'::text,

'Approved'::text,

'Retired'::text

]

)

)

),

constraint check_control_frequency check (

(

control_frequency = any (

array[

'Continuous'::text,

'Daily'::text,

'Weekly'::text,

'Monthly'::text,

'Quarterly'::text,

'Annually'::text

]

)

)

),

constraint check_management_level check (

(

management_level = any (

array[

'Strategic'::text,

'Tactical'::text,

'Operational'::text

]

)

)

),

constraint check_control_design check (

(

control_design = any (

array['Manual'::text, 'Automated'::text, 'Hybrid'::text]

)

)

),

constraint controls_compliance_status_check check (

(

compliance_status = any (

array[

'Not Implemented'::text,

'Partially Implemented'::text,

'Implemented'::text,

'Not Applicable'::text

]

)

)

)

) tablespace pg_default;
```


### policies

```
create table

public.policies (

id uuid not null default extensions.uuid_generate_v4 (),

policy_name text not null,

purpose text null,

prepared_by text null,

reviewed_by text null,

prepared_date date null,

review_date date null,

next_revision_due_date date null,

policy_link text null,

workflow_status text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

company_info_id uuid null,

policy_owner_id uuid null,

approver_id uuid null,

constraint policies_pkey primary key (id),

constraint fk_policies_approver foreign key (approver_id) references users (id),

constraint fk_policies_company_info foreign key (company_info_id) references company_info (id),

constraint fk_policies_owner foreign key (policy_owner_id) references users (id),

constraint policies_workflow_status_check check (

(

workflow_status = any (

array[

'Draft'::text,

'Under Review'::text,

'Approved'::text,

'Published'::text

]

)

)

)

) tablespace pg_default;
```

### risks

```
create table

public.risks (

id uuid not null default extensions.uuid_generate_v4 (),

risk_summary text not null,

description text null,

entity_id uuid null,

assets text[] null,

impact_type text null,

impact text null,

likelihood text null,

inherent_risk_level text null,

risk_response text null,

risk_due_date date null,

residual_risk_level text null,

compensating_controls text null,

mitigating_controls text null,

risk_acceptance_justifications text null,

workflow_status text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

risk_id text null,

company_info_id uuid null,

risk_owner_id uuid null,

risk_reporter_id uuid null,

risk_manager_id uuid null,

constraint risks_pkey primary key (id),

constraint fk_risks_manager foreign key (risk_manager_id) references users (id),

constraint fk_risks_owner foreign key (risk_owner_id) references users (id),

constraint fk_risks_reporter foreign key (risk_reporter_id) references users (id),

constraint risks_entity_id_fkey foreign key (entity_id) references company_info (id),

constraint fk_risks_company_info foreign key (company_info_id) references company_info (id),

constraint check_impact_type check (

(

impact_type = any (

array[

'Financial'::text,

'Operational'::text,

'Reputational'::text,

'Compliance'::text

]

)

)

),

constraint risks_workflow_status_check check (

(

workflow_status = any (

array[

'Identified'::text,

'Assessed'::text,

'Treated'::text,

'Monitored'::text

]

)

)

),

constraint risks_impact_check check (

(

impact = any (

array[

'Critical'::text,

'High'::text,

'Medium'::text,

'Low'::text

]

)

)

),

constraint risks_inherent_risk_level_check check (

(

inherent_risk_level = any (

array[

'Critical'::text,

'High'::text,

'Medium'::text,

'Low'::text

]

)

)

),

constraint risks_likelihood_check check (

(

likelihood = any (

array[

'Rare'::text,

'Slightly Likely'::text,

'Likely'::text,

'Almost Certain'::text

]

)

)

),

constraint risks_residual_risk_level_check check (

(

residual_risk_level = any (

array[

'Critical'::text,

'High'::text,

'Medium'::text,

'Low'::text

]

)

)

),

constraint risks_risk_response_check check (

(

risk_response = any (

array[

'Treat'::text,

'Transfer'::text,

'Terminate'::text,

'Accept'::text

]

)

)

)

) tablespace pg_default;
```

### secure_by_design

```
create table

public.secure_by_design (

id uuid not null default extensions.uuid_generate_v4 (),

product_name text not null,

description text null,

product_type text null,

expected_go_live_date date null,

entity_id uuid null,

infrastructure_details text null,

external_party_involvement boolean null,

applicable_compliances text[] null,

advisory_provided text null,

reviewer text null,

workflow_status text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

company_info_id uuid null,

product_owner_id uuid null,

sbd_reviewer_id uuid null,

constraint secure_by_design_pkey primary key (id),

constraint fk_sbd_product_owner foreign key (product_owner_id) references users (id),

constraint fk_sbd_reviewer foreign key (sbd_reviewer_id) references users (id),

constraint fk_sbd_company_info foreign key (company_info_id) references company_info (id),

constraint secure_by_design_entity_id_fkey foreign key (entity_id) references company_info (id),

constraint secure_by_design_product_type_check check (

(

product_type = any (array['New'::text, 'Existing'::text])

)

),

constraint secure_by_design_workflow_status_check check (

(

workflow_status = any (

array[

'Initiation'::text,

'Design Review'::text,

'Implementation'::text,

'Verification'::text

]

)

)

)

) tablespace pg_default;
```

### testing

```
create table

public.testing (

id uuid not null default extensions.uuid_generate_v4 (),

control_id uuid null,

evidence_request text null,

audit_strategy text null,

test_of_design text null,

test_of_effectiveness text null,

test_results text null,

compliance_status text null,

workflow_status text null,

test_date date null,

tester text null,

notes text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

company_info_id uuid null,

evidence_provider_id uuid null,

compliance_manager_id uuid null,

tasks_count integer null default 0,

constraint testing_pkey primary key (id),

constraint testing_control_id_fkey foreign key (control_id) references controls (id),

constraint fk_testing_compliance_manager foreign key (compliance_manager_id) references users (id),

constraint fk_testing_evidence_provider foreign key (evidence_provider_id) references users (id),

constraint fk_testing_company_info foreign key (company_info_id) references company_info (id),

constraint testing_workflow_status_check check (

(

workflow_status = any (

array[

'Planned'::text,

'In Progress'::text,

'Completed'::text,

'Reviewed'::text

]

)

)

),

constraint testing_compliance_status_check check (

(

compliance_status = any (

array[

'Not Tested'::text,

'Failed'::text,

'Passed with Exceptions'::text,

'Passed'::text

]

)

)

),

constraint check_audit_strategy check (

(

audit_strategy = any (

array[

'Substantive'::text,

'Control-based'::text,

'Combined'::text,

'Risk-based'::text,

'Compliance-based'::text

]

)

)

)

) tablespace pg_default;
```

## common tables

### assets

```
create table

public.assets (

id uuid not null default extensions.uuid_generate_v4 (),

name text not null,

description text null,

asset_type text null,

owner text null,

classification text null,

status text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

constraint assets_pkey primary key (id),

constraint check_asset_type check (

(

asset_type = any (

array[

'Hardware'::text,

'Software'::text,

'Network'::text,

'Data'::text,

'Personnel'::text,

'Facility'::text

]

)

)

),

constraint check_classification check (

(

classification = any (

array[

'Public'::text,

'Internal'::text,

'Confidential'::text,

'Restricted'::text

]

)

)

),

constraint check_status check (

(

status = any (

array[

'Active'::text,

'Inactive'::text,

'Disposed'::text,

'In Maintenance'::text

]

)

)

)

) tablespace pg_default;
```

### asset tags

```
create table
  public.asset_tags (
    id uuid not null default extensions.uuid_generate_v4 (),
    asset_id uuid not null,
    entity_type text not null,
    entity_id uuid not null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    constraint asset_tags_pkey primary key (id),
    constraint fk_asset_tags_asset foreign key (asset_id) references assets (id) on delete cascade,
    constraint asset_tags_entity_type_check check (
      (
        entity_type = any (
          array[
            'risks'::text,
            'controls'::text,
            'testing'::text,
            'secure_by_design'::text
          ]
        )
      )
    )
  ) tablespace pg_default;

create index if not exists idx_asset_tags_asset_id on public.asset_tags using btree (asset_id) tablespace pg_default;

create index if not exists idx_asset_tags_entity on public.asset_tags using btree (entity_type, entity_id) tablespace pg_default;
```

### attachments

```
create table

public.attachments (

id uuid not null default extensions.uuid_generate_v4 (),

file_name text not null,

file_type text null,

file_size integer null,

storage_path text not null,

related_entity_type text null,

related_entity_id uuid null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

bucket_name text not null default 'attachments'::text,

uploaded_by uuid null,

content_type text null,

constraint attachments_pkey primary key (id),

constraint attachments_uploaded_by_fkey foreign key (uploaded_by) references auth.users (id),

constraint attachments_related_entity_type_check check (

(

related_entity_type = any (

array[

'Control'::text,

'Risk'::text,

'Audit'::text,

'SecureByDesign'::text,

'Policy'::text,

'Testing'::text

]

)

)

)

) tablespace pg_default;

  

create index if not exists idx_attachments_related_entity on public.attachments using btree (related_entity_type, related_entity_id) tablespace pg_default;

  

create index if not exists idx_attachments_uploaded_by on public.attachments using btree (uploaded_by) tablespace pg_default;
```

### company information

```
create table

public.company_info (

id uuid not null default extensions.uuid_generate_v4 (),

entity text not null,

business_unit text null,

sub_business_unit text null,

support_function text null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

constraint company_info_pkey primary key (id)

) tablespace pg_default;
```

### user information

```
create table

public.users (

id uuid not null default auth.uid (),

email text not null,

first_name text null,

last_name text null,

full_name text generated always as (((first_name || ' '::text) || last_name)) stored null,

job_title text null,

department text null,

team text null,

manager_id uuid null,

is_active boolean null default true,

last_login timestamp with time zone null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

constraint users_pkey primary key (id),

constraint users_email_key unique (email),

constraint users_manager_id_fkey foreign key (manager_id) references users (id)

) tablespace pg_default;
```

### tasks

```
create table

public.tasks (

id uuid not null default extensions.uuid_generate_v4 (),

title text not null,

description text null,

assignee_id uuid null,

due_date date null,

status text null,

task_type text null,

related_entity_id uuid null,

created_at timestamp with time zone null default current_timestamp,

updated_at timestamp with time zone null default current_timestamp,

entity_type character varying(50) null,

created_by_id uuid null,

constraint tasks_pkey primary key (id),

constraint fk_tasks_assignee foreign key (assignee_id) references users (id),

constraint fk_tasks_created_by foreign key (created_by_id) references users (id),

constraint check_entity_consistency check (

(

(related_entity_id is null) = (entity_type is null)

)

),

constraint check_entity_type check (

(

(entity_type)::text = any (

array[

('risks'::character varying)::text,

('secure_by_design'::character varying)::text,

('policies'::character varying)::text,

('authority_documents'::character varying)::text,

('citations'::character varying)::text,

('controls'::character varying)::text,

('audits'::character varying)::text,

('testing'::character varying)::text

]

)

)

),

constraint tasks_status_check check (

(

status = any (

array[

'Not Started'::text,

'In Progress'::text,

'Completed'::text,

'Overdue'::text

]

)

)

),

constraint tasks_task_type_check check (

(

task_type = any (

array[

'Audit'::text,

'Control'::text,

'Risk'::text,

'SecureByDesign'::text,

'Evidence'::text,

'Testing'::text,

'Policy'::text

]

)

)

)

) tablespace pg_default;

  

create index if not exists idx_tasks_entity on public.tasks using btree (entity_type, related_entity_id) tablespace pg_default;

  

create index if not exists idx_tasks_assignee on public.tasks using btree (assignee_id) tablespace pg_default;

  

create index if not exists idx_tasks_created_by on public.tasks using btree (created_by_id) tablespace pg_default;
```
