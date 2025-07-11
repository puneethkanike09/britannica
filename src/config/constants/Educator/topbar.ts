// Nav items for Educator Topbar

import { EducatorNavItem } from "../../../types/educator";

export const EDUCATOR_NAV_ITEMS: EducatorNavItem[] = [
    // {
    //     label: 'About us',
    //     to: ''
    // },
    {
        label: 'Resources',
        dropdown: [
            { label: "PBL Orientation Guide", to: "/pdfs/PBL Orientation Guide.pdf", isExternal: true },
            { label: "Design Thinkers' Journal", to: "", isExternal: false }
        ]
    },
    {
        label: 'Support',
        to: ''
    }
];