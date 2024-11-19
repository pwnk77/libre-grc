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
import { BaseKey, BaseRecord, CrudFilters, useNavigation, useList } from "@refinedev/core";
import { Space, Table, Checkbox, Button, Popover, Select, Input, Tag, AutoComplete, Typography } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined, SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ISearchItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  issuing_body: string;
  identifier: string;
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

const renderTitle = (title: string) => (
  <Text strong style={{ fontSize: "16px" }}>
    {title}
  </Text>
);

const renderItem = (item: ISearchItem): IOptionGroup => ({
  key: item.id,
  value: item.title,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{item.title}</Text>
        <Tag color="blue">{item.type}</Tag>
      </div>
      {item.description && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.description.length > 100 
            ? `${item.description.slice(0, 100)}...` 
            : item.description}
        </Text>
      )}
      <div style={{ marginTop: 4 }}>
        <Text type="secondary">
          {item.issuing_body} - {item.identifier}
        </Text>
      </div>
    </div>
  ),
});

export default function AuthorityDocumentsList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "title",
    "type",
    "identifier",
    "issuing_body",
    "version",
    "publication_date",
    "description",
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
          field: "title",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "type",
          operator: "eq",
          value: null,
        },
      ],
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { type } = params as {
        type: string;
      };

      if (value) {
        filters.push({
          operator: "or",
          value: [
            { field: "title", operator: "contains", value },
            { field: "identifier", operator: "contains", value },
            { field: "description", operator: "contains", value },
          ],
        });
      }

      if (type) {
        filters.push({
          field: "type",
          operator: "eq",
          value: type,
        });
      }

      return filters;
    },
  });

  const { refetch: refetchDocuments } = useList<ISearchItem>({
    resource: "authority_documents",
    filters: [
      {
        operator: "or",
        value: [
          { field: "title", operator: "contains", value },
          { field: "identifier", operator: "contains", value },
          { field: "description", operator: "contains", value }
        ]
      }
    ],
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const documentOptionGroup = data.data.map(renderItem);
        if (documentOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Authority Documents"),
              options: documentOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    if (value.length > 2) {
      refetchDocuments();
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

  const { selectProps: typeSelectProps } = useSelect({
    resource: "authority_documents",
    optionLabel: "type",
    optionValue: "type",
  });

  const allColumns = [
    {
      dataIndex: "title",
      title: "Title",
      sorter: true,
    },
    {
      dataIndex: "type",
      title: "Type",
      sorter: true,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Type"
            {...typeSelectProps}
          >
            <Select.Option value="Circular">Circular</Select.Option>
            <Select.Option value="Certification">Certification</Select.Option>
            <Select.Option value="Standard">Standard</Select.Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "identifier",
      title: "Identifier",
    },
    {
      dataIndex: "issuing_body",
      title: "Issuing Body",
    },
    {
      dataIndex: "version",
      title: "Version",
    },
    {
      dataIndex: "publication_date",
      title: "Publication Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "description",
      title: "Description",
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
            disabled={column.dataIndex === 'title'}
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
      if (column.dataIndex === 'title') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("authority_documents", record.id as BaseKey)}>{value}</a>
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
            show("authority_documents", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search authority documents by title, identifier, or description..."
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
