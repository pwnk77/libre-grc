"use client";

import { Show, MarkdownField, DateField } from "@refinedev/antd";
import { useShow, useList, useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Typography, Card, Row, Col, Descriptions, Space } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { Select } from 'antd';
import { useRouter } from 'next/navigation';

const { Text, Title } = Typography;

interface Citation {
  id: string;
  citation_text: string;
}

export default function CitationShow() {
  const router = useRouter();
  const params = useParams();

  const { queryResult } = useShow({
    resource: "citations",
    id: params.id as string,
  });

  const { data: citationOptions, isLoading: isLoadingCitations } = useList<Citation>({
    resource: "citations",
    pagination: { mode: "off" },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: authorityDocumentData, isLoading: isLoadingAuthorityDocument } = useOne({
    resource: "authority_documents",
    id: record?.authority_document_id || "",
    queryOptions: {
      enabled: !!record?.authority_document_id,
    },
  });

  const handleChange = (value: string) => {
    router.push(`/citations/show/${value}`);
  };

  const { renderAttachments } = useAttachments(params.id as string);

  return (
    <Show 
      isLoading={isLoading} 
      title="Citation Details"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Search for a citation"
            optionFilterProp="children"
            onChange={handleChange}
            loading={isLoadingCitations}
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {citationOptions?.data?.map((citation) => (
              <Select.Option key={citation.id} value={citation.id}>
                {citation.citation_text.substring(0, 50)}...
              </Select.Option>
            ))}
          </Select>
        </>
      )}
    >
      <Row gutter={24}>
        <Col span={18}>
          <Card title="Citation Details" style={{ marginBottom: 20, borderRadius: 8 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Citation Text">
                <MarkdownField value={record?.citation_text} />
              </Descriptions.Item>
              <Descriptions.Item label="Reference Identifier">{record?.reference_identifier}</Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Related Authority Document" style={{ marginBottom: 20, borderRadius: 8 }}>
            {isLoadingAuthorityDocument ? (
              <Text>Loading...</Text>
            ) : (
              <Descriptions column={2}>
                <Descriptions.Item label="Title">{authorityDocumentData?.data?.title}</Descriptions.Item>
                <Descriptions.Item label="Type">{authorityDocumentData?.data?.type}</Descriptions.Item>
                <Descriptions.Item label="Identifier">{authorityDocumentData?.data?.identifier}</Descriptions.Item>
                <Descriptions.Item label="Issuing Body">{authorityDocumentData?.data?.issuing_body}</Descriptions.Item>
                <Descriptions.Item label="Version">{authorityDocumentData?.data?.version}</Descriptions.Item>
                <Descriptions.Item label="Publication Date">
                  <DateField value={authorityDocumentData?.data?.publication_date} />
                </Descriptions.Item>
              </Descriptions>
            )}
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
