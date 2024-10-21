"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useMany, useList } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Card, Row, Col, Tag, Divider, Tabs } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import { TasksTab } from "../../components/TasksTab";

const { Text, Title } = Typography;
const { TabPane } = Tabs;

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
    ids: record?.company_info_id ? [record.company_info_id] : [],
    queryOptions: {
      enabled: !!record?.company_info_id,
    },
  });

  const { data: productOwnerData, isLoading: productOwnerLoading } = useMany({
    resource: "users",
    ids: record?.product_owner_id ? [record.product_owner_id] : [],
    queryOptions: {
      enabled: !!record?.product_owner_id,
    },
  });

  const { data: sbdReviewerData, isLoading: sbdReviewerLoading } = useMany({
    resource: "users",
    ids: record?.sbd_reviewer_id ? [record.sbd_reviewer_id] : [],
    queryOptions: {
      enabled: !!record?.sbd_reviewer_id,
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
      <Row gutter={24}>
        <Col span={18}>
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
                <Title level={5}>Expected Go Live Date</Title>
                <DateField value={record?.expected_go_live_date} />
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
                <Title level={5}>Company</Title>
                <Text>{companyData?.data?.[0]?.entity || 'N/A'}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Business Unit</Title>
                <Text>{companyData?.data?.[0]?.business_unit || 'N/A'}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Sub Business Unit</Title>
                <Text>{companyData?.data?.[0]?.sub_business_unit || 'N/A'}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Support Function</Title>
                <Text>{companyData?.data?.[0]?.support_function || 'N/A'}</Text>
              </Col>
            </Row>
          </Card>
          <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
            <TabPane tab="Attachments" key="1">
              {renderAttachments()}
            </TabPane>
            <TabPane tab="Activity" key="2">
              <Activity parentId={params.id as string} />
            </TabPane>
            <TabPane tab="Tasks" key="3">
              <TasksTab secureByDesignId={params.id as string} />
            </TabPane>
          </Tabs>
        </Col>
        <Col span={6}>
          <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
            <Title level={5}>Product Owner</Title>
            <Text>{productOwnerData?.data?.[0]?.full_name || 'N/A'}</Text>
            <Divider />
            <Title level={5}>SBD Reviewer</Title>
            <Text>{sbdReviewerData?.data?.[0]?.full_name || 'N/A'}</Text>
            <Divider />
            <Title level={5}>Workflow Status</Title>
            <Tag color={getWorkflowStatusColor(record?.workflow_status)}>
              {record?.workflow_status}
            </Tag>
            <Divider />
            <Title level={5}>Created At</Title>
            <DateField value={record?.created_at} />
            <Divider />
            <Title level={5}>Updated At</Title>
            <DateField value={record?.updated_at} />
          </Card>
        </Col>
      </Row>
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
