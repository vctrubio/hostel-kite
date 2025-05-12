"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericTable } from "@/utils/genericTableMaster";
import { Tabs, Button, Modal, Form, Input, InputNumber, Space } from "antd";
import type { TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function EquipmentsPage() {
  // Fetch equipment data
  const kites = useQuery(api.models.equipment.getKites);
  const boards = useQuery(api.models.equipment.getBoards);
  const bars = useQuery(api.models.equipment.getBars);

  // Mutations for creating equipment
  const createKite = useMutation(api.models.equipment.createKite);
  const createBoard = useMutation(api.models.equipment.createBoard);
  const createBar = useMutation(api.models.equipment.createBar);

  // State for modals
  const [isKiteModalOpen, setIsKiteModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);

  // Form instances
  const [kiteForm] = Form.useForm();
  const [boardForm] = Form.useForm();
  const [barForm] = Form.useForm();

  // Form submit handlers
  const handleKiteSubmit = async (values: any) => {
    await createKite(values);
    kiteForm.resetFields();
    setIsKiteModalOpen(false);
  };

  const handleBoardSubmit = async (values: any) => {
    await createBoard(values);
    boardForm.resetFields();
    setIsBoardModalOpen(false);
  };

  const handleBarSubmit = async (values: any) => {
    await createBar(values);
    barForm.resetFields();
    setIsBarModalOpen(false);
  };

  // Tab items for each equipment type
  const tabItems: TabsProps["items"] = [
    {
      key: "kites",
      label: "Kites",
      children: (
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsKiteModalOpen(true)}
            className="mb-4"
          >
            Add New Kite
          </Button>
          
          <Modal
            title="Add New Kite"
            open={isKiteModalOpen}
            onCancel={() => setIsKiteModalOpen(false)}
            footer={null}
          >
            <Form form={kiteForm} layout="vertical" onFinish={handleKiteSubmit}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: 'Please enter the model name' }]}
              >
                <Input placeholder="Enter model name" />
              </Form.Item>
              <Form.Item
                name="size"
                label="Size"
                rules={[{ required: true, message: 'Please enter the size' }]}
              >
                <InputNumber min={1} placeholder="Size in m²" style={{ width: '100%' }} />
              </Form.Item>
              <Space className="flex justify-end">
                <Button onClick={() => setIsKiteModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </Space>
            </Form>
          </Modal>

          {kites ? (
            <GenericTable modelKey="kites" data={kites} />
          ) : (
            <p>Loading kites data...</p>
          )}
        </div>
      ),
    },
    {
      key: "boards",
      label: "Boards",
      children: (
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsBoardModalOpen(true)}
            className="mb-4"
          >
            Add New Board
          </Button>

          <Modal
            title="Add New Board"
            open={isBoardModalOpen}
            onCancel={() => setIsBoardModalOpen(false)}
            footer={null}
          >
            <Form form={boardForm} layout="vertical" onFinish={handleBoardSubmit}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: 'Please enter the model name' }]}
              >
                <Input placeholder="Enter model name" />
              </Form.Item>
              <Form.Item
                name="size"
                label="Size"
                rules={[{ required: true, message: 'Please enter the size' }]}
              >
                <InputNumber min={1} placeholder="Size in cm" style={{ width: '100%' }} />
              </Form.Item>
              <Space className="flex justify-end">
                <Button onClick={() => setIsBoardModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </Space>
            </Form>
          </Modal>

          {boards ? (
            <GenericTable modelKey="boards" data={boards} />
          ) : (
            <p>Loading boards data...</p>
          )}
        </div>
      ),
    },
    {
      key: "bars",
      label: "Bars",
      children: (
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsBarModalOpen(true)}
            className="mb-4"
          >
            Add New Bar
          </Button>

          <Modal
            title="Add New Bar"
            open={isBarModalOpen}
            onCancel={() => setIsBarModalOpen(false)}
            footer={null}
          >
            <Form form={barForm} layout="vertical" onFinish={handleBarSubmit}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: 'Please enter the model name' }]}
              >
                <Input placeholder="Enter model name" />
              </Form.Item>
              <Form.Item
                name="size"
                label="Size"
                rules={[{ required: true, message: 'Please enter the size' }]}
              >
                <InputNumber min={1} placeholder="Line length in m" style={{ width: '100%' }} />
              </Form.Item>
              <Space className="flex justify-end">
                <Button onClick={() => setIsBarModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </Space>
            </Form>
          </Modal>

          {bars ? (
            <GenericTable modelKey="bars" data={bars} />
          ) : (
            <p>Loading bars data...</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Equipment Management</h1>
      <div className="p-6 rounded-lg shadow">
        <Tabs defaultActiveKey="kites" items={tabItems} />
      </div>
    </main>
  );
}