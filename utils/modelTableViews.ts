//key to module name, value to columns for tables and form config
export const genericTableView = {
  students: {
    columns: {
      fullName: "string",
      age: "number",
      languages: "array",
    },
    formFields: {
      fullName: {
        type: "string",
        label: "Full Name",
        required: true,
      },
      email: {
        type: "string",
        label: "Email",
        required: false,
      },
      phone: {
        type: "string",
        label: "Phone",
        required: false,
      },
      age: {
        type: "number",
        label: "Age",
        required: true,
        min: 1,
      },
      languages: {
        type: "multiselect",
        label: "Languages",
        required: false,
        options: ["English", "Spanish", "French"],
      },
    },
    actions: {
      edit: {
        url: "/students",
      },
      delete: {
        url: "/students",
      }
    }
  },
  teachers: {
    columns: {
      fullName: "string",
      languages: "array",
    },
    formFields: {
      fullName: {
        type: "string",
        label: "Full Name",
        required: true,
      },
      email: {
        type: "string",
        label: "Email",
        required: false,
      },
      phone: {
        type: "string",
        label: "Phone",
        required: false,
      },
      languages: {
        type: "multiselect",
        label: "Languages",
        required: false,
        options: ["English", "Spanish", "French"],
      },
    },
    actions: {
      edit: {
        url: "/teachers",
      },
      delete: {
        url: "/teachers",
      }
    }
  },
  kites: {
    columns: {
      model: "string",
      size: "number",
    },
    formFields: {
      model: {
        type: "string",
        label: "Model",
        required: true,
      },
      size: {
        type: "number",
        label: "Size",
        required: true,
        min: 1,
      },
    },
    actions: {
      edit: {
        url: "/equipments",
      },
      delete: {
        url: "/equipments",
      }
    }
  },
  boards: {
    columns: {
      model: "string",
      size: "number",
    },
    formFields: {
      model: {
        type: "string",
        label: "Model",
        required: true,
      },
      size: {
        type: "number",
        label: "Size",
        required: true,
        min: 1,
      },
    },
    actions: {
      edit: {
        url: "/equipments",
      },
      delete: {
        url: "/equipments",
      }
    }
  },
  bars: {
    columns: {
      model: "string",
      size: "number",
    },
    formFields: {
      model: {
        type: "string",
        label: "Model",
        required: true,
      },
      size: {
        type: "number",
        label: "Size",
        required: true,
        min: 1,
      },
    },
    actions: {
      edit: {
        url: "/equipments",
      },
      delete: {
        url: "/equipments",
      }
    }
  },
  packages: {
    columns: {
      price: "number",
      hours: "number",
      capacity: "number",
      desc: "string",
    },
    formFields: {
      price: {
        type: "number",
        label: "Price",
        required: true,
        min: 0,
      },
      hours: {
        type: "number",
        label: "Hours",
        required: true,
        min: 1,
      },
      capacity: {
        type: "number",
        label: "Capacity",
        required: true,
        min: 1,
      },
      desc: {
        type: "string",
        label: "Description",
        required: false,
      },
    },
    actions: {
      edit: {
        url: "/packages",
      },
      delete: {
        url: "/packages",
      }
    }
  },
  bookings: {
    columns: {
      startDate: "string",
      packageId: "string",
      studentsIds: "array",
    },
    formFields: {
      packageId: {
        type: "select",
        label: "Package",
        required: true,
        optionsQuery: "models.package.get",
        valueField: "_id",
        labelField: "desc",
      },
      studentsIds: {
        type: "multiselect",
        label: "Students",
        required: true,
        optionsQuery: "models.student.get",
        valueField: "_id",
        labelField: "fullName",
      },
      startDate: {
        type: "date",
        label: "Start Date",
        required: true,
      },
    },
    actions: {
      edit: {
        url: "/bookings",
      },
      delete: {
        url: "/bookings",
      }
    }
  },
  lessons: {
    columns: {
      teacherId: "string",
      bookingId: "string",
    },
    formFields: {
      teacherId: {
        type: "select",
        label: "Teacher",
        required: true,
        optionsQuery: "models.teacher.get",
        valueField: "_id",
        labelField: "fullName",
      },
      bookingId: {
        type: "select",
        label: "Booking",
        required: true,
        optionsQuery: "models.booking.get",
        valueField: "_id",
        labelField: "startDate",
      }
    },
    actions: {
      edit: {
        url: "/lessons",
      },
      delete: {
        url: "/lessons",
      }
    }
  },
  sessions: {
    columns: {
      kiteId: "string",
      boardId: "string",
      barId: "string",
      date: "string",
      duration: "number",
    },
    formFields: {
      kiteId: {
        type: "select",
        label: "Kite",
        required: true,
        optionsQuery: "models.equipment.getKites",
        valueField: "_id",
        labelField: "model",
      },
      barId: {
        type: "select",
        label: "Bar",
        required: true,
        optionsQuery: "models.equipment.getBars",
        valueField: "_id",
        labelField: "model",
      },
      boardId: {
        type: "select",
        label: "Board",
        required: true,
        optionsQuery: "models.equipment.getBoards",
        valueField: "_id",
        labelField: "model",
      },
      date: {
        type: "date",
        label: "Date",
        required: true,
      },
      duration: {
        type: "number",
        label: "Duration (minutes)",
        required: true,
        min: 15,
      },
    },
    actions: {
      edit: {
        url: "/sessions",
      },
      delete: {
        url: "/sessions",
      }
    }
  },
};
