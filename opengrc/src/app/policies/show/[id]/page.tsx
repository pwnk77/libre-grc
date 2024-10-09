"use client";

import { Show, DateField } from "@refinedev/antd";
import { useShow, useList } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Card, Row, Col, Descriptions } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { Select } from 'antd';
import { useRouter } from 'next/navigation';

const { Text, Title } = Typography;

interface Policy {
  id: string;
  policy_name: string;
}

export default function PolicyShow() {
  const router = useRouter();
  const params = useParams();

  const { queryResult } = useShow({
    resource: "policies",
    id: params.id as string,
  });

  const { data: policyOptions, isLoading: isLoadingPolicies } = useList<Policy>({
    resource: "policies",
    pagination: { mode: "off" },
  });

  const handleChange = (value: string) => {
    router.push(`/policies/show/${value}`);
  };

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  return (
    <Show 
      isLoading={isLoading} 
      title="Policy Details"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Search for a policy"
            optionFilterProp="children"
            onChange={handleChange}
            loading={isLoadingPolicies}
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {policyOptions?.data?.map((policy) => (
              <Select.Option key={policy.id} value={policy.id}>
                {policy.policy_name}
              </Select.Option>
            ))}
          </Select>
        </>
      )}
    >
      <Row gutter={24}>
        <Col span={18}>
          <Card title="Policy Details" style={{ marginBottom: 20, borderRadius: 8 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="Policy Name">{record?.policy_name}</Descriptions.Item>
              <Descriptions.Item label="Purpose">{record?.purpose}</Descriptions.Item>
              <Descriptions.Item label="Prepared By">{record?.prepared_by}</Descriptions.Item>
              <Descriptions.Item label="Reviewed By">{record?.reviewed_by}</Descriptions.Item>
              <Descriptions.Item label="Prepared Date">
                <DateField value={record?.prepared_date} />
              </Descriptions.Item>
              <Descriptions.Item label="Review Date">
                <DateField value={record?.review_date} />
              </Descriptions.Item>
              <Descriptions.Item label="Next Revision Due Date">
                <DateField value={record?.next_revision_due_date} />
              </Descriptions.Item>
              <Descriptions.Item label="Policy Link">
                {record?.policy_link ? (
                  <a href={record.policy_link} target="_blank" rel="noopener noreferrer">View Policy</a>
                ) : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Workflow Status">{record?.workflow_status}</Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
            {renderAttachments()}
          </Card>
          <Activity parentId={params.id as string} />
        </Col>
        <Col span={6}>
          <Card title="Metadata" style={{ marginBottom: 20, borderRadius: 8 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Created At">
                <DateField value={record?.created_at} />
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                <DateField value={record?.updated_at} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Show>
  );
}