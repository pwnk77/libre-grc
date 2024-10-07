"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function ControlShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />
      <Title level={5}>Control ID</Title>
      <TextField value={record?.control_id} />
      <Title level={5}>Domain</Title>
      <TextField value={record?.domain} />
      <Title level={5}>Control Requirements</Title>
      <TextField value={record?.control_requirements} />
      <Title level={5}>Risk Statement</Title>
      <TextField value={record?.risk_statement} />
      <Title level={5}>Compliance Level</Title>
      <TextField value={record?.compliance_level} />
      <Title level={5}>Control Type</Title>
      <TextField value={record?.control_type} />
      <Title level={5}>Control Frequency</Title>
      <TextField value={record?.control_frequency} />
      <Title level={5}>Compliance Status</Title>
      <TextField value={record?.compliance_status} />
      <Title level={5}>Workflow Status</Title>
      <TextField value={record?.workflow_status} />
      <Title level={5}>Created At</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>Updated At</Title>
      <DateField value={record?.updated_at} />
    </Show>
  );
}