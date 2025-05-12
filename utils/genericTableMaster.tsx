import { Table, Button, Space, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleFilled, StopOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { genericTableView } from "./modelTableViews";

/**
 * Creates dynamic table columns based on model configuration
 * @param modelKey The key of the model in genericTableView (e.g., 'students', 'teachers')
 * @param data The data to be displayed in the table
 * @returns Column configuration for Ant Design Table
 */
export function generateTableColumns(modelKey: string, data: any[] | null) {
  const router = useRouter();
  const modelConfig = genericTableView[modelKey as keyof typeof genericTableView];
  
  if (!modelConfig) {
    console.error(`No configuration found for model: ${modelKey}`);
    return [];
  }

  // Add verification status column for students and teachers
  const allColumns = [];
  
  // Add verification column first if this is students or teachers
  if (modelKey === "students" || modelKey === "teachers") {
    allColumns.push({
      title: 'Verified',
      dataIndex: 'userId',
      key: 'verified',
      width: 90,
      filters: [
        { text: 'Verified', value: true },
        { text: 'Not Verified', value: false },
      ],
      onFilter: (value: boolean, record: any) => {
        return value ? !!record.userId : !record.userId;
      },
      render: (userId: string | undefined) => {
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
      },
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
        <Space size="middle">
          {modelConfig.actions.edit && (
            <Button 
              icon={<EditOutlined />} 
              onClick={() => {
                console.log('Edit clicked for:', record);
                router.push(`${modelConfig.actions.edit.url}/${record._id}`);
              }}
            />
          )}
          {modelConfig.actions.delete && (
            <Button 
              icon={<DeleteOutlined />} 
              danger
              onClick={() => {
                console.log('Delete clicked for:', record);
                // For now just navigating, but could be used for delete confirmation
                router.push(`${modelConfig.actions.delete.url}/${record._id}`);
              }}
            />
          )}
        </Space>
      ),
    });
  }

  return allColumns;
}

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
  const modelConfig = genericTableView[modelKey as keyof typeof genericTableView];
  
  if (!modelConfig) {
    return <div>Configuration not found for {modelKey}</div>;
  }

  // Convert undefined to null for consistency
  const tableData = data || null;
  const columns = generateTableColumns(modelKey, tableData);
  
  return (
    <>
      {tableData ? (
        <Table 
          columns={columns} 
          dataSource={tableData.map(item => ({
            ...item,
            key: item._id,
          }))}
          expandable={{
            expandedRowRender: (record) => {
              // Show additional details in the expanded row
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
            },
            expandRowByClick: true,
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}