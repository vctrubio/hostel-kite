import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

  const columns = Object.entries(modelConfig.columns).map(([key, type]) => {
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

  // Add action column if actions are defined
  if (modelConfig.actions) {
    columns.push({
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

  return columns;
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
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                This is an expandable row for {record.fullName}. Additional details can be shown here.
              </p>
            ),
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}