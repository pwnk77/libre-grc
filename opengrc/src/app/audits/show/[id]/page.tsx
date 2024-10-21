"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useMany, useList, useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Tabs, Card, Row, Col, Tag, Divider } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import { TasksTab } from "../../tasks";

const { Text, Title } = Typography;

interface Audit {
  id: string;
  audit_name: string;
}

export default function AuditShow() {
  const router = useRouter();
  const params = useParams();

  const { queryResult } = useShow({
    resource: "audits",
    id: params.id as string,
  });

  const { data: auditOptions, isLoading: isLoadingAudits } = useList<Audit>({
    resource: "audits",
    pagination: { mode: "off" },
  });

  const handleChange = (value: string) => {
    router.push(`/audits/show/${value}`);
  };

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const userIds = [
    record?.auditor_id,
    record?.auditee_id,
  ].filter(Boolean);

  const { data: userData, isLoading: userLoading } = useMany({
    resource: "users",
    ids: userIds,
    queryOptions: {
      enabled: userIds.length > 0,
    },
  });

  const { data: companyData, isLoading: companyLoading } = useOne({
    resource: "company_info",
    id: record?.company_info_id || "",
    queryOptions: {
      enabled: !!record?.company_info_id,
    },
  });

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'blue';
      case 'In Progress':
        return 'orange';
      case 'Reporting':
        return 'purple';
      case 'Closed':
        return 'green';
      default:
        return 'default';
    }
  };

  const renderRightSideBox = () => (
    <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Title level={5}>Company Info</Title>
          <Text>{companyData?.data?.entity || "Not assigned"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Audit Partner</Title>
          <Text>{userData?.data?.find(user => user.id === record?.auditor_id)?.full_name || "Not assigned"}</Text>
        </Col>
        <Col span={24}>
          <Title level={5}>Engagement Lead</Title>
          <Text>{userData?.data?.find(user => user.id === record?.auditee_id)?.full_name || "Not assigned"}</Text>
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={5}>Dates</Title>
        </Col>
        <Col span={12}>
          <Text>Planned Start:</Text>
          <DateField value={record?.planned_start_date} />
        </Col>
        <Col span={12}>
          <Text>Planned End:</Text>
          <DateField value={record?.planned_end_date} />
        </Col>
        <Col span={12}>
          <Text>Actual Start:</Text>
          <DateField value={record?.actual_start_date} />
        </Col>
        <Col span={12}>
          <Text>Actual End:</Text>
          <DateField value={record?.actual_end_date} />
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={5}>Status</Title>
          <Tag color={getWorkflowStatusColor(record?.workflow_status)}>
            {record?.workflow_status}
          </Tag>
        </Col>
        <Col span={12}>
          <Text>Created At:</Text>
          <DateField value={record?.created_at} />
        </Col>
        <Col span={12}>
          <Text>Updated At:</Text>
          <DateField value={record?.updated_at} />
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
            <Title level={4}>Audit Name</Title>
            <Text>{record?.audit_name}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Scope</Title>
            <MarkdownField value={record?.scope} />
          </Col>
          <Col span={24}>
            <Title level={4}>Description</Title>
            <MarkdownField value={record?.description} />
          </Col>
          <Col span={24}>
            <Title level={4}>Related Circulars</Title>
            <Text>{record?.related_circulars?.join(", ")}</Text>
          </Col>
          <Col span={24}>
            <Title level={4}>Key Stakeholders</Title>
            <Text>{record?.key_stakeholders?.join(", ")}</Text>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Tasks",
      children: <TasksTab auditId={params.id as string} />,
    },
  ];

  return (
    <Show 
      isLoading={isLoading} 
      title="Audit Details"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Search for an audit"
            optionFilterProp="children"
            onChange={handleChange}
            loading={isLoadingAudits}
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {auditOptions?.data?.map((audit) => (
              <Select.Option key={audit.id} value={audit.id}>
                {audit.audit_name}
              </Select.Option>
            ))}
          </Select>
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
