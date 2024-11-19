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

interface ISearchItem {
  id: string;
  product_name: string;
  description?: string;
  product_type: string;
  workflow_status: string;
}

interface ICompanyInfo {
  id: string;
  entity: string;
  business_unit?: string;
  sub_business_unit?: string;
  support_function?: string;
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
  value: item.product_name,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{item.product_name}</Text>
        <Tag color={getWorkflowStatusColor(item.workflow_status)}>{item.workflow_status}</Tag>
      </div>
      {item.description && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.description.length > 100 
            ? `${item.description.slice(0, 100)}...` 
            : item.description}
        </Text>
      )}
      <div>
        <Tag color="blue">{item.product_type}</Tag>
      </div>
    </div>
  ),
});

const getWorkflowStatusColor = (status: string) => {
  switch (status) {
    case 'Initiation':
      return 'blue';
    case 'Design Review':
      return 'orange';
    case 'Implementation':
      return 'green';
    case 'Verification':
      return 'purple';
    default:
      return 'default';
  }
};

export default function SecureByDesignList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "product_name",
    "description",
    "product_type",
    "expected_go_live_date",
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
          field: "product_name",
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
            { field: "product_name", operator: "contains", value },
            { field: "description", operator: "contains", value }
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

  const { refetch: refetchProducts } = useList<ISearchItem>({
    resource: "secure_by_design",
    filters: [
      {
        operator: "or",
        value: [
          { field: "product_name", operator: "contains", value },
          { field: "description", operator: "contains", value }
        ]
      }
    ],
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const productOptionGroup = data.data.map(renderItem);
        if (productOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Products"),
              options: productOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    if (value.length > 2) {
      refetchProducts();
    }
  }, [value]);

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
            show("secure_by_design", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search products by name or description..."
          suffix={<SearchOutlined />}
          size="large"
        />
      </AutoComplete>
    </div>
  );

  const { selectProps: workflowStatusSelectProps } = useSelect({
    resource: "secure_by_design",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
  });

  const { data: companyData, isLoading: companyLoading } = useMany<ICompanyInfo>({
    resource: "company_info",
    ids: tableProps?.dataSource?.map((item: any) => item.company_info_id) || [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const allColumns = [
    {
      dataIndex: "product_name",
      title: "Product Name",
      sorter: true,
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "product_type",
      title: "Product Type",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Product Type"
            options={[
              { value: 'New', label: 'New' },
              { value: 'Existing', label: 'Existing' },
            ]}
          />
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "expected_go_live_date",
      title: "Expected Go Live Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "infrastructure_details",
      title: "Infrastructure Details",
    },
    {
      dataIndex: "external_party_involvement",
      title: "External Party Involvement",
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      dataIndex: "applicable_compliances",
      title: "Applicable Compliances",
      render: (compliances: string[]) => compliances?.join(", "),
    },
    {
      dataIndex: "advisory_provided",
      title: "Advisory Provided",
    },
    {
      dataIndex: "reviewer",
      title: "Reviewer",
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      sorter: true,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Workflow Status"
            options={[
              { value: 'Initiation', label: 'Initiation' },
              { value: 'Design Review', label: 'Design Review' },
              { value: 'Implementation', label: 'Implementation' },
              { value: 'Verification', label: 'Verification' },
            ]}
          />
        </FilterDropdown>
      ),
      render: (value: string) => (
        <Tag color={getWorkflowStatusColor(value)}>{value}</Tag>
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
    {
      dataIndex: "company_info_id",
      title: "Company",
      render: (value: string) => {
        const company = companyData?.data?.find((item: ICompanyInfo) => item.id === value);
        return company ? company.entity : 'N/A';
      },
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
            disabled={column.dataIndex === 'product_name'}
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
      if (column.dataIndex === 'product_name') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("secure_by_design", record.id as BaseKey)}>{value}</a>
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
      {renderSearch()}
      <Table 
        {...tableProps} 
        rowKey="id"
        loading={tableProps.loading || companyLoading}
      >
        {renderColumns()}
      </Table>
    </List>
  );
}
