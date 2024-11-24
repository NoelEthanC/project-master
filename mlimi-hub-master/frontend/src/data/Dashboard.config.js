
export const dashboardconfig = {
    title: 'Dashboard',
    metrics: [
        {
            title: "Farmers",
            value: "farmers/count",
            colorClass: "text-secondary-700",
            iconClass: "fas fa-tractor",
            redirectPath: "/dashboard/admin/farmers?page=1&limit=5&search=&sortBy=&order=asc",
        },
        {
            title: "Staff",
            value: "users/count",
            colorClass: "text-secondary-700",
            iconClass: "fas fa-users",
            redirectPath: "/dashboard/admin/users?page=1&limit=5&search=&sortBy=&order=asc",
        },
        {
            title: "Products",
            value: "products/count",
            colorClass: "text-secondary-700",
            iconClass: "fas fa-shopping-cart",
            redirectPath: "/dashboard/admin/products?page=1&limit=5&search=&sortBy=&order=asc",
        },
        {
            title: "Courses",
            value: "courses/count",
            colorClass: "text-secondary-700",
            iconClass: "fas fa-graduation-cap",
            redirectPath: "/dashboard/admin/courses?page=1&limit=5&search=&sortBy=&order=asc",
        },
        {
            title: "Discussions",
            value: "discussions/count",
            colorClass: "text-secondary-700",
            iconClass: "fas fa-message",
            redirectPath: "/dashboard/admin/discussions?page=1&limit=5&search=&sortBy=&order=asc",
        },
    ],
    widgets: [
        {
            type: "tableview",
            resource: {
                name: "payments",
                icon: "fa fa-credit-card",
                label: "Payments",
                menuGroup: "Ecommerce",
                menuGroupIcon: "fa fa-shopping-cart",
                schema: [
                    {
                        name: "farmer",
                        title: "Farmer",
                        type: "ref",
                        resource: "farmers",
                        field: "fullname",
                    },
                    {
                        name: "product",
                        title: "Product",
                        type: "ref",
                        resource: "products",
                        field: "title",
                    },
                    {
                        name: "amount",
                        title: "Amount Paid (MWK)",
                        type: "number",
                        required: true,
                    },
                    {
                        name: "status",
                        title: "Payment Status",
                        type: "ref",
                        resource: "payment-statuses",
                        field: "status",
                    },
                ],
            },
            title: "Recent Transactions",

        },
        {
            type: "column",
            title: "Profit and Loss",
            data: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                series: [
                    {
                        name: "Profit",
                        data: [25000, 30000, 35000, 32000, 40000, 45000],
                        color: "#34c759",
                    },
                    {
                        name: "Loss",
                        data: [10000, 12000, 15000, 14000, 16000, 18000],
                        color: "#ff3b30",
                    },
                ],
            },
        },

        {
            type: "pie",
            title: "Product Sales",
            data: {
                series: [
                    {
                        name: "Sales",
                        data: [
                            { name: "Product A", y: 300 },
                            { name: "Product B", y: 500 },
                            { name: "Product C", y: 100 },
                            { name: "Product D", y: 200 },
                        ],
                    },
                ],
            },
        },
        {
            type: "tableview",
            resource: {
                name: "farmers",
                icon: "fa fa-user",
                label: "farmers",
                menuGroup: "User Management",
                menuGroupIcon: "fa fa-user-shield",
                schema: [
                    {
                        name: "fullname",
                        title: "Full Name",
                        type: "text",
                        required: true
                    },
                    {
                        name: "email",
                        title: "Email",
                        type: "email",
                        required: true
                    },
                    {
                        name: "password",
                        title: "Password",
                        type: "password",
                        required: true
                    },
                    {
                        name: "dateOfBirth",
                        title: "Date Of Birth",
                        type: "date"
                    }
                ],
                renderMode: "crud"
            }
            ,
            title: "Recent Farmers",
        },
        {
            type: "line",
            title: "Sales Over Time",
            data: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                series: [
                    {
                        name: "Sales",
                        data: [50000, 60000, 70000, 65000, 75000, 80000],
                        color: "#36A2EB",
                    },
                ],
            },
        },
    ]
};