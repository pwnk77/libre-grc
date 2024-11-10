"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useMany } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Tabs, Card, Row, Col, Tag, Divider } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { TasksTab } from "../../tasks";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function IncidentShow() {
  const params = useParams();
  const { queryResult } = useShow({
    resource: "incident_management",
    id: params.id as string,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { data: entityData } = useMany({
    resource: "company_info",
    ids: record?.entity_id ? [record.entity_id] : [],
  });

  const { data: incidentOwnerData } = useMany({
    resource: "users",
    ids: record?.incident_owner ? [record.incident_owner] : [],
  });

  const renderRightSideBox = () => (
    <Card title="Assignment Details" style={{ marginBottom: 20, borderRadius: 8 }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Title level={4}>Ownership</Title>
        </Col>
        <Col span={24}>
          <Title level={5}>Incident Owner</Title>
          <Text>{incidentOwnerData?.data?.[0]?.full_name || "Not assigned"}</Text>
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={4}>Company Information</Title>
        </Col>
        <Col span={24}>
          <Title level={5}>Entity</Title>
          <Text>{entityData?.data?.[0]?.entity || "N/A"}</Text>
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
          <Title level={5}>Target Resolution Date</Title>
          <DateField value={record?.target_resolution_date} />
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

  const tabItems = [
    {
      key: "1",
      label: "Overview",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Title level={4}>Incident ID</Title>
            <Text>{record?.incident_id}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Incident Summary</Title>
            <Text>{record?.incident_summary}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Description</Title>
            <MarkdownField value={record?.description} />
          </Col>
          <Col span={24}>
            <Title level={4}>Severity</Title>
            <Tag color={getSeverityColor(record?.severity)}>{record?.severity}</Tag>
          </Col>
          <Col span={24}>
            <Title level={4}>Impact Type</Title>
            <Tag>{record?.impact_type}</Tag>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Response Details",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Title level={4}>Detection Method</Title>
            <Text>{record?.detection_method}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Initial Response Time</Title>
            <DateField value={record?.response_time} format="YYYY-MM-DD HH:mm:ss" />
          </Col>
          <Col span={24}>
            <Title level={4}>Containment Measures</Title>
            <MarkdownField value={record?.containment_measures} />
          </Col>
          <Col span={24}>
            <Title level={4}>Resolution Steps</Title>
            <MarkdownField value={record?.resolution_steps} />
          </Col>
        </Row>
      ),
    },
    {
      key: "3",
      label: "Tasks",
      children: <TasksTab incidentId={params.id as string} />,
    },
  ];

  return (
    <Show isLoading={isLoading} title="Incident Details">
      <Row gutter={24}>
        <Col span={18}>
          <Tabs defaultActiveKey="1" items={tabItems} />
          <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
            {renderAttachments()}
          </Card>
          <Card title="Activity" style={{ marginTop: 20, borderRadius: 8 }}>
            <Activity parentId={params.id as string} />
          </Card>
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
    case 'Reported':
      return 'blue';
    case 'Under Investigation':
      return 'orange';
    case 'Remediation':
      return 'purple';
    case 'Resolved':
      return 'green';
    case 'Closed':
      return 'gray';
    default:
      return 'default';
  }
}

function getSeverityColor(severity: string | undefined) {
  switch (severity) {
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