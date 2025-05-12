"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Modal, Card, Table, Space, Tabs, Badge, Typography, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LessonForm from "@/components/forms/lessonForm";
import SessionForm from "@/components/forms/sessionForm";
import type { TabsProps } from "antd";

const { Title, Text } = Typography;

export default function LessonsPage() {
  // State for modals
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Fetch data
  const lessons = useQuery(api.models.lesson.get);
  const teachers = useQuery(api.models.teacher.get);
  const bookings = useQuery(api.models.booking.get);
  const packages = useQuery(api.models.package.get);
  const students = useQuery(api.models.student.get);
  
  // State to store enriched lessons data with readable names
  const [enrichedLessons, setEnrichedLessons] = useState<any[]>([]);
  const [sessionsByLesson, setSessionsByLesson] = useState<Record<string, any[]>>({});
  
  // Delete mutation
  const deleteLesson = useMutation(api.models.lesson.deleteId);
  const deleteSession = useMutation(api.models.session.deleteId);
  
  // Load sessions for selected lesson
  const selectedLessonSessions = useQuery(
    api.models.session.getSessionsByLessonId, 
    selectedLessonId ? { lessonId: selectedLessonId as any } : "skip"
  );
  
  // Process lessons to add readable information
  useEffect(() => {
    if (lessons && teachers && bookings && packages && students) {
      const enriched = lessons.map(lesson => {
        // Find teacher info
        const teacher = teachers.find(t => t._id === lesson.teacherId);
        
        // Find booking info
        const booking = bookings.find(b => b._id === lesson.bookingId);
        
        // Find package info if booking exists
        const pkg = booking?.packageId ? 
          packages.find(p => p._id === booking.packageId) : null;
        
        // Find students info if booking exists
        const studentNames = booking?.studentsIds
          ?.map(id => {
            const student = students.find(s => s._id === id);
            return student ? student.fullName : "Unknown";
          })
          .join(", ") || "No students";
        
        return {
          ...lesson,
          teacherName: teacher?.fullName || "Unknown Teacher",
          packageName: pkg?.desc || "Unknown Package",
          studentNames,
          sessionCount: (lesson.sessionId || []).length,
          date: booking?.startDate || "No date",
        };
      });
      
      setEnrichedLessons(enriched);
    }
  }, [lessons, teachers, bookings, packages, students]);

  // Update sessions when a lesson is selected
  useEffect(() => {
    if (selectedLessonSessions) {
      if (selectedLessonId) {
        setSessionsByLesson(prev => ({
          ...prev,
          [selectedLessonId]: selectedLessonSessions
        }));
      }
    }
  }, [selectedLessonSessions, selectedLessonId]);

  const showLessonModal = () => {
    setIsLessonModalOpen(true);
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  const showSessionModal = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setIsSessionModalOpen(true);
  };

  const closeSessionModal = () => {
    setIsSessionModalOpen(false);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      await deleteLesson({ id: lessonId as any });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      await deleteSession({ id: sessionId as any });
    }
  };

  const handleViewLessonDetails = (lessonId: string) => {
    setSelectedLessonId(lessonId === selectedLessonId ? null : lessonId);
  };

  // Columns for lessons table
  const lessonColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Package',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Students',
      dataIndex: 'studentNames',
      key: 'studentNames',
      ellipsis: true,
    },
    {
      title: 'Sessions',
      key: 'sessions',
      render: (record: any) => (
        <Badge 
          count={record.sessionCount} 
          style={{ backgroundColor: record.sessionCount ? '#52c41a' : '#d9d9d9' }} 
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          <Button 
            type={selectedLessonId === record._id ? "primary" : "default"}
            size="small" 
            onClick={() => handleViewLessonDetails(record._id)}
          >
            {selectedLessonId === record._id ? "Hide Details" : "View Details"}
          </Button>
          <Button 
            type="primary" 
            size="small" 
            onClick={() => showSessionModal(record._id)}
          >
            Add Session
          </Button>
          <Button 
            danger 
            size="small" 
            onClick={() => handleDeleteLesson(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Columns for sessions table
  const sessionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (minutes: number) => `${minutes} minutes`
    },
    {
      title: 'Equipment',
      key: 'equipment',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">Kite: {record.kiteId}</Tag>
          <Tag color="green">Board: {record.boardId}</Tag>
          <Tag color="orange">Bar: {record.barId}</Tag>
        </Space>
      )
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
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="container mx-auto p-4">
      <Title level={2}>Lessons Management</Title>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4 flex justify-between items-center">
          <Title level={4} style={{ margin: 0 }}>All Lessons</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showLessonModal}
          >
            Create New Lesson
          </Button>
        </div>
        
        {/* Modal for creating new lesson */}
        <Modal
          title="Create New Lesson"
          open={isLessonModalOpen}
          onCancel={closeLessonModal}
          footer={null}
          width={700}
        >
          <LessonForm />
        </Modal>
        
        {/* Modal for adding a session to a lesson */}
        <Modal
          title="Add Equipment Session to Lesson"
          open={isSessionModalOpen}
          onCancel={closeSessionModal}
          footer={null}
          width={700}
        >
          {selectedLessonId && <SessionForm lessonId={selectedLessonId} />}
        </Modal>
        
        {/* Lessons Table */}
        <Table 
          dataSource={enrichedLessons} 
          columns={lessonColumns}
          rowKey="_id"
          expandable={{
            expandedRowRender: record => 
              <div>
                <Text strong>Sessions:</Text>
                <Table 
                  dataSource={
                    sessionsByLesson[record._id] || []
                  } 
                  columns={sessionColumns} 
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              </div>,
            expandIcon: () => null, // Hide the default expand icon
            expandedRowKeys: selectedLessonId ? [selectedLessonId] : [],
          }}
        />
      </div>
    </main>
  );
}