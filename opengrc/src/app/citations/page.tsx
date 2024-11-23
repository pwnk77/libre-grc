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
import { BaseKey, BaseRecord, CrudFilters, useNavigation, useList, useMany } from "@refinedev/core";
import { Space, Table, Checkbox, Button, Popover, Select, Input, Tag, AutoComplete, Typography } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined, SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Add interfaces for type safety
interface ISearchItem {
  id: string;
  citation_text: string;
  reference_identifier?: string;
  authority_document_id?: string;
  authority_document?: {
    title: string;
  };
}

interface IOptionGroup {
  key: string;
  value: string;
  label: React.ReactNode;
}

interface IOptions {
  label: React.ReactNode;
  options: IOptionGroup[];
}

// Add helper functions for rendering search results
const renderTitle = (title: string) => (
  <Text strong style={{ fontSize: "16px" }}>
    {title}
  </Text>
);

const renderItem = (item: ISearchItem): IOptionGroup => ({
  key: item.id,
  value: item.citation_text,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{item.citation_text.substring(0, 100)}...</Text>
        {item.authority_document && (
          <Tag color="blue">{item.authority_document.title}</Tag>
        )}
      </div>
      {item.reference_identifier && (
        <div style={{ marginTop: 4 }}>
          <Text type="secondary">
            Ref: {item.reference_identifier}
          </Text>
        </div>
      )}
    </div>
  ),
});

export default function CitationsList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "citation_text",
    "reference_identifier",
    "authority_document_id",
    "created_at",
    "updated_at",
  ]);
  const [value, setValue] = useState<string>("");
  const [options, setOptions] = useState<IOptions[]>([]);

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

      if (value) {
        filters.push({
          operator: "or",
          value: [
            { field: "citation_text", operator: "contains", value },
            { field: "reference_identifier", operator: "contains", value },
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

  const authorityDocumentIds = tableProps?.dataSource?.map((item: any) => item.authority_document_id).filter(Boolean) ?? [];

  const { data: authorityDocumentsData, isLoading: authorityDocumentsLoading } = useMany({
    resource: "authority_documents",
    ids: authorityDocumentIds,
    queryOptions: {
      enabled: authorityDocumentIds.length > 0,
    },
  });

  // Clear search on page reload
  useEffect(() => {
    setValue("");
  }, []);

  const { refetch: refetchCitations } = useList<ISearchItem>({
    resource: "citations",
    filters: [
      {
        operator: "or",
        value: [
          { field: "citation_text", operator: "contains", value },
          { field: "reference_identifier", operator: "contains", value }
        ]
      }
    ],
    meta: {
      fields: [
        "id",
        "citation_text",
        "reference_identifier",
        "authority_document_id",
        {
          authority_document: ["title"],
        },
      ],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const citationOptionGroup = data.data.map(renderItem);
        if (citationOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Citations"),
              options: citationOptionGroup,
            },
          ]);
        }
      },
    },
  });

  // Update useEffect for search
  useEffect(() => {
    setOptions([]);
    if (value.length > 2) {
      refetchCitations();
    }
  }, [value]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setValue(newSearchTerm);
    
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
      render: (value: any, record: any) => {
        const authorityDocument = authorityDocumentsData?.data?.find(
          (item: any) => item.id === record.authority_document_id
        );
        return (
          <a onClick={() => show("authority_documents", record.authority_document_id as BaseKey)}>
            {authorityDocument?.title || "N/A"}
          </a>
        );
      },
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

  const renderSearch = () => (
    <div style={{ 
      width: 500, 
      marginBottom: 16,
      marginLeft: 'auto'  // Push to right side
    }}>
      <AutoComplete<string, IOptions>
        style={{ width: "100%" }}
        options={options}
        onSearch={(value: string) => setValue(value)}
        onSelect={(value, option: any) => {
          if (option.key) {
            show("citations", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search citations by text or reference identifier..."
          suffix={<SearchOutlined />}
          size="large"
        />
      </AutoComplete>
    </div>
  );

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
      {renderSearch()}
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
