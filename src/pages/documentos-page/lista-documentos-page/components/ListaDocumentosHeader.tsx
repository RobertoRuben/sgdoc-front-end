import React from "react";

interface ListaDocumentosHeaderProps {
  title: string;
}

export const ListaDocumentosHeader: React.FC<ListaDocumentosHeaderProps> = ({
  title,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
        {title}
      </h2>
    </div>
  );
};
