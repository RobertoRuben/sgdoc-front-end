import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Pencil, Trash2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Pagination } from "@/components/ui/pagination";
import { ActualizacionDocumentoModal } from "@/components/modal/documento-modal/actualizacion-documento-modal/ActualizacionDocumentoModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { DocumentoDetails } from "@/model/documentoDetails";
import { PaginatedDocumentoResponse } from "@/model/paginatedDocumentoResponse";
import { DocumentoRequest } from "@/model/documento";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const initialDocumentos: PaginatedDocumentoResponse = {
  data: [
    {
      id: 1,
      dniRemitente: 12345678,
      fechaIngreso: new Date("2023-08-01"),
      nombreAmbito: "Ámbito 1",
      nombreCaserio: "Caserío 1",
      nombreCategoria: "Categoría 1",
      nombreDocumento: "Documento 1",
      nombreCentroPoblado: "Centro Poblado 1",
    },
    {
      id: 2,
      dniRemitente: 87654321,
      fechaIngreso: new Date("2023-08-02"),
      nombreAmbito: "Ámbito 2",
      nombreCaserio: "Caserío 2",
      nombreCategoria: "Categoría 2",
      nombreDocumento: "Documento 2",
      nombreCentroPoblado: "Centro Poblado 2",
    },
  ],
  pagination: {
    currentPage: 1,
    pageSize: 4,
    totalItems: 2,
    totalPages: 1,
  },
};

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

