"use client";

import {
  DateField,
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
  audit_name: string;
  scope?: string;
  description?: string;
  workflow_status: string;
  planned_start_date?: string;
  planned_end_date?: string;
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
  value: item.audit_name,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{item.audit_name}</Text>
        <Tag color={getWorkflowStatusColor(item.workflow_status)}>{item.workflow_status}</Tag>
      </div>
      {item.scope && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.scope.length > 100 
            ? `${item.scope.slice(0, 100)}...` 
            : item.scope}
        </Text>
      )}
      <div style={{ marginTop: 4 }}>
        <Space>
          {item.planned_start_date && (
            <Text type="secondary">Start: {item.planned_start_date}</Text>
          )}
          {item.planned_end_date && (
            <Text type="secondary">End: {item.planned_end_date}</Text>
          )}
        </Space>
      </div>
    </div>
  ),
});

const getWorkflowStatusColor = (status: string) => {
  switch (status) {
    case 'Planned':
      return 'blue';
    case 'In Progress':
      return 'orange';
    case 'Reporting':
      return 'purple';
    case 'Closed':
      return 'green';
    default:
      return 'default';
  }
};

export default function AuditsList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "audit_name",
    "scope",
    "planned_start_date",
    "planned_end_date",
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
          field: "audit_name",
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
            { field: "audit_name", operator: "contains", value },
            { field: "scope", operator: "contains", value },
            { field: "description", operator: "contains", value },
          ],
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

  const { refetch: refetchAudits } = useList<ISearchItem>({
    resource: "audits",
    filters: [
      {
        operator: "or",
        value: [
          { field: "audit_name", operator: "contains", value },
          { field: "scope", operator: "contains", value },
          { field: "description", operator: "contains", value }
        ]
      }
    ],
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const auditOptionGroup = data.data.map(renderItem);
        if (auditOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Audits"),
              options: auditOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    if (value.length > 2) {
      refetchAudits();
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
    resource: "audits",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
    defaultValue: ["Planned", "In Progress", "Reporting", "Closed"],
  });

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'blue';
      case 'In Progress':
        return 'orange';
      case 'Reporting':
        return 'purple';
      case 'Closed':
        return 'green';
      default:
        return 'default';
    }
  };

  const allColumns = [
    {
      dataIndex: "audit_name",
      title: "Audit Name",
      sorter: true,
    },
    {
      dataIndex: "scope",
      title: "Scope",
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "related_circulars",
      title: "Related Circulars",
      render: (circulars: string[]) => circulars?.join(", "),
    },
    {
      dataIndex: "planned_start_date",
      title: "Planned Start Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "planned_end_date",
      title: "Planned End Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "actual_start_date",
      title: "Actual Start Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "actual_end_date",
      title: "Actual End Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "key_stakeholders",
      title: "Key Stakeholders",
      render: (stakeholders: string[]) => stakeholders?.join(", "),
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      sorter: true,
      render: (value: string) => (
        <Tag color={getWorkflowStatusColor(value)}>{value}</Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Workflow Status"
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
            disabled={column.dataIndex === 'audit_name'}
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
      if (column.dataIndex === 'audit_name') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("audits", record.id as BaseKey)}>{value}</a>
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
            show("audits", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search audits by name, scope, or description..."
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
      </Table>
    </List>
  );
}
