"use client";

import { useState } from "react";
import {
  useGetMenuList,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
  useToggleMenu,
} from "@/api/domains/menu/query";
import { MenuItemDialog } from "./components/MenuItemDialog";
import { getColumns } from "./column";
import type { MenuFormValues } from "./schema";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  DEFAULT_PAGINATION,
  DEFAULT_FILTER,
  DEFAULT_MODAL_FORM,
  DEFAULT_MODAL_DELETE,
} from "./constants";
import { ConfirmDeleteModal, EmptyState, DataTable, alert, TitleActions } from "@/components/block";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Coffee } from "lucide-react";
import type { MenuItemData, MenuCategory } from "@/api/domains/menu/types";
import type { PaginationState, FilterState, ModalFormState, ModalDeleteState } from "./types";
import { getErrorMessage } from "@/utils/error";
import { useDebounce } from "@/hooks/use-debounce";

export default function MenuItemsContent() {
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [modalForm, setModalForm] = useState<ModalFormState>(DEFAULT_MODAL_FORM);
  const [modalDelete, setModalDelete] = useState<ModalDeleteState>(DEFAULT_MODAL_DELETE);

  const debouncedSearch = useDebounce(filter.search, 500);

  const {
    data: menuListResponse,
    isLoading,
    error,
  } = useGetMenuList({
    params: {
      page: pagination.page,
      limit: pagination.limit,
      search: debouncedSearch || undefined,
      category: filter.category === "ALL" ? undefined : filter.category,
    },
  });

  const createMenuMutation = useCreateMenu({
    onSuccess: (res) => {
      setModalForm(DEFAULT_MODAL_FORM);
      alert.success({
        title: "Menu berhasil ditambahkan!",
        description: `"${res.data.name}" siap ditampilkan di daftar menu.`,
      });
    },
    onError: (err) => {
      alert.error({
        title: "Gagal menyimpan menu",
        description: getErrorMessage(err, "Gagal menyimpan menu."),
      });
    },
  });

  const updateMenuMutation = useUpdateMenu({
    onSuccess: (res) => {
      setModalForm(DEFAULT_MODAL_FORM);
      alert.success({
        title: "Menu berhasil diperbarui!",
        description: `"${res.data.name}" telah disimpan ke database.`,
      });
    },
    onError: (err) => {
      alert.error({
        title: "Gagal memperbarui menu",
        description: getErrorMessage(err, "Gagal memperbarui menu."),
      });
    },
  });

  const deleteMenuMutation = useDeleteMenu({
    onSuccess: () => {
      setModalDelete(DEFAULT_MODAL_DELETE);
      alert.success({
        title: "Menu berhasil dihapus!",
        description: "Item telah dihapus dari daftar menu.",
      });
    },
    onError: (err) => {
      setModalDelete(DEFAULT_MODAL_DELETE);
      alert.error({
        title: "Gagal menghapus menu",
        description: getErrorMessage(err, "Gagal menghapus menu."),
      });
    },
  });

  const toggleMenuMutation = useToggleMenu({
    onError: (err) => {
      alert.error({
        title: "Gagal mengubah status",
        description: getErrorMessage(err, "Gagal mengganti status ketersediaan."),
      });
    },
  });

  const openAddDialog = () => {
    setModalForm({ open: true, type: "add", id: null });
  };

  const openEditDialog = (item: MenuItemData) => {
    setModalForm({ open: true, type: "edit", id: item.id });
  };

  const items = menuListResponse?.data ?? [];
  const total = menuListResponse?.meta?.total ?? 0;
  const editingItem = modalForm.id ? items.find((item) => item.id === modalForm.id) || null : null;

  const handleSubmit = (values: MenuFormValues) => {
    const price = parseFloat(values.price);
    const stock = parseInt(values.stock, 10);

    const dto = {
      name: values.name,
      description: values.description || undefined,
      price,
      category: values.category as MenuCategory,
      stock,
      isAvailable: values.isAvailable,
      imageUrl: values.imageUrl || undefined,
    };

    if (editingItem) {
      updateMenuMutation.mutate({ path: { id: editingItem.id }, body: dto });
    } else {
      createMenuMutation.mutate({ body: dto });
    }
  };

  const confirmDelete = () => {
    if (!modalDelete.id) return;
    deleteMenuMutation.mutate({ path: { id: modalDelete.id } });
  };

  const handleToggle = (id: string) => {
    toggleMenuMutation.mutate({ path: { id } });
  };

  if (error) {
    return (
      <EmptyState
        icon={Coffee}
        title="Gagal memuat daftar menu"
        subtitle="Terjadi kesalahan saat mengambil data. Coba muat ulang halaman."
      />
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <TitleActions
        title={
          <span className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-[#c8a96e]" /> Kelola Menu Cafe
          </span>
        }
        description="Tambah hidangan baru, atur ketersediaan menu, sesuaikan harga, deskripsi, dan pantau stok."
        actions={
          <Button onClick={openAddDialog} className="font-bold cursor-pointer">
            <Plus className="w-4 h-4 mr-2" /> Tambah Menu
          </Button>
        }
      />

      {/* Control Panel */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filter.search}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, search: e.target.value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder="Cari nama menu atau deskripsi..."
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter.category === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter((prev) => ({ ...prev, category: "ALL" }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="cursor-pointer"
            >
              Semua
            </Button>
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                variant={filter.category === c ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, category: c }));
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="cursor-pointer"
              >
                {CATEGORY_LABELS[c]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu List Table */}
      {!isLoading && items.length === 0 ? (
        <EmptyState
          icon={Coffee}
          title="Menu tidak ditemukan"
          subtitle="Coba cari dengan kata kunci lain atau tambahkan menu baru melalui tombol di bagian atas."
        />
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <DataTable
              columns={getColumns({
                onEdit: openEditDialog,
                onDelete: (id) => setModalDelete({ open: true, id }),
                onToggle: handleToggle,
              })}
              data={items}
              loading={isLoading}
              total={total}
              pagination={pagination}
              setPagination={setPagination}
              className="shadow-none border-none bg-transparent rounded-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Dialog: Add / Edit Menu */}
      <MenuItemDialog
        open={modalForm.open}
        onOpenChange={(open) => !open && setModalForm(DEFAULT_MODAL_FORM)}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        submitting={createMenuMutation.isPending || updateMenuMutation.isPending}
      />

      {/* Modal: Confirm Delete */}
      <ConfirmDeleteModal
        open={modalDelete.open}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete(DEFAULT_MODAL_DELETE)}
        loading={deleteMenuMutation.isPending}
        title="Hapus Menu Ini?"
        description="Item menu akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
