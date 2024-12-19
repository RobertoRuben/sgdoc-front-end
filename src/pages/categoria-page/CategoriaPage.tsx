import { useState, useMemo} from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Categoria } from "@/model/categoria";
import { CategoriaModal } from "@/components/modal/categoria-modal/CategoriaModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { CategoriaPaginatedResponse } from "@/model/categoriaPaginatedResponse";

const categoriasData: Categoria[] = [
  { id: 1, nombreCategoria: "Categoría 1" },
  { id: 2, nombreCategoria: "Categoría 2" },
  { id: 3, nombreCategoria: "Categoría 3" },
  { id: 4, nombreCategoria: "Categoría 4" },
  { id: 5, nombreCategoria: "Categoría 5" },
];

const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const CategoriaPage: React.FC = () => {
  const [categoriasState, setCategoriasState] = useState<CategoriaPaginatedResponse>({
    data: categoriasData,
    pagination: {
      currentPage: 1,
      pageSize: 4,
      totalItems: categoriasData.length,
      totalPages: Math.ceil(categoriasData.length / 4),
    },
  });
  const [, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | undefined>(
    undefined
  );
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const totalPages = categoriasState.pagination.totalPages;

  const filteredCategorias = useMemo(() => {
    return categoriasState.data.filter((categoria) =>
      categoria.nombreCategoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoriasState.data, searchTerm]);

  const currentCategorias = useMemo(() => {
    const startIndex =
      (categoriasState.pagination.currentPage - 1) *
      categoriasState.pagination.pageSize;
    return filteredCategorias.slice(
      startIndex,
      startIndex + categoriasState.pagination.pageSize
    );
  }, [categoriasState.pagination.currentPage, categoriasState.pagination.pageSize, filteredCategorias]);

  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const categoria = categoriasState.data.find((c) => c.id === id);
      if (categoria) {
        setSelectedCategoria(categoria);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const categoria = categoriasState.data.find((c) => c.id === id);
      if (categoria) {
        setSelectedCategoria(categoria);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCategoria) {
      const updatedData = categoriasState.data.filter(
        (c) => c.id !== selectedCategoria.id
      );
      const totalItems = updatedData.length;
      const totalPages = Math.ceil(totalItems / categoriasState.pagination.pageSize);
      setCategoriasState({
        data: updatedData,
        pagination: {
          ...categoriasState.pagination,
          totalItems,
          totalPages,
          currentPage:
            categoriasState.pagination.currentPage > totalPages
              ? totalPages
              : categoriasState.pagination.currentPage,
        },
      });
      setIsDeleteModalOpen(false);
      setSelectedCategoria(undefined);
      setDataVersion((prev) => prev + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCategoriasState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        currentPage: page,
      },
    }));
    setCurrentPage(page);
  };

  const handleModalSubmit = async (data: Categoria) => {
    if (data.id) {
      const updatedData = categoriasState.data.map((c) =>
        c.id === data.id ? data : c
      );
      setCategoriasState((prevState) => ({
        ...prevState,
        data: updatedData,
      }));
    } else {
      const newId =
        categoriasState.data.length > 0
          ? Math.max(...categoriasState.data.map((c) => c.id || 0)) + 1
          : 1;
      const newCategoria = { ...data, id: newId };
      const updatedData = [...categoriasState.data, newCategoria];
      const totalItems = updatedData.length;
      const totalPages = Math.ceil(totalItems / categoriasState.pagination.pageSize);
      setCategoriasState({
        data: updatedData,
        pagination: {
          ...categoriasState.pagination,
          totalItems,
          totalPages,
        },
      });
    }
    setIsModalOpen(false);
    setSelectedCategoria(undefined);
    setDataVersion((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setSelectedCategoria(undefined);
    setIsModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCategoriasState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        currentPage: 1,
      },
    }));
    setCurrentPage(1);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          Categorías
        </h2>
        <Button
          onClick={() => {
            setSelectedCategoria(undefined);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#03A64A] text-white rounded hover:bg-[#028a3b] transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Categoría
        </Button>
      </div>

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="relative mb-4 p-4 border-b border-gray-200">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Buscar categorías..."
            className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
            aria-label="Buscar categorías"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${categoriasState.pagination.currentPage}-${dataVersion}-${searchTerm}`}
              variants={tableVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Id
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre de la Categoría
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCategorias.map((categoria) => (
                    <TableRow
                      key={categoria.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        {categoria.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        {categoria.nombreCategoria}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap text-right">
                        <Button
                          onClick={() => handleEdit(categoria.id)}
                          className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(categoria.id)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={categoriasState.pagination.currentPage}
            totalPages={categoriasState.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <CategoriaModal
          isOpen={isModalOpen}
          categoria={selectedCategoria}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedCategoria?.nombreCategoria || ""}
        />
      )}
    </div>
  );
};

export default CategoriaPage;