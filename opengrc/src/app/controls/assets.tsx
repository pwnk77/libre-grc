import React from "react";
import { useSelect, useList, useCreate, useDelete, useMany } from "@refinedev/core";
import { Select, Table, Tag, Button, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const AssetsTab: React.FC<{ controlId: string }> = ({ controlId }) => {
  const { options: assetOptions } = useSelect({
    resource: "assets",
    optionLabel: "name",
    optionValue: "id",
  });

  const { data: assetTags, isLoading: isAssetTagsLoading, refetch: refetchAssetTags } = useList({
    resource: "asset_tags",
    filters: [
      { field: "entity_id", operator: "eq", value: controlId },
      { field: "entity_type", operator: "eq", value: "controls" },
    ],
    meta: { fields: ["id", "asset_id"] },
  });

  const assetIds = assetTags?.data?.map((tag: any) => tag.asset_id) || [];

  const { data: assets, isLoading: isAssetsLoading, refetch: refetchAssets } = useMany({
    resource: "assets",
    ids: assetIds,
    queryOptions: { enabled: assetIds.length > 0 },
  });

  const { mutate: createAssetTag } = useCreate();
  const { mutate: deleteAssetTag } = useDelete();

  const handleAssetTag = (selectedAssetIds: string[]) => {
    const currentAssetIds = assetTags?.data?.map((tag: any) => tag.asset_id) || [];
    const newAssetIds = selectedAssetIds.filter(id => !currentAssetIds.includes(id));

    newAssetIds.forEach(assetId => {
      createAssetTag({
        resource: "asset_tags",
        values: {
          asset_id: assetId,
          entity_type: "controls",
          entity_id: controlId,
        },
      }, {
        onSuccess: () => {
          refetchAssetTags();
          refetchAssets();
        },
        onError: (error) => {
          console.error("Error creating asset tag:", error);
        },
      });
    });
  };

  const handleAssetUntag = (assetTagId: string) => {
    deleteAssetTag({
      resource: "asset_tags",
      id: assetTagId,
    }, {
      onSuccess: () => {
        refetchAssetTags();
        refetchAssets();
      },
      onError: (error) => {
        console.error("Error deleting asset tag:", error);
      },
    });
  };

  const mergedData = assetTags?.data?.map((tag: any) => {
    const asset = assets?.data?.find((a: any) => a.id === tag.asset_id);
    return { ...tag, asset };
  }) || [];

  return (
    <>
      <Select
        mode="multiple"
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Tag assets"
        onChange={handleAssetTag}
        value={assetTags?.data?.map((tag: any) => tag.asset_id) || []}
        options={assetOptions}
      />

      <Table
        dataSource={mergedData}
        rowKey="id"
        loading={isAssetTagsLoading || isAssetsLoading}
      >
        <Table.Column 
          title="Asset Name" 
          dataIndex={["asset", "name"]} 
          key="name"
          render={(value) => value || "N/A"}
        />
        <Table.Column
          title="Asset Type"
          dataIndex={["asset", "asset_type"]}
          key="asset_type"
          render={(value) => <Tag color="blue">{value || "N/A"}</Tag>}
        />
        <Table.Column 
          title="Description" 
          dataIndex={["asset", "description"]} 
          key="description"
          render={(value) => value || "N/A"}
        />
        <Table.Column
          title="Classification"
          dataIndex={["asset", "classification"]}
          key="classification"
          render={(value) => <Tag color="green">{value || "N/A"}</Tag>}
        />
        <Table.Column
          title="Status"
          dataIndex={["asset", "status"]}
          key="status"
          render={(value) => <Tag color="orange">{value || "N/A"}</Tag>}
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_, record: any) => (
            <Space>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleAssetUntag(record.id)}
              >
                Untag
              </Button>
            </Space>
          )}
        />
      </Table>
    </>
  );
};
