// Nav items for Educator Topbar

import { EducatorNavItem } from "../../../types/educator";


export const EDUCATOR_NAV_ITEMS: EducatorNavItem[] = [
    {
        label: 'About us',
        to: ''
    },
    {
        label: 'Resources',
        dropdown: [
            { label: "PBL Orientation Guide", to: "" },
            { label: "Design Thinkers' Journal", to: "" }
        ]
    },
    {
        label: 'Support',
        to: ''
    }
];
