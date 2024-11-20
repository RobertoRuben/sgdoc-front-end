// src/utils/getBreadcrumb.ts

import { NavItem } from '../components/layout/SidebarConfig';

export const getBreadcrumb = (
    path: string,
    navItems: NavItem[]
): { name: string; path: string }[] => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumb: { name: string; path: string }[] = [];
    let accumulatedPath = '';

    for (const segment of segments) {
        accumulatedPath += `/${segment}`;
        let found = false;

        for (const item of navItems) {
            if (item.path === accumulatedPath) {
                breadcrumb.push({ name: item.name, path: item.path! });
                found = true;
                break;
            }
            if (item.subItems) {
                const subItem = item.subItems.find((sub) => sub.path === accumulatedPath);
                if (subItem) {
                    if (item.path) {
                        breadcrumb.push({ name: item.name, path: item.path });
                    }
                    breadcrumb.push({ name: subItem.name, path: subItem.path! });
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            // Manejar rutas que no coinciden con navItems
            breadcrumb.push({ name: segment, path: accumulatedPath });
        }
    }

    return breadcrumb;
};
