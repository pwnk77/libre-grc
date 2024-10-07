"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { Typography } from "antd";
import { useOne, useShow } from "@refinedev/core";
import { useParams } from "next/navigation";

const { Title, Text } = Typography;

export default function ControlShow() {
  const params = useParams();
  const { queryResult } = useShow({
    resource: "controls",
    id: params.id as string,
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Control ID</Title>
      <Text>{record?.control_id}</Text>
      
      <Title level={5}>Domain</Title>
      <Text>{record?.domain}</Text>
      
      <Title level={5}>Control Requirements</Title>
      <MarkdownField value={record?.control_requirements} />
      
      <Title level={5}>Risk Statement</Title>
      <MarkdownField value={record?.risk_statement} />
      
      <Title level={5}>Compliance Level</Title>
      <Text>{record?.compliance_level}</Text>
      
      <Title level={5}>Created At</Title>
      <DateField value={record?.created_at} />
      
      <Title level={5}>Updated At</Title>
      <DateField value={record?.updated_at} />
      
      {/* Add other fields here */}
    </Show>
  );
}