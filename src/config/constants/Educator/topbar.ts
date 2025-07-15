// Nav items for Educator Topbar

import { EducatorNavItem } from "../../../types/educator";

export const EDUCATOR_NAV_ITEMS: EducatorNavItem[] = [
    // {
    //     label: 'About us',
    //     to: ''
    // },D:\projects\britanica\public\pdfs\PBL Orientation Guide.pdf
    {
        label: 'Resources',
        dropdown: [
            { label: "PBL Orientation Guide", to: "/pdfs/PBL Orientation Guide.pdf", isExternal: true },
            { label: "Design Thinker’s Journal", to: "", isExternal: false }
        ]
    },
    {
        label: 'Support',
        dropdown: [
            {
                content: `Technical & Academic Support\nWe are committed to providing prompt and effective assistance. If you're experiencing technical issues or product-related queries, please reach out to our support team.\nEmail: contact@britannica.in\nPhone: ‪+91 8448-569920‬\nAvailability: Official working hours from 9:00 AM to 6:00 PM (Monday to Friday)`
            }
        ]
    }
];