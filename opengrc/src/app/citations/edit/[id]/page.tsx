"use client";

import { Edit, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, Card, Row, Col, Select, message } from "antd";
import { useParams } from "next/navigation";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { useSelect } from "@refinedev/antd";

const { TextArea } = Input;

interface IError {
  response: {
    data: {
      errors: {
        [key: string]: string[];
      };
    };
  };
}

// Add validation rules (same as create page)
const citationTextRules = [
  { required: true, message: 'Citation text is required' },
  { min: 10, message: 'Citation text must be at least 10 characters' },
  { max: 2000, message: 'Citation text cannot exceed 2000 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
      }
      return Promise.resolve();
    }
  }
];

const referenceIdentifierRules = [
  { max: 100, message: 'Reference identifier cannot exceed 100 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        if (!/^[A-Za-z0-9-_\.]+$/.test(value)) {
          throw new Error('Only letters, numbers, hyphens, underscores and dots allowed');
        }
      }
      return Promise.resolve();
    }
  }
];

export default function CitationEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "citations",
    id: params.id as string,
    meta: {
      onError: (error: IError) => {
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors;
          
          Object.keys(errors).forEach((key) => {
            formProps.form?.setFields([
              {
                name: key,
                errors: Array.isArray(errors[key]) ? errors[key] : [errors[key]],
              },
            ]);
          });
          message.error('Validation failed. Please check the form.');
        }
      },
    },
  });

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { selectProps: authorityDocumentSelectProps } = useSelect({
    resource: "authority_documents",
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form 
        {...formProps} 
        layout="vertical"
        initialValues={record}
      >
        <Row gutter={24}>
          <Col span={18}>
            <Card title="Citation Details">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Citation Text"
                    name="citation_text"
                    rules={citationTextRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <TextArea 
                      rows={4}
                      maxLength={2000}
                      showCount
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Reference Identifier"
                    name="reference_identifier"
                    rules={referenceIdentifierRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Authority Document"
                    name="authority_document_id"
                  >
                    <Select {...authorityDocumentSelectProps} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
              {renderAttachments()}
            </Card>
            <Activity parentId={params.id as string} />
          </Col>
          <Col span={6}>
            <Card title="Metadata">
              <Form.Item label="Created At" name="created_at">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Updated At" name="updated_at">
                <Input disabled />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
