// src/components/layout/ContentHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';

type ContentHeaderProps = {
    breadcrumb: { name: string; path: string }[];
};

const ContentHeader: React.FC<ContentHeaderProps> = ({ breadcrumb }) => {
    return (
        <div className="p-2 bg-transparent"> 
            <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
                <ol className="flex">
                    {breadcrumb.map((crumb, index) => (
                        <li key={crumb.path} className="flex items-center">
                            <Link to={crumb.path} className="text-[#04843c] hover:text-[#145A32] text-base">
                                {crumb.name}
                            </Link>
                            {index < breadcrumb.length - 1 && (
                                <span className="mx-2">/</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default ContentHeader;
