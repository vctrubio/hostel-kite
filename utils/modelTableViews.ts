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
};
