"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Table, Space, Typography, Modal, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SessionForm from "@/components/forms/sessionForm";

const { Title } = Typography;

//session should not exist without a lesson. lesson should therefore always be assigned
export default function SessionsPage() {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch data
  const sessions = useQuery(api.models.session.get);
  const kites = useQuery(api.models.equipment.getKites);
  const boards = useQuery(api.models.equipment.getBoards);
  const bars = useQuery(api.models.equipment.getBars);
  const lessons = useQuery(api.models.lesson.get);
  
  // State to store enriched sessions with equipment names
  const [enrichedSessions, setEnrichedSessions] = useState<any[]>([]);
  
  // Delete mutation
  const deleteSession = useMutation(api.models.session.deleteId);

  // Process sessions to add readable equipment information
  useEffect(() => {
    if (sessions && kites && boards && bars && lessons) {
      const enriched = sessions.map(session => {
        // Find equipment info
        const kite = kites.find(k => k._id === session.kiteId);
        const board = boards.find(b => b._id === session.boardId);
        const bar = bars.find(b => b._id === session.barId);
        
        // Find which lessons use this session
        const relatedLessons = lessons.filter(
          lesson => lesson.sessionId && lesson.sessionId.includes(session._id)
        );
        
        return {
          ...session,
          kiteName: kite ? `${kite.model} (${kite.size}m²)` : "Unknown Kite",
          boardName: board ? `${board.model} (${board.size}cm)` : "Unknown Board",
          barName: bar ? `${bar.model} (${bar.size}m)` : "Unknown Bar",
          lessonIds: relatedLessons.map(lesson => lesson._id),
          hasLesson: relatedLessons.length > 0
        };
      });
      
      setEnrichedSessions(enriched);
    }
  }, [sessions, kites, boards, bars, lessons]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      await deleteSession({ id: sessionId as any });
    }
  };

  // Columns for sessions table
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => a.date.localeCompare(b.date)
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (minutes: number) => `${minutes} minutes`,
      sorter: (a: any, b: any) => a.duration - b.duration
    },
    {
      title: 'Kite',
      dataIndex: 'kiteName',
      key: 'kiteName',
    },
    {
      title: 'Board',
      dataIndex: 'boardName',
      key: 'boardName',
    },
    {
      title: 'Bar',
      dataIndex: 'barName',
      key: 'barName',
    },
    {
      title: 'Lesson',
      key: 'lesson',
      render: (record: any) => (
        record.hasLesson ? 
          <Tag color="green">Assigned</Tag> : 
          <Tag color="orange">Unassigned</Tag>
      ),
      filters: [
        { text: 'Assigned', value: true },
        { text: 'Unassigned', value: false },
      ],
      onFilter: (value: any, record: any) => record.hasLesson === value
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          <Button 
            danger 
            size="small" 
            onClick={() => handleDeleteSession(record._id)}
            disabled={record.hasLesson}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="container mx-auto p-4">
      <Title level={2}>Sessions Management</Title>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4 flex justify-between items-center">
          <Title level={4} style={{ margin: 0 }}>All Equipment Sessions</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            Create New Session
          </Button>
        </div>
        
        {/* Modal for creating new session */}
        <Modal
          title="Create New Session"
          open={isModalOpen}
          onCancel={closeModal}
          footer={null}
          width={700}
        >
          <SessionForm />
        </Modal>
        
        {/* Sessions Table */}
        <div className="mb-4">
          <p className="text-gray-600">
            Total Sessions: {sessions?.length || 0} | 
            Assigned: {enrichedSessions.filter(s => s.hasLesson).length} | 
            Unassigned: {enrichedSessions.filter(s => !s.hasLesson).length}
          </p>
        </div>
        
        <Table 
          dataSource={enrichedSessions} 
          columns={columns}
          rowKey="_id"
          loading={sessions === undefined}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </main>
  );
}