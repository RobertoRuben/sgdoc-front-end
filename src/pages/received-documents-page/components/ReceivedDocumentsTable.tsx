"use client";

import React, { useState } from "react";
import { AsuntoModal } from "@/components/modal/documento-modal/asunto-documento-modal/AsuntoModal";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Send, XCircle, Check } from "lucide-react"; // Agrega el icono que gustes
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentoReceivedDetails } from "@/model/documentoReceived";

const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const rowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

interface ListaDocumentosRecibidosTableProps {
  currentDocumentos: DocumentoReceivedDetails[];
  onDownload: (id?: number) => void;
  onSend: (id?: number) => void;
  onVerDetalle: (derivacionId?: number) => void;
  onReject: (id?: number) => void;
  onConfirmarRecepcion: (id?: number) => void; // <-- Nueva prop
  showEmpty: boolean;
}

export const ListaDocumentosRecibidosTable: React.FC<
  ListaDocumentosRecibidosTableProps
> = ({
  currentDocumentos,
  onDownload,
  onSend,
  onVerDetalle,
  onReject,
  onConfirmarRecepcion,
  showEmpty,
}) => {
  const [isAsuntoModalOpen, setIsAsuntoModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState<
    DocumentoReceivedDetails | undefined
  >();

  if (currentDocumentos.length === 0 && showEmpty) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No se encontraron documentos</p>
      </div>
    );
  }

  if (currentDocumentos.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDocumentos.length}
          variants={tableVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow className="bg-[#145A32] border-b border-[#0E3D22] hover:bg-[#0E3D22]">
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  N° de Registro
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  N° de Derivacion
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Documento
                </TableHead>
                <TableHead className="hidden sm:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Área Origen
                </TableHead>
                <TableHead className="hidden lg:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Enviado Por
                </TableHead>
                <TableHead className="hidden md:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Fecha Envio
                </TableHead>
                <TableHead className="hidden lg:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Ámbito
                </TableHead>
                <TableHead className="hidden xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Centro Poblado
                </TableHead>
                <TableHead className="hidden 2xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Caserío
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Asunto
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Detalle
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentDocumentos.map((documento, index) => (
                <motion.tr
                  key={documento.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                >
                  <TableCell className="px-4 py-4 text-sm font-medium text-gray-900">
                    {String(documento.id).padStart(5, "0")}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-medium text-gray-900">
                    {String(documento.derivacionId).padStart(5, "0")}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-700">
                    {documento.nombreDocumento}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreAreaOrigen}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.derivadoPor}
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-4 py-4 text-sm text-gray-700">
                    {new Date(documento.fechaEnvio).toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreAmbito}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreCentroPoblado}
                  </TableCell>
                  <TableCell className="hidden 2xl:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreCaserio}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-700 text-center">
                    <Button
                      variant="link"
                      className="text-[#145A32] hover:text-[#0E3D22] p-0 h-auto font-normal"
                      onClick={() => {
                        setSelectedDocumento(documento);
                        setIsAsuntoModalOpen(true);
                      }}
                    >
                      Ver
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-700 text-center">
                    <Button
                      variant="link"
                      className="text-[#145A32] hover:text-[#0E3D22] p-0 h-auto font-normal"
                      onClick={() => onVerDetalle(documento.derivacionId)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 justify-end">
                      {/* Confirmar Recepción */}
                      <Button
                        onClick={() =>
                          onConfirmarRecepcion(documento.derivacionId)
                        }
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Check className="w-5 h-5" />
                      </Button>

                      {/* Rechazar */}
                      <Button
                        onClick={() => onReject(documento.derivacionId)}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>

                      {/* Descargar */}
                      <Button
                        onClick={() => onDownload(documento.id)}
                        className="bg-[#1496cc] text-white hover:bg-[#0d7ba8]"
                      >
                        <Download className="w-5 h-5" />
                      </Button>

                      {/* Derivar */}
                      <Button
                        onClick={() => onSend(documento.id)}
                        className="bg-[#7db0aa] text-white hover:bg-[#5e8b86]"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {/* Modal para el Asunto */}
          <AsuntoModal
            isOpen={isAsuntoModalOpen}
            documento={selectedDocumento!}
            onClose={() => setIsAsuntoModalOpen(false)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
