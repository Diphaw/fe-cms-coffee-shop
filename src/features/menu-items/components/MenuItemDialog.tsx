"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, DEFAULT_FORM } from "../constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { MenuItemDialogProps } from "../types";
import { menuSchema, type MenuFormValues } from "../schema";

export function MenuItemDialog({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  submitting,
}: MenuItemDialogProps) {
  const isEditing = editingItem !== null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: DEFAULT_FORM,
  });

  // Reset form when dialog opens or editingItem changes
  useEffect(() => {
    if (open) {
      reset({
        name: editingItem ? editingItem.name : "",
        description: editingItem ? (editingItem.description ?? "") : "",
        price: editingItem ? String(editingItem.price) : "",
        category: editingItem ? editingItem.category : "",
        stock: editingItem ? String(editingItem.stock) : "",
        isAvailable: editingItem ? editingItem.isAvailable : true,
        imageUrl: editingItem ? (editingItem.imageUrl ?? "") : "",
      });
    }
  }, [open, editingItem, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Edit Detail Menu" : "Tambah Menu Hidangan"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Perbarui informasi menu yang sudah ada."
              : "Lengkapi detail data makanan/minuman untuk disimpan ke database."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Nama Menu */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="menu-name" className="text-sm font-medium">
                Nama Menu <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="menu-name"
                {...register("name")}
                placeholder="Misal: Avocado Latte, Croissant Cheese..."
                className="bg-background border-border"
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="menu-description" className="text-sm font-medium">
                Deskripsi Menu
              </Label>
              <Input
                id="menu-description"
                {...register("description")}
                placeholder="Ceritakan cita rasa menu..."
                className="bg-background border-border"
              />
              {errors.description && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <Label htmlFor="menu-price" className="text-sm font-medium">
                Harga (Rupiah) <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="menu-price"
                type="number"
                min={0}
                {...register("price")}
                placeholder="35000"
                className="bg-background border-border"
              />
              {errors.price && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.price.message}</p>
              )}
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label htmlFor="menu-category" className="text-sm font-medium">
                Kategori <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="menu-category" className="bg-background border-border">
                      <SelectValue placeholder="Pilih kategori..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CATEGORY_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Stok */}
            <div className="space-y-2">
              <Label htmlFor="menu-stock" className="text-sm font-medium">
                Stok Menu <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="menu-stock"
                type="number"
                min={0}
                {...register("stock")}
                className="bg-background border-border"
              />
              {errors.stock && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.stock.message}</p>
              )}
            </div>

            {/* URL Gambar */}
            <div className="space-y-2">
              <Label htmlFor="menu-image-url" className="text-sm font-medium">
                URL Gambar <span className="text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <Input
                id="menu-image-url"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className="bg-background border-border"
              />
              {errors.imageUrl && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Ketersediaan */}
            <div className="flex items-center gap-2 pt-2 col-span-2">
              <input
                id="menu-available"
                type="checkbox"
                {...register("isAvailable")}
                className="w-4 h-4 rounded border-border bg-background focus:ring-ring text-primary cursor-pointer"
              />
              <Label
                htmlFor="menu-available"
                className="text-sm font-medium cursor-pointer select-none text-foreground"
              >
                Menu ini tersedia untuk dipesan pelanggan
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting} className="min-w-[120px] cursor-pointer">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Menu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
