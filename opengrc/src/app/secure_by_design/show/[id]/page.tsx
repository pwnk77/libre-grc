"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useMany, useList } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Card, Row, Col, Tag, Divider } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { Select } from 'antd';
import { useRouter } from 'next/navigation';

const { Text, Title } = Typography;

interface SecureByDesign {
  id: string;
  product_name: string;
}

export default function SecureByDesignShow() {
  const router = useRouter();
  const params = useParams();

  const { queryResult } = useShow({
    resource: "secure_by_design",
    id: params.id as string,
  });

  const { data: secureByDesignOptions, isLoading: isLoadingSecureByDesign } = useList<SecureByDesign>({
    resource: "secure_by_design",
    pagination: { mode: "off" },
  });

  const handleChange = (value: string) => {
    router.push(`/secure_by_design/show/${value}`);
  };

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { data: companyData, isLoading: companyLoading } = useMany({
    resource: "company_info",
    ids: record?.entity_id ? [record.entity_id] : [],
    queryOptions: {
      enabled: !!record?.entity_id,
    },
  });

  return (
    <Show 
      isLoading={isLoading} 
      title="Secure by Design Details"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Search for a product"
            optionFilterProp="children"
            onChange={handleChange}
            loading={isLoadingSecureByDesign}
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {secureByDesignOptions?.data?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.product_name}
              </Select.Option>
            ))}
          </Select>
        </>
      )}
    >
      <Card title="Secure by Design Information" style={{ marginBottom: 20, borderRadius: 8 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Product Name</Title>
            <Text>{record?.product_name}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Product Type</Title>
            <Text>{record?.product_type}</Text>
          </Col>
          <Col span={24}>
            <Title level={5}>Description</Title>
            <MarkdownField value={record?.description} />
          </Col>
          <Col span={12}>
            <Title level={5}>Line of Business</Title>
            <Text>{record?.line_of_business}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Expected Go Live Date</Title>
            <DateField value={record?.expected_go_live_date} />
          </Col>
          <Col span={12}>
            <Title level={5}>Entity</Title>
            <Text>{companyData?.data?.[0]?.name || 'N/A'}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Infrastructure Details</Title>
            <Text>{record?.infrastructure_details}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>External Party Involvement</Title>
            <Text>{record?.external_party_involvement ? 'Yes' : 'No'}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Applicable Compliances</Title>
            <Text>{record?.applicable_compliances?.join(', ')}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Advisory Provided</Title>
            <Text>{record?.advisory_provided}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Reviewer</Title>
            <Text>{record?.reviewer}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Workflow Status</Title>
            <Tag color={getWorkflowStatusColor(record?.workflow_status)}>
              {record?.workflow_status}
            </Tag>
          </Col>
          <Col span={12}>
            <Title level={5}>Created At</Title>
            <DateField value={record?.created_at} />
          </Col>
          <Col span={12}>
            <Title level={5}>Updated At</Title>
            <DateField value={record?.updated_at} />
          </Col>
        </Row>
      </Card>
      <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
        {renderAttachments()}
      </Card>
      <Activity parentId={params.id as string} />
    </Show>
  );
}

function getWorkflowStatusColor(status: string | undefined) {
  switch (status) {
    case 'Initiation':
      return 'blue';
    case 'Design Review':
      return 'orange';
    case 'Implementation':
      return 'green';
    case 'Verification':
      return 'purple';
    default:
      return 'default';
  }
}