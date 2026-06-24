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
import { CATEGORIES, CATEGORY_LABELS } from "./constants";
import { ConfirmDeleteModal, EmptyState, DataTable, alert, TitleActions } from "@/components/block";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Coffee } from "lucide-react";
import type { MenuItem, MenuCategory } from "@/types";
import { getErrorMessage } from "@/utils/error";

export default function MenuItemsContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: menuListResponse, isLoading, error } = useGetMenuList();

  const createMenuMutation = useCreateMenu({
    onSuccess: (res) => {
      setDialogOpen(false);
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
      setDialogOpen(false);
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
      setDeleteConfirmId(null);
      alert.success({
        title: "Menu berhasil dihapus!",
        description: "Item telah dihapus dari daftar menu.",
      });
    },
    onError: (err) => {
      setDeleteConfirmId(null);
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
    setEditingItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

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
    if (!deleteConfirmId) return;
    deleteMenuMutation.mutate({ path: { id: deleteConfirmId } });
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

  const items = menuListResponse?.data ?? [];
  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description?.toLowerCase() ?? "").includes(search.toLowerCase());
    const matchCat = activeCategory === "ALL" || item.category === activeCategory;
    return matchSearch && matchCat;
  });

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama menu atau deskripsi..."
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("ALL")}
              className="cursor-pointer"
            >
              Semua
            </Button>
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                variant={activeCategory === c ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(c)}
                className="cursor-pointer"
              >
                {CATEGORY_LABELS[c]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu List Table */}
      {!isLoading && filteredItems.length === 0 ? (
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
                onDelete: (id) => setDeleteConfirmId(id),
                onToggle: handleToggle,
              })}
              data={filteredItems}
              loading={isLoading}
              hidePagination
              className="shadow-none border-none bg-transparent rounded-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Dialog: Add / Edit Menu */}
      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        submitting={createMenuMutation.isPending || updateMenuMutation.isPending}
      />

      {/* Modal: Confirm Delete */}
      <ConfirmDeleteModal
        open={deleteConfirmId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
        loading={deleteMenuMutation.isPending}
        title="Hapus Menu Ini?"
        description="Item menu akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
