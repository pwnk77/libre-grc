"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  useTable,
  FilterDropdown,
  useSelect,
  CreateButton,
} from "@refinedev/antd";
import { BaseKey, BaseRecord, CrudFilters, useNavigation } from "@refinedev/core";
import { Space, Table, Checkbox, Button, Popover, Select, Input } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined } from "@ant-design/icons";

export default function CitationsList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "citation_text",
    "reference_identifier",
    "authority_document_id",
    "created_at",
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const { show } = useNavigation();

  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "authority_document_id",
          operator: "eq",
          value: null,
        },
      ],
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { authority_document_id } = params as {
        authority_document_id: string;
      };

      if (searchTerm) {
        filters.push({
          operator: "or",
          value: [
            { field: "citation_text", operator: "contains", value: searchTerm },
            { field: "reference_identifier", operator: "contains", value: searchTerm },
          ],
        });
      }

      if (authority_document_id) {
        filters.push({
          field: "authority_document_id",
          operator: "eq",
          value: authority_document_id,
        });
      }

      return filters;
    },
  });

  // Clear search on page reload
  useEffect(() => {
    setSearchTerm("");
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    if (newSearchTerm === "") {
      setFilters([], "replace");
    }
  };

  const handleSearch = () => {
    searchFormProps?.onFinish?.({});
  };

  const { selectProps: authorityDocumentSelectProps } = useSelect({
    resource: "authority_documents",
    optionLabel: "title",
    optionValue: "id",
  });

  const allColumns = [
    {
      dataIndex: "citation_text",
      title: "Citation Text",
      sorter: true,
    },
    {
      dataIndex: "reference_identifier",
      title: "Reference Identifier",
      sorter: true,
    },
    {
      dataIndex: "authority_document_id",
      title: "Authority Document",
      sorter: true,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder="Select Authority Document"
            {...authorityDocumentSelectProps}
          />
        </FilterDropdown>
      ),
      render: (value: any, record: any) => record.authority_document?.title,
    },
    {
      dataIndex: "created_at",
      title: "Created At",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "updated_at",
      title: "Updated At",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
  ];

  const ConfigureColumnsContent = (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {allColumns.map((column) => (
        <div key={column.dataIndex} style={{ marginBottom: '8px' }}>
          <Checkbox
            checked={selectedColumns.includes(column.dataIndex)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedColumns([...selectedColumns, column.dataIndex]);
              } else {
                setSelectedColumns(selectedColumns.filter(col => col !== column.dataIndex));
              }
            }}
          >
            {column.title}
          </Checkbox>
        </div>
      ))}
    </div>
  );

  const renderColumns = () => {
    const visibleColumns = allColumns.filter(col => selectedColumns.includes(col.dataIndex));
    return visibleColumns.map(column => {
      if (column.dataIndex === 'citation_text') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("citations", record.id as BaseKey)}>{value}</a>
            )}
          />
        );
      }
      return <Table.Column key={column.dataIndex} {...column} />;
    });
  };

  return (
    <List
      headerButtons={[
        <CreateButton key="create" />,
        <Popover
          key="configure"
          content={ConfigureColumnsContent}
          title="Configure Columns"
          trigger="click"
          placement="bottomRight"
        >
          <Button icon={<SettingOutlined />}>Configure</Button>
        </Popover>,
      ]}
    >
      <Input.Search
        placeholder="Search citations..."
        value={searchTerm}
        onChange={handleSearchChange}
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
        allowClear
      />
      <Table 
        {...tableProps} 
        rowKey="id"
      >
        {renderColumns()}
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}