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
};
