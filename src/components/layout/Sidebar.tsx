import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { navItems, NavItem } from './SidebarConfig';
import logo from '../../assets/mda-logo.png';

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    unconfirmedCount?: number;
};

export function Sidebar({ isOpen, onClose, unconfirmedCount = 0 }: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
    const userRole = sessionStorage.getItem('rolName') || '';

    const toggleMenu = (name: string) => {
        setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const filteredNavItems = navItems.filter((item) => {
        const hasParentAccess = !item.allowedRoles || item.allowedRoles.includes(userRole);
        const hasAccessibleSubItems = item.subItems 
            ? item.subItems.some(sub => !sub.allowedRoles || sub.allowedRoles.includes(userRole))
            : true;

        return hasParentAccess && hasAccessibleSubItems;
    });

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                ></div>
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#03A64A] to-black text-white p-4 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-auto flex-shrink-0 flex flex-col h-full`}
                aria-label="Sidebar de navegación"
            >
                <div className="flex justify-between items-center mb-8">
                    <div className="flex justify-center items-center w-full">
                        <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden"
                        aria-label="Cerrar menú"
                    >
                        <X className="h-6 w-6" strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    <nav>
                        <ul className="space-y-2">
                            {filteredNavItems.map((item: NavItem, index: number) => {
                                const filteredSubItems = item.subItems?.filter(subItem => 
                                    !subItem.allowedRoles || subItem.allowedRoles.includes(userRole)
                                );

                                return (
                                    <li key={index}>
                                        {item.subItems ? (
                                            <div>
                                                <button
                                                    onClick={() => toggleMenu(item.name)}
                                                    className="flex items-center justify-between w-full p-2 hover:bg-[#028a3b] rounded focus:outline-none font-semibold"
                                                    aria-expanded={openMenus[item.name] || false}
                                                    disabled={filteredSubItems?.length === 0}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <item.icon className="w-5 h-5" strokeWidth={3} />
                                                        <span>{item.name}</span>
                                                        {item.name === "Inbox" && unconfirmedCount > 0 && (
                                                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                                                {unconfirmedCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {filteredSubItems && filteredSubItems.length > 0 && (
                                                        openMenus[item.name] ? 
                                                        <ChevronDown className="h-4 w-4" /> : 
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </button>

                                                <ul
                                                    className={`ml-4 mt-2 space-y-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                                                        openMenus[item.name]
                                                            ? 'max-h-[9999px] opacity-100'
                                                            : 'max-h-0 opacity-0'
                                                    }`}
                                                >
                                                    {filteredSubItems?.map((subItem, subIndex) => (
                                                        <li key={subIndex}>
                                                            <Link
                                                                to={subItem.path}
                                                                className="flex justify-between items-center p-2 hover:bg-[#028a3b] rounded"
                                                                onClick={onClose}
                                                            >
                                                                <span>{subItem.name}</span>
                                                                {subItem.name === "Recibidos" && unconfirmedCount > 0 && (
                                                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                                                        {unconfirmedCount}
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.path || '#'}
                                                className="flex items-center p-2 hover:bg-[#028a3b] rounded font-semibold relative"
                                                onClick={onClose}
                                            >
                                                <item.icon className="w-5 h-5 mr-2" strokeWidth={3} />
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}