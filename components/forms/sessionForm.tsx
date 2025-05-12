"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Form, Select, DatePicker, InputNumber, Button, message, Card, Space, Alert, Spin } from "antd";
import { Id } from "@/convex/_generated/dataModel";
import dayjs from "dayjs";

interface SessionFormProps {
  sessionId?: string; // Optional for new sessions
  lessonId?: string; // Optional, used when creating a session for a specific lesson
}

export default function SessionForm({ sessionId, lessonId }: SessionFormProps = {}) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(!sessionId); // Edit mode if new session
  const [messageApi, contextHolder] = message.useMessage();

  // Get data
  const kites = useQuery(api.models.equipment.getKites);
  const boards = useQuery(api.models.equipment.getBoards);
  const bars = useQuery(api.models.equipment.getBars);
  
  const sessionData = useQuery(
    api.models.session.getById,
    sessionId ? { id: sessionId as Id<"sessions"> } : "skip"
  );
  
  // Mutations
  const createSession = useMutation(api.models.session.create);
  const updateSession = useMutation(api.models.session.updateId);
  const addSessionToLesson = useMutation(api.models.lesson.addSessionToLesson);

  // Update form when session data is loaded
  useEffect(() => {
    if (sessionData) {
      form.setFieldsValue({
        ...sessionData,
        date: sessionData.date ? dayjs(sessionData.date) : undefined,
      });
    }
  }, [sessionData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Format date as string for storage
      const formattedValues = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };
      
      if (sessionId) {
        // Update existing session
        await updateSession({
          id: sessionId as Id<"sessions">,
          ...formattedValues,
        });
        messageApi.success("Session updated successfully!");
        setIsEditing(false);
      } else {
        // Create new session
        const newSessionId = await createSession(formattedValues);
        
        // If this session is being created for a specific lesson, add it to that lesson
        if (lessonId) {
          await addSessionToLesson({ 
            lessonId: lessonId as Id<"lessons">, 
            sessionId: newSessionId 
          });
        }
        
        messageApi.success("Session created successfully!");
        form.resetFields();
      }
    } catch (error) {
      messageApi.error(`Error: ${error}`);
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (sessionData) {
      form.setFieldsValue({
        ...sessionData,
        date: sessionData.date ? dayjs(sessionData.date) : undefined,
      });
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(true);
  };

  // Loading state
  if (sessionId && sessionData === undefined) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  // Session not found
  if (sessionId && sessionData === null) {
    return (
      <Alert
        message="Session Not Found"
        description={`The session with ID ${sessionId} does not exist.`}
        type="error"
        showIcon
      />
    );
  }

  // Determine the title based on the current mode
  const title = sessionId 
    ? `Equipment Session`
    : `New Equipment Session`;

  // Create extra header content with buttons and/or ID
  const extraHeaderContent = sessionId ? (
    isEditing ? (
      <Space>
        <Button type="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Space>
    ) : (
      <Button type="primary" onClick={toggleEditMode}>
        Edit
      </Button>
    )
  ) : null;

  return (
    <Card
      title={
        <div className="flex items-center gap-4">
          <span>{title}</span>
          {sessionId && (
            <span className="text-gray-500 text-sm font-mono">ID: {sessionId}</span>
          )}
        </div>
      }
      extra={extraHeaderContent}
      className="w-full shadow-md bg-white"
    >
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={sessionData || {}}
      >
        {/* Equipment Selection */}
        <Form.Item
          name="kiteId"
          label="Kite"
          rules={[{ required: true, message: 'Please select a kite' }]}
        >
          <Select 
            placeholder="Select a kite"
            disabled={!isEditing}
            loading={kites === undefined}
            options={kites?.map(kite => ({
              label: `${kite.model} - ${kite.size}m²`,
              value: kite._id,
            }))}
          />
        </Form.Item>
        
        <Form.Item
          name="barId"
          label="Bar"
          rules={[{ required: true, message: 'Please select a bar' }]}
        >
          <Select 
            placeholder="Select a bar"
            disabled={!isEditing}
            loading={bars === undefined}
            options={bars?.map(bar => ({
              label: `${bar.model} - ${bar.size}m`,
              value: bar._id,
            }))}
          />
        </Form.Item>
        
        <Form.Item
          name="boardId"
          label="Board"
          rules={[{ required: true, message: 'Please select a board' }]}
        >
          <Select 
            placeholder="Select a board"
            disabled={!isEditing}
            loading={boards === undefined}
            options={boards?.map(board => ({
              label: `${board.model} - ${board.size}cm`,
              value: board._id,
            }))}
          />
        </Form.Item>
        
        {/* Date Selection */}
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker 
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            disabled={!isEditing}
          />
        </Form.Item>
        
        {/* Duration */}
        <Form.Item
          name="duration"
          label="Duration (minutes)"
          rules={[{ required: true, message: 'Please enter the duration' }]}
        >
          <InputNumber
            min={15}
            step={15}
            style={{ width: '100%' }}
            disabled={!isEditing}
          />
        </Form.Item>
        
        {/* Submit Button for New Session */}
        {!sessionId && (
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} block>
              {lessonId ? "Add Session to Lesson" : "Create Session"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
}