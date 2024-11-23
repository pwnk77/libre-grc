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
  policy_name: string;
  purpose?: string;
  prepared_by?: string;
  workflow_status: string;
  review_date?: string;
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
  value: item.policy_name,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{item.policy_name}</Text>
        <Tag color={getWorkflowStatusColor(item.workflow_status)}>{item.workflow_status}</Tag>
      </div>
      {item.purpose && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.purpose.length > 100 
            ? `${item.purpose.slice(0, 100)}...` 
            : item.purpose}
        </Text>
      )}
      <div style={{ marginTop: 4 }}>
        <Space>
          {item.prepared_by && (
            <Text type="secondary">By: {item.prepared_by}</Text>
          )}
          {item.review_date && (
            <Text type="secondary">Review: {item.review_date}</Text>
          )}
        </Space>
      </div>
    </div>
  ),
});

const getWorkflowStatusColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'default';
    case 'Under Review':
      return 'processing';
    case 'Approved':
      return 'success';
    case 'Published':
      return 'blue';
    default:
      return 'default';
  }
};

export default function PoliciesList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "policy_name",
    "prepared_by",
    "review_date",
    "workflow_status",
    "created_at",
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
          field: "policy_name",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "workflow_status",
          operator: "eq",
          value: null,
        },
      ],
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { workflow_status } = params as {
        workflow_status: string;
      };

      if (value) {
        filters.push({
          operator: "or",
          value: [
            { field: "policy_name", operator: "contains", value },
            { field: "purpose", operator: "contains", value },
            { field: "prepared_by", operator: "contains", value }
          ]
        });
      }

      if (workflow_status) {
        filters.push({
          field: "workflow_status",
          operator: "eq",
          value: workflow_status,
        });
      }

      return filters;
    },
  });

  const { refetch: refetchPolicies } = useList<ISearchItem>({
    resource: "policies",
    filters: [
      {
        operator: "or",
        value: [
          { field: "policy_name", operator: "contains", value },
          { field: "purpose", operator: "contains", value },
          { field: "prepared_by", operator: "contains", value }
        ]
      }
    ],
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const policyOptionGroup = data.data.map(renderItem);
        if (policyOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Policies"),
              options: policyOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    if (value.length > 2) {
      refetchPolicies();
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

  const { selectProps: workflowStatusSelectProps } = useSelect({
    resource: "policies",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
  });

  const allColumns = [
    {
      dataIndex: "policy_name",
      title: "Policy Name",
      sorter: true,
    },
    {
      dataIndex: "purpose",
      title: "Purpose",
    },
    {
      dataIndex: "prepared_by",
      title: "Prepared By",
    },
    {
      dataIndex: "reviewed_by",
      title: "Reviewed By",
    },
    {
      dataIndex: "prepared_date",
      title: "Prepared Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "review_date",
      title: "Review Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "next_revision_due_date",
      title: "Next Revision Due Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "policy_link",
      title: "Policy Link",
      render: (value: string) => value ? <a href={value} target="_blank" rel="noopener noreferrer">View Policy</a> : "-",
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Status"
            {...workflowStatusSelectProps}
          />
        </FilterDropdown>
      ),
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
            disabled={column.dataIndex === 'policy_name'}
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
      if (column.dataIndex === 'policy_name') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("policies", record.id as BaseKey)}>{value}</a>
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
            show("policies", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search policies by name, purpose, or prepared by..."
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