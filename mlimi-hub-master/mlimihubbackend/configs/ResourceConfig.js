exports.Resources = [
  {
    "name": "users",
    "icon": "fa fa-user",
    "schema": [
      {
        "name": "fullname",
        "title": "Full Name",
        "type": "text",
        "required": true
      },
      {
        "name": "email",
        "title": "Email",
        "type": "email",
        "required": true
      },
      {
        "name": "password",
        "title": "Password",
        "type": "password",
        "required": true
      },
      {
        "name": "dateOfBirth",
        "title": "Date Of Birth",
        "type": "date"
      },
      {
        "name": "role",
        "title": "User Role",
        "type": "ref",
        "resource": "roles",
        "field": "roleName",
      }
    ]
  },
  {
    "name": "farmers",
    "icon": "fa fa-user",
    "label": "farmers",
    "menuGroup": "Management",
    "menuGroupIcon": "fa fa-cog",
    "schema": [
      {
        "name": "fullname",
        "title": "Full Name",
        "type": "text",
        "required": true
      },
      {
        "name": "email",
        "title": "Email",
        "type": "email",
        "required": true
      },
      {
        "name": "password",
        "title": "Password",
        "type": "password",
        "required": true
      },
      {
        "name": "dateOfBirth",
        "title": "Date Of Birth",
        "type": "date"
      },
    ]
  },
  {
    "name": "products",
    "icon": "fa fa-shopping-bag",
    "schema": [
      {
        "name": "image",
        "title": "Image",
        "type": "image"
      },
      {
        "name": "title",
        "title": "Title",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      },
      {
        "name": "price",
        "title": "Price",
        "type": "number",
        "required": true
      },
      {
        "name": "category",
        "title": "Category",
        "type": "ref",
        "resource": "product-categories",
        "field": "categoryName"
      },
      {
        "name": "merchant",
        "title": "Merchant",
        "type": "ref",
        "resource": "merchants",
        "field": "merchantName"
      }
    ]
  },

  {
    "name": "product-categories",
    "icon": "fa fa-tag",
    "schema": [
      {
        "name": "icon",
        "title": "Icon",
        "type": "image",
        "required": false
      },
      {
        "name": "categoryName",
        "title": "Category Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ]
  },
  {
    "name": "merchants",
    "icon": "fa fa-store",
    "schema": [
      {
        "name": "logo",
        "title": "Merchant Logo",
        "type": "image",
        "required": false
      },
      {
        "name": "merchantName",
        "title": "Merchant Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ]
  },
  {
    "name": "payments",
    "icon": "fa fa-credit-card",
    "label": "Payments",
    "menuGroup": "Ecommerce",
    "menuGroupIcon": "fa fa-shopping-cart",
    "schema": [
      {
        "name": "farmer",
        "title": "Farmer",
        "type": "ref",
        "resource": "farmers",
        "field": "fullname",
      },
      {
        "name": "product",
        "title": "Product",
        "type": "ref",
        "resource": "products",
        "field": "title",
      },
      {
        "name": "amount",
        "title": "Amount Paid",
        "type": "number",
        "required": true
      },
      {
        "name": "status",
        "title": "Payment Status",
        "type": "ref",
        "resource": "payment_statuses",
        "field": "status",
      },
    ],
    "renderMode": "crud",
    "actions": [

      { "view": "goToView" },
      { "edit": "goToEdit" },
      { "delete": "deleteResource" }
    ]
  },
  {
    "name": "payment-statuses",
    "icon": "fa fa-info-circle",
    "label": "Payment Statuses",
    "menuGroup": "Ecommerce",
    "menuGroupIcon": "fa fa-shopping-cart",
    "schema": [
      {
        "name": "icon",
        "title": "Icon",
        "type": "image",
        "required": true
      },
      {
        "name": "status",
        "title": "Status",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ],
  },
  {
    "name": "courses",
    "icon": "fa fa-book",
    "schema": [
      {
        "name": "thumbnail",
        "title": "Thumbnail",
        "type": "image",
        "required": false
      },
      {
        "name": "title",
        "title": "Title",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": false
      },
      {
        "name": "category",
        "title": "Category",
        "type": "ref",
        "resource": "course-categories",
        "field": "categoryName"
      },
      {
        "name": "lessons",
        "title": "Lessons",
        "type": "ref-array",
        "resource": "lessons",
        "field": "name"
      },
      {
        "name": "quizzes",
        "title": "Quizzes",
        "type": "ref-array",
        "resource": "quizzes",
        "field": "quizName"
      }
    ]
  },
  {
    "name": "discussion-categories",
    "icon": "fa fa-bookmark",
    "schema": [
      {
        "name": "categoryName",
        "title": "Category Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ],
    "renderMode": "crud"
  },
  {
    "name": "discussions",
    "icon": "fa fa-bookmark",
    "schema": [
      {
        "name": "author",
        "title": "Author",
        "type": "ref",
        "resource": "farmers",
        "field": "fullname",

      },
      {
        "name": "category",
        "title": "Category ",
        "type": "ref",
        "resource": "discussion-categories",
        "field": "categoryName",
      },
      {
        "name": "image",
        "title": "Image",
        "type": "image",
      },
      {
        "name": "issue",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ],
    "renderMode": "crud"

  },
  {
    "name": "discussion-comments",
    "icon": "fa fa-message",
    "label": "comments",
    "menuGroup": "Forum",
    "menuGroupIcon": "fa fa-users",
    "schema": [
      {
        "name": "author",
        "title": "Author",
        "type": "ref",
        "resource": "farmers",
        "field": "fullname",

      },
      {
        "name": "discussion",
        "title": "Discussion",
        "type": "ref",
        "resource": "discussions",
        "field": "issue",

      },
      {
        "name": "comment",
        "title": "Comment",
        "type": "richtext",
        "required": true
      }
    ],
    "renderMode": "crud",
    "actions": [

      { "view": "goToView" },
      { "edit": "goToEdit" },
      { "delete": "deleteResource" }
    ]

  },
  {
    "name": "course-categories",
    "icon": "fa fa-bookmark",
    "schema": [
      {
        "name": "icon",
        "title": "Icon",
        "type": "image",
        "required": false
      },
      {
        "name": "categoryName",
        "title": "Category Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ]
  },
  {
    "name": "lessons",
    "icon": "fa fa-chalkboard-teacher",
    "schema": [
      {
        "name": "name",
        "title": "Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": false
      },
      {
        "name": "content",
        "title": "Content",
        "type": "video",
        "required": false
      },
      {
        "name": "course",
        "title": "Course",
        "type": "ref",
        "resource": "courses",
        "field": "title",
        "required": true
      }
    ]
  },
  {
    "name": "quizzes",
    "icon": "fa fa-question",
    "schema": [
      {
        "name": "quizName",
        "title": "Quiz Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": false
      },
      {
        "name": "lesson",
        "title": "Lesson",
        "type": "ref",
        "resource": "lessons",
        "field": "name",
        "required": true
      }
    ]
  },
  {
    "name": "questions",
    "icon": "fa fa-question-circle",
    "schema": [
      {
        "name": "caption",
        "title": "Caption",
        "type": "richtext",
        "required": false
      },
      {
        "name": "options",
        "title": "Options",
        "type": "tags",
        "required": false
      },
      {
        "name": "correctAnswer",
        "title": "Correct Answer",
        "type": "text",
        "required": false
      },
      {
        "name": "quiz",
        "title": "Quiz",
        "type": "ref",
        "resource": "quizzes",
        "field": "quizName",
        "required": false
      },
    ]
  },
  {
    "name": "roles",
    "icon": "fa fa-bookmark",
    "schema": [

      {
        "name": "roleName",
        "title": "Role Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ]
  },
  {
    "name": "permissions",
    "icon": "fa fa-user-lock",
    "label": "Permissions",
    "menuGroup": "Access Control",
    "menuGroupIcon": "fa fa-user-shield",
    "schema": [
      {
        "name": "role",
        "title": "Role",
        "type": "ref",
        "resource": "roles",
        "field": "roleName",
        "required": true
      },
      {
        "name": "module",
        "title": "Module",
        "type": "ref",
        "resource": "modules",
        "field": "moduleName",
        "required": true
      },
      {
        "name": "create",
        "title": "Create",
        "type": "check",
        "required": true
      },
      {
        "name": "read",
        "title": "Read",
        "type": "check",
        "required": true
      },
      {
        "name": "update",
        "title": "Update",
        "type": "check",
        "required": true
      },
      {
        "name": "delete",
        "title": "Delete",
        "type": "check",
        "required": true
      }
    ]
  },
  {
    "name": "modules",
    "icon": "fa fa-cubes",
    "label": "Modules",
    "menuGroup": "Access Control",
    "menuGroupIcon": "fa fa-user-shield",
    "schema": [

      {
        "name": "moduleName",
        "title": "Module Name",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      }
    ]
  },
  {
    "name": "reports",
    "icon": "fa fa-file-alt",
    "label": "Reports",
    "menuGroup": "Reporting",
    "menuGroupIcon": "fa fa-chart-bar",
    "schema": [
      {
        "name": "title",
        "title": "Report Title",
        "type": "text",
        "required": true
      },
      {
        "name": "description",
        "title": "Description",
        "type": "richtext",
        "required": true
      },
      {
        "name": "date",
        "title": "Report Date",
        "type": "date",
        "required": true
      },
      {
        "name": "category",
        "title": "Category",
        "type": "text",
        "required": true
      }
    ],
    "renderMode": "crud",
    "actions": [
      { "view": "goToView" },
      { "edit": "goToEdit" },
      { "delete": "deleteResource" }
    ]
  },
  {
    "name": "system-config",
    "icon": "fa fa-cog",
    "label": "System Configuration",
    "menuGroup": "Settings",
    "menuGroupIcon": "fa fa-wrench",
    "schema": [
      {
        "name": "appName",
        "title": "Application Name",
        "type": "text",
        "required": true
      },
      {
        "name": "appVersion",
        "title": "Application Version",
        "type": "text",
        "required": true
      },
      {
        "name": "companyName",
        "title": "Company Name",
        "type": "text",
        "required": true
      },
      {
        "name": "contactEmail",
        "title": "Contact Email",
        "type": "email",
        "required": true
      },
      {
        "name": "contactPhone",
        "title": "Contact Phone",
        "type": "text",
        "required": true
      },
      {
        "name": "logo",
        "title": "Logo",
        "type": "image",
        "required": true
      },
      {
        "name": "maintenanceMode",
        "title": "Maintenance Mode",
        "type": "check",
        "required": true
      },
      {
        "name": "maintenanceMessage",
        "title": "Maintenance Message",
        "type": "richtext",
        "required": true
      }
    ],
    "renderMode": "singleton"
  }

];
