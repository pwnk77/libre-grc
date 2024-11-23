"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useMany } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Tabs, Card, Row, Col, Tag, Divider } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { TasksTab } from "../../tasks";
import { AssetsTab } from "../../assets";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function RiskShow() {
  const params = useParams();
  const { queryResult } = useShow({
    resource: "risks",
    id: params.id as string,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { data: entityData } = useMany({
    resource: "company_info",
    ids: record?.entity_id ? [record.entity_id] : [],
  });

  const { data: riskOwnerData } = useMany({
    resource: "users",
    ids: record?.risk_owner_id ? [record.risk_owner_id] : [],
  });

  const { data: riskReporterData } = useMany({
    resource: "users",
    ids: record?.risk_reporter_id ? [record.risk_reporter_id] : [],
  });

  const { data: riskManagerData } = useMany({
    resource: "users",
    ids: record?.risk_manager_id ? [record.risk_manager_id] : [],
  });

  const { data: companyInfoData } = useMany({
    resource: "company_info",
    ids: record?.company_info_id ? [record.company_info_id] : [],
  });

  const renderRightSideBox = () => (
    <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Title level={4}>Ownership</Title>
        </Col>
        <Col span={24}>
          <Title level={5}>Risk Owner</Title>
          <Text>{riskOwnerData?.data?.[0]?.full_name || "Not assigned"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Risk Reporter</Title>
          <Text>{riskReporterData?.data?.[0]?.full_name || "Not assigned"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Risk Manager</Title>
          <Text>{riskManagerData?.data?.[0]?.full_name || "Not assigned"}</Text>
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={4}>Company Information</Title>
        </Col>
        <Col span={24}>
          <Title level={5}>Entity</Title>
          <Text>{companyInfoData?.data?.[0]?.entity || "N/A"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Business Unit</Title>
          <Text>{companyInfoData?.data?.[0]?.business_unit || "N/A"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Sub Business Unit</Title>
          <Text>{companyInfoData?.data?.[0]?.sub_business_unit || "N/A"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Support Function</Title>
          <Text>{companyInfoData?.data?.[0]?.support_function || "N/A"}</Text>
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={4}>Dates</Title>
        </Col>
        <Col span={12}>
          <Title level={5}>Created At</Title>
          <DateField value={record?.created_at} />
        </Col>
        <Col span={12}>
          <Title level={5}>Updated At</Title>
          <DateField value={record?.updated_at} />
        </Col>
        <Col span={24}>
          <Title level={5}>Risk Due Date</Title>
          <DateField value={record?.risk_due_date} />
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={4}>Status</Title>
        </Col>
        <Col span={24}>
          <Title level={5}>Workflow Status</Title>
          <Tag color={getWorkflowStatusColor(record?.workflow_status)}>
            {record?.workflow_status}
          </Tag>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Show isLoading={isLoading} title="Risk Details">
      <Row gutter={24}>
        <Col span={18}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Overview" key="1">
              <Row gutter={[0, 24]}>
                <Col span={24}>
                  <Title level={4}>Risk ID</Title>
                  <Text>{record?.risk_id}</Text>
                </Col>
                <Col span={24}>
                  <Title level={4}>Risk Summary</Title>
                  <Text>{record?.risk_summary}</Text>
                </Col>
                <Col span={24}>
                  <Title level={4}>Description</Title>
                  <MarkdownField value={record?.description} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Risk Assessment" key="2">
              <Row gutter={[0, 24]}>
                <Col span={24}>
                  <Title level={4}>Impact Type</Title>
                  <Text>{record?.impact_type}</Text>
                </Col>
                <Col span={24}>
                  <Title level={4}>Impact</Title>
                  <Tag color={getImpactColor(record?.impact)}>{record?.impact}</Tag>
                </Col>
                <Col span={24}>
                  <Title level={4}>Likelihood</Title>
                  <Tag color={getLikelihoodColor(record?.likelihood)}>{record?.likelihood}</Tag>
                </Col>
                <Col span={24}>
                  <Title level={4}>Inherent Risk Level</Title>
                  <Tag color={getRiskLevelColor(record?.inherent_risk_level)}>{record?.inherent_risk_level}</Tag>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Risk Treatment" key="3">
              <Row gutter={[0, 24]}>
                <Col span={24}>
                  <Title level={4}>Risk Response</Title>
                  <Tag color={getRiskResponseColor(record?.risk_response)}>{record?.risk_response}</Tag>
                </Col>
                <Col span={24}>
                  <Title level={4}>Residual Risk Level</Title>
                  <Tag color={getRiskLevelColor(record?.residual_risk_level)}>{record?.residual_risk_level}</Tag>
                </Col>
                <Col span={24}>
                  <Title level={4}>Compensating Controls</Title>
                  <MarkdownField value={record?.compensating_controls} />
                </Col>
                <Col span={24}>
                  <Title level={4}>Mitigating Controls</Title>
                  <MarkdownField value={record?.mitigating_controls} />
                </Col>
                <Col span={24}>
                  <Title level={4}>Risk Acceptance Justifications</Title>
                  <MarkdownField value={record?.risk_acceptance_justifications} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Tasks" key="4">
              <TasksTab riskId={params.id as string} />
            </TabPane>
            <TabPane tab="Assets" key="5">
              <AssetsTab riskId={params.id as string} />
            </TabPane>
          </Tabs>
          <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
            {renderAttachments()}
          </Card>
          <Activity parentId={params.id as string} />
        </Col>
        <Col span={6}>
          {renderRightSideBox()}
        </Col>
      </Row>
    </Show>
  );
}

function getWorkflowStatusColor(status: string | undefined) {
  switch (status) {
    case 'Identified':
      return 'blue';
    case 'Assessed':
      return 'orange';
    case 'Treated':
      return 'green';
    case 'Monitored':
      return 'purple';
    default:
      return 'default';
  }
}

function getImpactColor(impact: string | undefined) {
  switch (impact) {
    case 'Critical':
      return 'red';
    case 'High':
      return 'orange';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'green';
    default:
      return 'default';
  }
}

function getLikelihoodColor(likelihood: string | undefined) {
  switch (likelihood) {
    case 'Almost Certain':
      return 'red';
    case 'Likely':
      return 'orange';
    case 'Slightly Likely':
      return 'yellow';
    case 'Rare':
      return 'green';
    default:
      return 'default';
  }
}

function getRiskLevelColor(level: string | undefined) {
  switch (level) {
    case 'Critical':
      return 'red';
    case 'High':
      return 'orange';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'green';
    default:
      return 'default';
  }
}

function getRiskResponseColor(response: string | undefined) {
  switch (response) {
    case 'Treat':
      return 'blue';
    case 'Transfer':
      return 'purple';
    case 'Terminate':
      return 'red';
    case 'Accept':
      return 'green';
    default:
      return 'default';
  }
}
