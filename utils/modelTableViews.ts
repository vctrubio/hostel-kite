//key to module name, value to columns for tables
export const genericTableView = {
  students: {
    columns: {
      fullName: "string",
      age: "number",
      languages: "array",
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
