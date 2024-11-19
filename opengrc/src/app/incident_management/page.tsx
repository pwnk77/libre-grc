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
  incident_id: string;
  incident_summary: string;
  description?: string;
  severity: string;
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

const renderItem = (
  item: ISearchItem
): IOptionGroup => ({
  key: item.id,
  value: `${item.incident_id}: ${item.incident_summary}`,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{`${item.incident_id}: ${item.incident_summary}`}</Text>
        <Tag color={getSeverityColor(item.severity)}>{item.severity}</Tag>
      </div>
      {item.description && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.description.length > 100 
            ? `${item.description.slice(0, 100)}...` 
            : item.description}
        </Text>
      )}
    </div>
  ),
});

export default function IncidentsList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "incident_id",
    "incident_summary",
    "severity",
    "impact_type",
    "incident_status",
    "workflow_status",
    "created_at",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
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
          field: "incident_id",
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
      const { workflow_status, severity } = params as {
        workflow_status: string;
        severity: string;
      };

      if (searchTerm) {
        filters.push({
          operator: "or",
          value: [
            { field: "incident_id", operator: "contains", value: searchTerm },
            { field: "incident_summary", operator: "contains", value: searchTerm },
            { field: "description", operator: "contains", value: searchTerm },
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

      if (severity) {
        filters.push({
          field: "severity",
          operator: "eq",
          value: severity,
        });
      }

      return filters;
    },
  });

  const { refetch: refetchIncidents } = useList<ISearchItem>({
    resource: "incident_management",
    filters: [
      {
        operator: "or",
        value: [
          { field: "incident_id", operator: "contains", value },
          { field: "incident_summary", operator: "contains", value },
          { field: "description", operator: "contains", value }
        ]
      }
    ],
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const incidentOptionGroup = data.data.map((item) => renderItem(item));
        if (incidentOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Incidents"),
              options: incidentOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setSearchTerm("");
    setOptions([]);
    if (value.length > 2) {
      refetchIncidents();
    }
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

  const allColumns = [
    {
      dataIndex: "incident_id",
      title: "Incident ID",
      sorter: true,
    },
    {
      dataIndex: "incident_summary",
      title: "Incident Summary",
      sorter: true,
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "severity",
      title: "Severity",
      render: (value: string) => <Tag color={getSeverityColor(value)}>{value}</Tag>,
    },
    {
      dataIndex: "impact_type",
      title: "Impact Type",
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      dataIndex: "incident_status",
      title: "Status",
      render: (value: string) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    {
      dataIndex: "detection_method",
      title: "Detection Method",
    },
    {
      dataIndex: "response_time",
      title: "Response Time",
      render: (value: any) => <DateField value={value} format="YYYY-MM-DD HH:mm:ss" />,
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      render: (value: string) => <Tag color={getWorkflowStatusColor(value)}>{value}</Tag>,
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
            disabled={column.dataIndex === 'incident_id'}
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
      if (column.dataIndex === 'incident_id') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("incident_management", record.id as BaseKey)}>{value}</a>
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
            show("incident_management", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search incidents by ID, summary, or description..."
          suffix={<SearchOutlined />}
          size="large"
        />
      </AutoComplete>
    </div>
  );

  const getSeverityTag = (severity: string) => {
    const color = getSeverityColor(severity);
    return <Tag color={color}>{severity}</Tag>;
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

function getWorkflowStatusColor(status: string) {
  switch (status) {
    case 'Reported':
      return 'blue';
    case 'Under Investigation':
      return 'orange';
    case 'Remediation':
      return 'purple';
    case 'Resolved':
      return 'green';
    case 'Closed':
      return 'gray';
    default:
      return 'default';
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'Critical':
      return 'red';
    case 'High':
      return 'orange';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'green';
    default:
      return 'default';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Open':
      return 'red';
    case 'In Progress':
      return 'blue';
    case 'Resolved':
      return 'green';
    case 'Closed':
      return 'gray';
    default:
      return 'default';
  }
} 