const ListaDocumentosPage: React.FC = () => {
  const [documentosState, setDocumentos] =
    useState<PaginatedDocumentoResponse>(initialDocumentos);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDocumento, setSelectedDocumento] = useState<
    DocumentoDetails | undefined
  >(undefined);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtros adicionales
  const [selectedCaserio, setSelectedCaserio] = useState<string | undefined>(
    undefined
  );
  const [selectedCentroPoblado, setSelectedCentroPoblado] = useState<
    string | undefined
  >(undefined);
  const [selectedAmbito, setSelectedAmbito] = useState<string | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const totalPages = documentosState.pagination.totalPages;

  const filteredDocumentos = useMemo(() => {
    return documentosState.data.filter((documento) => {
      const matchesSearch = documento.nombreDocumento
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const caserioFilter =
        !selectedCaserio || selectedCaserio === "all"
          ? true
          : documento.nombreCaserio === selectedCaserio;

      const centroPobladoFilter =
        !selectedCentroPoblado || selectedCentroPoblado === "all"
          ? true
          : documento.nombreCentroPoblado === selectedCentroPoblado;

      const ambitoFilter =
        !selectedAmbito || selectedAmbito === "all"
          ? true
          : documento.nombreAmbito === selectedAmbito;

      const dateFilter = !selectedDate
        ? true
        : new Date(documento.fechaIngreso).toDateString() ===
          selectedDate.toDateString();

      return (
        matchesSearch &&
        caserioFilter &&
        centroPobladoFilter &&
        ambitoFilter &&
        dateFilter
      );
    });
  }, [
    documentosState.data,
    searchTerm,
    selectedCaserio,
    selectedCentroPoblado,
    selectedAmbito,
    selectedDate,
  ]);

  const currentDocumentos = useMemo(() => {
    const startIndex = (currentPage - 1) * documentosState.pagination.pageSize;
    return filteredDocumentos.slice(
      startIndex,
      startIndex + documentosState.pagination.pageSize
    );
  }, [
    currentPage,
    dataVersion,
    filteredDocumentos,
    documentosState.pagination.pageSize,
  ]);

  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const documento = documentosState.data.find((d) => d.id === id);
      if (documento) {
        setSelectedDocumento(documento);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const documento = documentosState.data.find((d) => d.id === id);
      if (documento) {
        setSelectedDocumento(documento);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDownload = (id?: number) => {
    if (id !== undefined) {
      console.log(`Descargando documento ${id}`);
      // Implementar lógica de descarga
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedDocumento) {
      setDocumentos((prevState) => ({
        ...prevState,
        data: prevState.data.filter((d) => d.id !== selectedDocumento.id),
        pagination: {
          ...prevState.pagination,
          totalItems: prevState.pagination.totalItems - 1,
          totalPages: Math.ceil(
            (prevState.pagination.totalItems - 1) /
              prevState.pagination.pageSize
          ),
        },
      }));
      setIsDeleteModalOpen(false);
      setSelectedDocumento(undefined);
      setDataVersion((prev) => prev + 1);

      if (currentDocumentos.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleUpdateDocumento = async (data: DocumentoRequest) => {
    setDocumentos((prevState) => ({
      ...prevState,
      data: prevState.data.map((doc) =>
        doc.id === data.id ? { ...doc, ...data } : doc
      ),
    }));
    setIsModalOpen(false);
    setSelectedDocumento(undefined);
    setDataVersion((prev) => prev + 1);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          Documentos Ingresados
        </h2>
      </div>

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Filtros y búsqueda */}
        <div className="mb-4 p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          {/* Campo de búsqueda */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              id="search"
              placeholder="Buscar documentos..."
              className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
              aria-label="Buscar documentos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Select de Caserío */}
          <Select
            onValueChange={(val) =>
              setSelectedCaserio(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Caserío" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Caserío 1">Caserío 1</SelectItem>
              <SelectItem value="Caserío 2">Caserío 2</SelectItem>
            </SelectContent>
          </Select>

          {/* Select de Centro Poblado */}
          <Select
            onValueChange={(val) =>
              setSelectedCentroPoblado(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Centro Poblado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Centro Poblado 1">Centro Poblado 1</SelectItem>
              <SelectItem value="Centro Poblado 2">Centro Poblado 2</SelectItem>
            </SelectContent>
          </Select>

          {/* Select de Ámbito */}
          <Select
            onValueChange={(val) =>
              setSelectedAmbito(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ámbito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ámbito 1">Ámbito 1</SelectItem>
              <SelectItem value="Ámbito 2">Ámbito 2</SelectItem>
            </SelectContent>
          </Select>

          {/* Selección de Fecha */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] justify-start text-left font-normal"
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "Seleccionar Fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPage}-${dataVersion}`}
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
                      ID
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Documento
                    </TableHead>
                    <TableHead className="hidden sm:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      DNI Remitente
                    </TableHead>
                    <TableHead className="hidden md:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Fecha de Ingreso
                    </TableHead>
                    <TableHead className="hidden lg:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Ámbito
                    </TableHead>
                    <TableHead className="hidden xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Categoría
                    </TableHead>
                    <TableHead className="hidden xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Centro Poblado
                    </TableHead>
                    <TableHead className="hidden 2xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Caserío
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
                      } hover:bg-gray-100`}
                    >
                      <TableCell className="px-4 py-3 text-sm text-gray-800">
                        {documento.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-800">
                        {documento.nombreDocumento}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.dniRemitente}
                      </TableCell>
                      <TableCell className="hidden md:table-cell px-4 py-3 text-sm text-gray-800">
                        {new Date(documento.fechaIngreso).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreAmbito}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreCategoria}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreCentroPoblado}
                      </TableCell>
                      <TableCell className="hidden 2xl:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreCaserio}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleEdit(documento.id)}
                            className="bg-amber-500 text-white hover:bg-amber-600"
                          >
                            <Pencil className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(documento.id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() => handleDownload(documento.id)}
                            className="bg-[#1496cc] text-white hover:bg-[#0d7ba8]"
                          >
                            <Download className="w-5 h-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && selectedDocumento && (
        <ActualizacionDocumentoModal
          isOpen={isModalOpen}
          documento={{
            id: selectedDocumento.id,
            documentoBytes: new File([], "empty.pdf"),
            nombre: selectedDocumento.nombreDocumento,
            folios: 0,
            asunto: "",
            ambitoId: 0,
            categoriaId: 0,
            centroPobladoId: 0,
            caserioId: 0,
          }}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdateDocumento}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedDocumento?.nombreDocumento || ""}
        />
      )}
    </div>
  );
};

export default ListaDocumentosPage;
