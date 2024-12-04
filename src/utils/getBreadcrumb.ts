// src/utils/getBreadcrumb.ts
import { NavItem } from '../components/layout/SidebarConfig';

/**
 * Genera el breadcrumb basado en la ruta actual y la configuración de navegación.
 * @param path Ruta actual.
 * @param navItems Lista de elementos de navegación.
 * @returns Lista de objetos con nombre y ruta para el breadcrumb.
 */
export const getBreadcrumb = (
    path: string,
    navItems: NavItem[]
): { name: string; path: string }[] => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumb: { name: string; path: string }[] = [];
    let accumulatedPath = '';

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        accumulatedPath += `/${segment}`;
        let found = false;

        for (const item of navItems) {
            // Verificar si la ruta acumulada coincide con un navItem
            if (item.path === accumulatedPath) {
                const name = (i === segments.length - 1) ? formatName(segment) : item.name;
                breadcrumb.push({ name, path: item.path });
                found = true;
                break;
            }

            // Verificar en subItems si existen
            if (item.subItems) {
                const subItem = item.subItems.find(sub => sub.path === accumulatedPath);
                if (subItem) {
                    const name = (i === segments.length - 1) ? formatName(segment) : subItem.name;
                    breadcrumb.push({ name, path: subItem.path });
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            // Si no se encuentra en navItems ni en subItems, formatear el nombre
            breadcrumb.push({ name: formatName(segment), path: accumulatedPath });
        }
    }

    return breadcrumb;
};

/**
 * Formatea el nombre de un segmento reemplazando guiones por espacios y capitalizando cada palabra.
 * @param segment Segmento de la ruta.
 * @returns Nombre formateado.
 */
const formatName = (segment: string): string => {
    return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
