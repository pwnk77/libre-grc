import { useState } from 'react';
import { useCreate, useList, useGetIdentity } from "@refinedev/core";
import { Upload, message, Button, List, Typography } from 'antd';
import { FileOutlined, PictureOutlined, FilePdfOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { supabaseBrowserClient as supabaseClient } from "@/utils/supabase/client";

const { Text } = Typography;

export function useAttachments(parentId: string) {
  const [fileList, setFileList] = useState([]);

  const { mutate: createAttachment } = useCreate();
  const { data: attachmentsData, isLoading } = useList({
    resource: "attachments",
    filters: [
      { field: "related_entity_type", operator: "eq", value: "SecureByDesign" },
      { field: "related_entity_id", operator: "eq", value: parentId },
    ],
  });

  const { data: identity } = useGetIdentity<{ id: string }>();

  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;

    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error('File must be smaller than 10MB');
      onError(new Error('File too large'));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      message.error('File type not supported');
      onError(new Error('Invalid file type'));
      return;
    }

    // Validate file name
    const validFileName = /^[a-zA-Z0-9-_. ]+$/;
    if (!validFileName.test(file.name)) {
      message.error('File name contains invalid characters');
      onError(new Error('Invalid file name'));
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabaseClient.storage
        .from('attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      const { data: publicURLData } = supabaseClient.storage
        .from('attachments')
        .getPublicUrl(filePath);

      const attachmentData = {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: publicURLData.publicUrl,
        related_entity_type: "SecureByDesign",
        related_entity_id: parentId,
        bucket_name: 'attachments',
        uploaded_by: identity?.id,
        content_type: file.type,
      };

      await createAttachment({
        resource: "attachments",
        values: attachmentData,
      });

      onSuccess(attachmentData, file);
      message.success(`${file.name} file uploaded successfully.`);
    } catch (err) {
      onError({ err });
      message.error(`${file.name} file upload failed.`);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image')) return <PictureOutlined />;
    if (fileType === 'application/pdf') return <FilePdfOutlined />;
    if (fileType?.includes('sheet') || fileType?.includes('excel')) return <FileExcelOutlined />;
    return <FileOutlined />;
  };

  const renderAttachments = () => (
    <>
      <Upload
        customRequest={handleUpload}
        accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.pdf,.xls,.xlsx"
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList as any)}
        listType="picture"
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <List
        loading={isLoading}
        itemLayout="horizontal"
        dataSource={attachmentsData?.data || []}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={getFileIcon(item.content_type)}
              title={<a href={item.storage_path} target="_blank" rel="noopener noreferrer">{item.file_name}</a>}
              description={
                <Text type="secondary">
                  {item.content_type} - {(item.file_size / 1024 / 1024).toFixed(2)} MB
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </>
  );

  return { renderAttachments };
}