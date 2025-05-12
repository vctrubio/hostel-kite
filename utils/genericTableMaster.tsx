import React from "react";
import { Table, Button, Space, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleFilled, StopOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { genericTableView } from "./modelTableViews";

// Types
type ModelKey = keyof typeof genericTableView;
type ModelData = any[] | null;
type TableRecord = any;

// Component for verification status tag
const VerificationStatus: React.FC<{ userId: string | undefined }> = ({ userId }) => {
  const isVerified = !!userId;
  
  return isVerified ? (
    <Tooltip title="User account linked">
      <Tag color="success" icon={<CheckCircleFilled />}>
        Verified
      </Tag>
    </Tooltip>
  ) : (
    <Tooltip title="No user account linked">
      <Tag color="error" icon={<StopOutlined />}>
        Unverified
      </Tag>
    </Tooltip>
  );
};

// Component for action buttons
const ActionButtons: React.FC<{ 
  record: TableRecord, 
  actions: any,
  router: ReturnType<typeof useRouter>
}> = ({ record, actions, router }) => {
  return (
    <Space size="middle">
      {actions.edit && (
        <Button 
          icon={<EditOutlined />} 
          onClick={() => {
            console.log('Edit clicked for:', record);
            router.push(`${actions.edit.url}/${record._id}`);
          }}
        />
      )}
      {actions.delete && (
        <Button 
          icon={<DeleteOutlined />} 
          danger
          onClick={() => {
            console.log('Delete clicked for:', record);
            router.push(`${actions.delete.url}/${record._id}`);
          }}
        />
      )}
    </Space>
  );
};

// Component for expanded row content
const ExpandedRowContent: React.FC<{
  record: TableRecord,
  modelConfig: any
}> = ({ record, modelConfig }) => {
  const additionalDetails = [];
  
  // Add any fields that aren't in the columns
  for (const [key, value] of Object.entries(record)) {
    // Skip fields that are already in columns or are internal fields
    if (key === 'key' || key === '_id' || key === '_creationTime' || 
        Object.keys(modelConfig.columns).includes(key)) {
      continue;
    }
    
    if (value !== undefined && value !== null) {
      additionalDetails.push(
        <div key={key} style={{ margin: '4px 0' }}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </div>
      );
    }
  }
  
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Additional Details for {record.fullName}
      </div>
      {additionalDetails.length > 0 ? (
        additionalDetails
      ) : (
        <div>No additional details available.</div>
      )}
    </div>
  );
};

// Component for column generator
const useTableColumns = (modelKey: string, data: ModelData) => {
  const router = useRouter();
  const modelConfig = genericTableView[modelKey as ModelKey];
  
  if (!modelConfig) {
    console.error(`No configuration found for model: ${modelKey}`);
    return [];
  }

  const allColumns = [];
  
  // Add verification column first if this is students or teachers
  if (modelKey === "students" || modelKey === "teachers") {
    allColumns.push({
      title: 'Verified',
      dataIndex: 'userId',
      key: 'verified',
      width: 90,
      filters: [
        { text: 'Verified', value: 'true' },
        { text: 'Not Verified', value: 'false' },
      ],
      onFilter: (value: string | number | boolean, record: any) => {
        // Convert string value back to boolean for comparison
        const filterValue = value === 'true';
        return filterValue ? !!record.userId : !record.userId;
      },
      render: (userId: string | undefined) => <VerificationStatus userId={userId} />
    });
  }

  // Add regular columns
  const regularColumns = Object.entries(modelConfig.columns).map(([key, type]) => {
    const column = {
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key: key,
      sorter: type === "string" 
        ? (a: any, b: any) => a[key].localeCompare(b[key])
        : type === "number" 
          ? (a: any, b: any) => a[key] - b[key]
          : undefined,
    };

    if (type === "array") {
      return {
        ...column,
        render: (values: any[]) => Array.isArray(values) ? values.join(', ') : values,
        filters: data 
          ? Array.from(new Set(data.flatMap((item: any) => 
              Array.isArray(item[key]) ? item[key] : [])))
            .map(value => ({ text: value, value }))
          : [],
        onFilter: (value: any, record: any) => 
          Array.isArray(record[key]) && record[key].includes(value),
      };
    }

    if (type === "string") {
      return {
        ...column,
        filterSearch: true,
        filters: data 
          ? Array.from(new Set(data.map((item: any) => item[key])))
              .map(value => ({ text: value, value })) 
          : [],
        onFilter: (value: any, record: any) => record[key].indexOf(value) === 0,
      };
    }

    return column;
  });
  
  // Add regular columns
  allColumns.push(...regularColumns);

  // Add action column if actions are defined
  if (modelConfig.actions) {
    allColumns.push({
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <ActionButtons record={record} actions={modelConfig.actions} router={router} />
      )
    });
  }

  return allColumns;
};

/**
 * Creates a data table for model-based data
 * @param modelKey The key of the model in genericTableView (e.g., 'students', 'teachers')
 * @param data The data to be displayed in the table
 * @returns Ant Design Table component
 */
export function GenericTable({ modelKey, data }: { 
  modelKey: string,
  data: any[] | undefined
}) {
  // Lookup the configuration from genericTableView
  const modelConfig = genericTableView[modelKey as ModelKey];
  
  if (!modelConfig) {
    return <div>Configuration not found for {modelKey}</div>;
  }

  // Convert undefined to null for consistency
  const tableData = data || null;
  const columns = useTableColumns(modelKey, tableData);
  
  if (!tableData) {
    return <div>Loading...</div>;
  }
  
  return (
    <Table 
      columns={columns} 
      dataSource={tableData.map(item => ({
        ...item,
        key: item._id,
      }))}
      expandable={{
        expandedRowRender: (record) => (
          <ExpandedRowContent record={record} modelConfig={modelConfig} />
        ),
        expandRowByClick: true,
      }}
    />
  );
}