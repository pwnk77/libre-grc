"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useList } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Card, Row, Col, Descriptions } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { Select } from 'antd';
import { useRouter } from 'next/navigation';

const { Text, Title } = Typography;

interface AuthorityDocument {
  id: string;
  title: string;
}

export default function AuthorityDocumentShow() {
  const router = useRouter();
  const params = useParams();

  const { queryResult } = useShow({
    resource: "authority_documents",
    id: params.id as string,
  });

  const { data: authorityDocumentOptions, isLoading: isLoadingAuthorityDocuments } = useList<AuthorityDocument>({
    resource: "authority_documents",
    pagination: { mode: "off" },
  });

  const handleChange = (value: string) => {
    router.push(`/authority_documents/show/${value}`);
  };

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  return (
    <Show 
      isLoading={isLoading} 
      title="Authority Document Details"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Search for an authority document"
            optionFilterProp="children"
            onChange={handleChange}
            loading={isLoadingAuthorityDocuments}
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {authorityDocumentOptions?.data?.map((doc) => (
              <Select.Option key={doc.id} value={doc.id}>
                {doc.title}
              </Select.Option>
            ))}
          </Select>
        </>
      )}
    >
      <Row gutter={24}>
        <Col span={18}>
          <Card title="Authority Document Details" style={{ marginBottom: 20, borderRadius: 8 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="Title">{record?.title}</Descriptions.Item>
              <Descriptions.Item label="Type">{record?.type}</Descriptions.Item>
              <Descriptions.Item label="Identifier">{record?.identifier}</Descriptions.Item>
              <Descriptions.Item label="Issuing Body">{record?.issuing_body}</Descriptions.Item>
              <Descriptions.Item label="Version">{record?.version}</Descriptions.Item>
              <Descriptions.Item label="Publication Date">
                <DateField value={record?.publication_date} />
              </Descriptions.Item>
            </Descriptions>
            <Title level={5} style={{ marginTop: 20 }}>Description</Title>
            <MarkdownField value={record?.description} />
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
