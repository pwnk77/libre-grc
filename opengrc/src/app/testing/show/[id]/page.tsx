"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useOne, useNavigation } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Card, Row, Col, Tag, Divider, Tabs } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { TasksTab } from "../../tasks";

const { Title, Text } = Typography;

export default function TestingShow() {
  const params = useParams();
  const { queryResult } = useShow({
    resource: "testing",
    id: params.id as string,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { show } = useNavigation();

  const { data: controlData, isLoading: controlLoading } = useOne({
    resource: "controls",
    id: record?.control_id || "",
    queryOptions: {
      enabled: !!record?.control_id,
    },
  });

  const { data: companyInfoData, isLoading: companyInfoLoading } = useOne({
    resource: "company_info",
    id: record?.company_info_id || "",
    queryOptions: {
      enabled: !!record?.company_info_id,
    },
  });

  const { data: evidenceProviderData, isLoading: evidenceProviderLoading } = useOne({
    resource: "users",
    id: record?.evidence_provider_id || "",
    queryOptions: {
      enabled: !!record?.evidence_provider_id,
    },
  });

  const { data: complianceManagerData, isLoading: complianceManagerLoading } = useOne({
    resource: "users",
    id: record?.compliance_manager_id || "",
    queryOptions: {
      enabled: !!record?.compliance_manager_id,
    },
  });

  const renderContent = () => (
    <Card>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Title level={4}>Related Control</Title>
          <a onClick={() => show("controls", record?.control_id)}>
            {controlData?.data?.control_id || "N/A"}
          </a>
        </Col>
        <Col span={24}>
          <Title level={4}>Evidence Request</Title>
          <MarkdownField value={record?.evidence_request} />
        </Col>
        <Col span={24}>
          <Title level={4}>Audit Strategy</Title>
          <Tag color={getAuditStrategyColor(record?.audit_strategy)}>
            {record?.audit_strategy}
          </Tag>
        </Col>
        <Col span={24}>
          <Title level={4}>Test of Design</Title>
          <MarkdownField value={record?.test_of_design} />
        </Col>
        <Col span={24}>
          <Title level={4}>Test of Effectiveness</Title>
          <MarkdownField value={record?.test_of_effectiveness} />
        </Col>
        <Col span={24}>
          <Title level={4}>Test Results</Title>
          <MarkdownField value={record?.test_results} />
        </Col>
        <Col span={24}>
          <Title level={4}>Notes</Title>
          <MarkdownField value={record?.notes} />
        </Col>
      </Row>
    </Card>
  );

  const tabItems = [
    {
      key: "1",
      label: "Overview",
      children: renderContent(),
    },
    {
      key: "2",
      label: "Tasks",
      children: <TasksTab testingId={params.id as string} />,
    },
  ];

  return (
    <Show isLoading={isLoading} title="Testing Details">
      <Row gutter={24}>
        <Col span={18}>
          <Tabs defaultActiveKey="1" items={tabItems} />
          <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
            {renderAttachments()}
          </Card>
          <Activity parentId={params.id as string} />
        </Col>
        <Col span={6}>
          <Card title="Contextual Information">
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Title level={5}>Company Info</Title>
                <Text>{companyInfoData?.data?.entity || "N/A"}</Text>
              </Col>
              <Col span={24}>
                <Title level={5}>Evidence Provider</Title>
                <Text>{evidenceProviderData?.data?.full_name || "N/A"}</Text>
              </Col>
              <Col span={24}>
                <Title level={5}>Compliance Manager</Title>
                <Text>{complianceManagerData?.data?.full_name || "N/A"}</Text>
              </Col>
              <Col span={24}>
                <Title level={5}>Compliance Status</Title>
                <Tag color={getComplianceStatusColor(record?.compliance_status)}>
                  {record?.compliance_status}
                </Tag>
              </Col>
              <Col span={24}>
                <Title level={5}>Workflow Status</Title>
                <Tag color={getWorkflowStatusColor(record?.workflow_status)}>
                  {record?.workflow_status}
                </Tag>
              </Col>
              <Col span={24}>
                <Title level={5}>Tester</Title>
                <Text>{record?.tester}</Text>
              </Col>
              <Col span={24}>
                <Title level={5}>Test Date</Title>
                <DateField value={record?.test_date} />
              </Col>
              <Col span={24}>
                <Title level={5}>Created At</Title>
                <DateField value={record?.created_at} />
              </Col>
              <Col span={24}>
                <Title level={5}>Updated At</Title>
                <DateField value={record?.updated_at} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Show>
  );
}

function getComplianceStatusColor(status: string | undefined) {
  switch (status) {
    case 'Not Tested':
      return 'blue';
    case 'Failed':
      return 'red';
    case 'Passed with Exceptions':
      return 'orange';
    case 'Passed':
      return 'green';
    default:
      return 'default';
  }
}

function getWorkflowStatusColor(status: string | undefined) {
  switch (status) {
    case 'Planned':
      return 'blue';
    case 'In Progress':
      return 'orange';
    case 'Completed':
      return 'green';
    case 'Reviewed':
      return 'purple';
    default:
      return 'default';
  }
}

function getAuditStrategyColor(strategy: string | undefined) {
  switch (strategy) {
    case 'Substantive':
      return 'magenta';
    case 'Control-based':
      return 'cyan';
    case 'Combined':
      return 'geekblue';
    case 'Risk-based':
      return 'volcano';
    case 'Compliance-based':
      return 'gold';
    default:
      return 'default';
  }
}
