"use client";

import { Show, MarkdownField, DateField, EditButton } from "@refinedev/antd";
import { useShow, useMany, useList } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Tabs, Card, Row, Col, Tag, Divider } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { TasksTab } from "../../tasks";
import { AssetsTab } from "../../assets";

const { Title, Text } = Typography;

export default function ControlShow() {
  const params = useParams();
  const { queryResult } = useShow({
    resource: "controls",
    id: params.id as string,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { data: historyData, isLoading: historyLoading } = useList({
    resource: "change_history",
    filters: [
      { field: "table_name", operator: "eq", value: "controls" },
      { field: "record_id", operator: "eq", value: params.id },
    ],
    sorters: [{ field: "created_at", order: "desc" }],
  });

  const userIds = [
    ...(historyData?.data?.map((history) => history.changed_by) || []),
    record?.control_owner,
    record?.process_owner,
    record?.compliance_spoc,
  ].filter(Boolean);

  const { data: userData, isLoading: userLoading } = useMany({
    resource: "users",
    ids: userIds,
    queryOptions: {
      enabled: userIds.length > 0,
    },
  });

  const renderRightSideBox = () => (
    <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Title level={4}>Ownership</Title>
        </Col>
        <Col span={24}>
          <Title level={5}>Control Owner</Title>
          <Text>{userData?.data?.find(u => u.id === record?.control_owner)?.full_name || "Not assigned"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Process Owner</Title>
          <Text>{userData?.data?.find(u => u.id === record?.process_owner)?.full_name || "Not assigned"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Compliance SPOC</Title>
          <Text>{userData?.data?.find(u => u.id === record?.compliance_spoc)?.full_name || "Not assigned"}</Text>
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
        <Divider />
        <Col span={24}>
          <Title level={4}>Status</Title>
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
            <Title level={4}>Control ID</Title>
            <Text>{record?.control_id}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Domain</Title>
            <Text>{record?.domain}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Control Requirements</Title>
            <MarkdownField value={record?.control_requirements} />
          </Col>
          <Col span={24}>
            <Title level={4}>Risk Statement</Title>
            <MarkdownField value={record?.risk_statement} />
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Implementation",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Title level={4}>Current Implementation</Title>
            <MarkdownField value={record?.current_implementation} />
          </Col>
          <Col span={24}>
            <Title level={4}>Enhancements</Title>
            <MarkdownField value={record?.enhancements} />
          </Col>
          <Col span={24}>
            <Title level={4}>Implementation Guidance</Title>
            <MarkdownField value={record?.implementation_guidance} />
          </Col>
        </Row>
      ),
    },
    {
      key: "3",
      label: "Details",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Title level={4}>Control Type</Title>
            <Text>{record?.control_type}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Control Frequency</Title>
            <Text>{record?.control_frequency}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Control Design</Title>
            <Text>{record?.control_design}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Technological Enabler</Title>
            <Text>{record?.technological_enabler}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Management Level</Title>
            <Text>{record?.management_level}</Text>
          </Col>
        </Row>
      ),
    },
    {
      key: "4",
      label: "Framework",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Title level={4}>Framework Name</Title>
            <Text>{record?.framework_name}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Framework Version</Title>
            <Text>{record?.framework_version}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Framework Description</Title>
            <MarkdownField value={record?.framework_description} />
          </Col>
        </Row>
      ),
    },
    {
      key: "5",
      label: "Tasks",
      children: <TasksTab controlId={params.id as string} />,
    },
    {
      key: "6",
      label: "Assets",
      children: <AssetsTab controlId={params.id as string} />,
    },
  ];

  return (
    <Show 
      isLoading={isLoading} 
      title="Control Details"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
        </>
      )}
    >
      <Row gutter={24}>
        <Col span={18}>
          <Tabs defaultActiveKey="1" items={tabItems} />
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

function getComplianceStatusColor(status: string | undefined) {
  switch (status) {
    case 'Not Implemented':
      return 'red';
    case 'Partially Implemented':
      return 'orange';
    case 'Implemented':
      return 'green';
    case 'Not Applicable':
      return 'gray';
    default:
      return 'blue';
  }
}

function getWorkflowStatusColor(status: string | undefined) {
  switch (status) {
    case 'Draft':
      return 'blue';
    case 'In Review':
      return 'orange';
    case 'Approved':
      return 'green';
    case 'Retired':
      return 'gray';
    default:
      return 'blue';
  }
}
