import type React from "react";
import { useRef, useEffect } from "react";
import type { DocumentoDetails } from "@/model/documentoDetails";
import { FileText, Folder, Tag, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AsuntoModalContentProps {
  documento?: DocumentoDetails;
}

export const AsuntoModalContent: React.FC<AsuntoModalContentProps> = ({
  documento,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        300
      )}px`;
    }
  }, [documento?.asunto]);

  if (!documento) return null;

  const headerItems = [
    {
      icon: Hash,
      label: "N° DE REGISTRO",
      value: String(documento.id).padStart(5, "0"),
    },
    { icon: Folder, label: "ÁMBITO", value: documento.nombreAmbito },
    { icon: Tag, label: "CATEGORÍA", value: documento.nombreCategoria },
  ];

  return (
    <ScrollArea className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto pr-4">
      <div className="space-y-8 max-w-screen-lg mx-auto pl-1 pr-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {headerItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <Label
                htmlFor={item.label.toLowerCase()}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600"
              >
                <item.icon
                  className="w-4 h-4 text-emerald-600"
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Label>
              <Input
                id={item.label.toLowerCase()}
                value={item.value}
                readOnly
                onFocus={(e) => e.target.blur()}
                tabIndex={-1}
                className="bg-gray-50 border-gray-200 focus:ring-0 focus:border-gray-200 text-sm focus:outline-none select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="asunto"
            className="flex items-center space-x-2 text-sm font-medium text-gray-600"
          >
            <FileText className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>ASUNTO</span>
          </Label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="asunto"
              value={documento.asunto}
              readOnly
              className="w-full p-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-0 focus:border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto"
              style={{
                minHeight: "64px",
                maxHeight: "300px",
                lineHeight: "1.6",
              }}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
