"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

import type { TableDialogProps } from "../types";
import { tableSchema, type TableFormValues } from "../schema";
import { DEFAULT_FORM } from "../constants";

export function TableDialog({
  open,
  onOpenChange,
  editingTable,
  onSubmit,
  submitting,
}: TableDialogProps) {
  const isEditing = editingTable !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: DEFAULT_FORM,
  });

  // Reset form when dialog opens or editingTable changes
  useEffect(() => {
    if (open) {
      reset({
        number: editingTable ? String(editingTable.number) : "",
        capacity: editingTable ? String(editingTable.capacity) : "",
      });
    }
  }, [open, editingTable, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Edit Detail Meja" : "Tambah Meja Baru"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Perbarui informasi nomor dan kapasitas meja."
              : "Masukkan nomor meja dan kapasitas meja untuk memperbarui sistem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          {/* Nomor Meja */}
          <div className="space-y-2">
            <Label htmlFor="table-number" className="text-sm font-medium">
              Nomor Meja <span className="text-destructive ml-0.5">*</span>
            </Label>
            <Input
              id="table-number"
              type="number"
              min={1}
              {...register("number")}
              placeholder="Misal: 1, 2, 3..."
              className="bg-background border-border"
            />
            {errors.number && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.number.message}</p>
            )}
          </div>

          {/* Kapasitas */}
          <div className="space-y-2">
            <Label htmlFor="table-capacity" className="text-sm font-medium">
              Kapasitas Meja <span className="text-destructive ml-0.5">*</span>{" "}
              <span className="text-muted-foreground font-normal">(orang)</span>
            </Label>
            <Input
              id="table-capacity"
              type="number"
              min={1}
              {...register("capacity")}
              placeholder="Misal: 2, 4, 6..."
              className="bg-background border-border"
            />
            {errors.capacity && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.capacity.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
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
                "Tambah Meja"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
