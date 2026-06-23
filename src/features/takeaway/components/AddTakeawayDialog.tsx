"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Minus, Trash, ShoppingBag, AlertCircle, Search } from "lucide-react";
import { useGetMenuList } from "@/api/domains/menu/query";
import { useCreateTakeaway } from "@/api/domains/takeaway/query";
import { getErrorMessage } from "@/utils/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessModal, ErrorModal } from "@/components/block";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { AddTakeawayItem, AddTakeawayDialogProps } from "../types";
import { takeawaySchema, type TakeawayFormValues } from "../schema";
import { DEFAULT_FORM } from "../constants";

export function AddTakeawayDialog({ open, onOpenChange, onSuccess }: AddTakeawayDialogProps) {
  const [items, setItems] = useState<AddTakeawayItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    description?: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TakeawayFormValues>({
    resolver: zodResolver(takeawaySchema),
    defaultValues: DEFAULT_FORM,
  });

  const resetForm = useCallback(() => {
    reset(DEFAULT_FORM);
    setItems([]);
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSubmitError(null);
  }, [reset]);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  useEffect(() => {
    setValue(
      "items",
      items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        notes: i.notes || undefined,
      })),
      { shouldValidate: true }
    );
  }, [items, setValue]);

  const { data: menuResponse, isLoading: loadingData } = useGetMenuList(undefined, {
    enabled: open,
  });

  const createTakeawayMutation = useCreateTakeaway({
    onSuccess: () => {
      setFeedback({
        open: true,
        variant: "success",
        title: "Pesanan Takeaway berhasil dibuat!",
        description: "Pelanggan dapat menunggu persiapan selesai.",
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (err) => {
      setSubmitError(getErrorMessage(err, "Gagal membuat pesanan takeaway."));
    },
  });

  const menuItems = (menuResponse?.data ?? []).filter((m) => m.isAvailable);

  const handleIncrement = (menuItemId: string) => {
    const existingIndex = items.findIndex((i) => i.menuItemId === menuItemId);
    if (existingIndex > -1) {
      const updated = [...items];
      const menuItem = menuItems.find((m) => m.id === menuItemId);
      if (
        menuItem &&
        menuItem.stock !== undefined &&
        updated[existingIndex].quantity >= menuItem.stock
      ) {
        return;
      }
      updated[existingIndex].quantity += 1;
      setItems(updated);
    } else {
      const menuItem = menuItems.find((m) => m.id === menuItemId);
      if (!menuItem) return;
      setItems([
        ...items,
        {
          menuItemId,
          name: menuItem.name,
          price: parseFloat(menuItem.price),
          quantity: 1,
          notes: "",
        },
      ]);
    }
  };

  const handleDecrement = (menuItemId: string) => {
    const existingIndex = items.findIndex((i) => i.menuItemId === menuItemId);
    if (existingIndex === -1) return;

    const updated = [...items];
    if (updated[existingIndex].quantity > 1) {
      updated[existingIndex].quantity -= 1;
      setItems(updated);
    } else {
      setItems(items.filter((i) => i.menuItemId !== menuItemId));
    }
  };

  const handleUpdateNotes = (menuItemId: string, notes: string) => {
    const existingIndex = items.findIndex((i) => i.menuItemId === menuItemId);
    if (existingIndex === -1) return;

    const updated = [...items];
    updated[existingIndex].notes = notes;
    setItems(updated);
  };

  const handleRemoveItem = (menuItemId: string) => {
    setItems(items.filter((i) => i.menuItemId !== menuItemId));
  };

  const onSubmit = (values: TakeawayFormValues) => {
    setSubmitError(null);
    createTakeawayMutation.mutate({
      body: {
        items: values.items,
        notes: values.notes,
      },
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const submitting = createTakeawayMutation.isPending;

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoriesList = [
    { value: "ALL", label: "Semua" },
    { value: "COFFEE", label: "Coffee" },
    { value: "NON_COFFEE", label: "Non-Coffee" },
    { value: "FOOD", label: "Makanan" },
    { value: "SNACK", label: "Snack" },
    { value: "OTHER", label: "Lainnya" },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border sm:max-w-[90vw] md:max-w-[850px] lg:max-w-[950px] max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col p-6">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="text-foreground flex items-center gap-2 text-xl font-bold">
              <ShoppingBag className="w-5 h-5 text-[#c8a96e]" /> Buat Pesanan Takeaway
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Input pesanan bawa pulang (takeaway) secara langsung dan kelola keranjang belanja.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden pt-4 flex flex-col"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full min-h-0">
              <div className="md:col-span-3 flex flex-col min-h-0 gap-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama hidangan menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background border-border"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat.value
                            ? "bg-[#c8a96e] text-black border-[#c8a96e]"
                            : "bg-accent/20 text-muted-foreground border-border hover:text-foreground hover:bg-accent/40"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[250px] md:min-h-0 pr-1 pb-4">
                  {loadingData ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                          key={`menu-skel-${idx}`}
                          className="p-3 rounded-xl border border-border bg-accent/5 h-28 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredMenuItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-muted-foreground text-center">
                      <ShoppingBag className="w-8 h-8 opacity-45 mb-2" />
                      <p className="text-sm font-semibold">Menu tidak ditemukan</p>
                      <p className="text-xs">
                        Coba kata kunci pencarian lain atau pilih kategori lain.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredMenuItems.map((item) => {
                        const cartItem = items.find((i) => i.menuItemId === item.id);
                        const qtyInCart = cartItem ? cartItem.quantity : 0;

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-3 bg-accent/5 ${
                              qtyInCart > 0
                                ? "border-[#c8a96e]/70 ring-1 ring-[#c8a96e]/30 bg-[#c8a96e]/5"
                                : "border-border hover:border-border/80 hover:bg-accent/10"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-1">
                                <p className="font-bold text-foreground text-xs sm:text-sm line-clamp-2 leading-snug">
                                  {item.name}
                                </p>
                                {item.stock !== undefined && (
                                  <span className="text-[9px] text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded-md">
                                    Stok: {item.stock}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-1 gap-2">
                              <p className="text-xs sm:text-sm font-extrabold text-[#c8a96e]">
                                Rp {parseFloat(item.price).toLocaleString("id-ID")}
                              </p>

                              {qtyInCart > 0 ? (
                                <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg p-0.5 shadow-sm">
                                  <button
                                    type="button"
                                    onClick={() => handleDecrement(item.id)}
                                    className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors cursor-pointer text-xs"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-bold text-foreground w-4 text-center">
                                    {qtyInCart}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleIncrement(item.id)}
                                    disabled={item.stock !== undefined && qtyInCart >= item.stock}
                                    className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors cursor-pointer text-xs disabled:opacity-50"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleIncrement(item.id)}
                                  disabled={item.stock !== undefined && item.stock <= 0}
                                  className="h-7 px-2.5 text-xs font-bold cursor-pointer hover:bg-[#c8a96e] hover:text-black hover:border-[#c8a96e] transition-all"
                                >
                                  <Plus className="w-3 h-3 mr-1" /> Tambah
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6 flex flex-col min-h-0 justify-between">
                <div className="flex flex-col min-h-0 flex-1 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2 shrink-0">
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#c8a96e]" /> Daftar Pesanan
                      <span className="bg-[#c8a96e]/10 text-[#c8a96e] text-xs font-extrabold px-2 py-0.5 rounded-full">
                        {items.reduce((sum, i) => sum + i.quantity, 0)}
                      </span>
                    </p>
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setItems([])}
                        className="text-xs text-destructive hover:underline cursor-pointer font-semibold"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-[150px] pr-1 space-y-2.5">
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-xl text-muted-foreground text-center space-y-2">
                        <ShoppingBag className="w-8 h-8 opacity-30" />
                        <p className="text-xs font-semibold">Pesanan masih kosong</p>
                        <p className="text-[10px] max-w-[180px] leading-relaxed">
                          Pilih item menu di sebelah kiri untuk menambahkannya ke keranjang.
                        </p>
                      </div>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.menuItemId}
                          className="p-3 bg-accent/10 border border-border/60 rounded-xl space-y-2.5"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-foreground text-xs leading-snug break-words">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-[#c8a96e] font-semibold mt-0.5">
                                Rp {item.price.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground whitespace-nowrap">
                                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.menuItemId)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1.5 border-t border-border/30">
                            <div className="flex items-center gap-1.5 bg-background border border-border/60 rounded-md p-0.5 shadow-sm">
                              <button
                                type="button"
                                onClick={() => handleDecrement(item.menuItemId)}
                                className="w-5.5 h-5.5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors cursor-pointer text-xs"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold text-foreground w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleIncrement(item.menuItemId)}
                                className="w-5.5 h-5.5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors cursor-pointer text-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <Input
                              placeholder="Catatan (es dikit, less sugar...)"
                              value={item.notes}
                              onChange={(e) => handleUpdateNotes(item.menuItemId, e.target.value)}
                              className="h-6 text-[10px] bg-background border-border/60 px-2 flex-1"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4 space-y-4 shrink-0 bg-card">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="order-notes"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      Catatan Umum Pesanan <span className="font-normal">(opsional)</span>
                    </Label>
                    <Input
                      id="order-notes"
                      placeholder="Catatan untuk seluruh pesanan..."
                      {...register("notes")}
                      className="bg-background border-border h-8 text-xs"
                    />
                  </div>

                  <div className="p-3 bg-accent/20 rounded-xl space-y-2 border border-border">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Subtotal</span>
                      <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center font-extrabold text-sm border-t border-border/40 pt-2 text-foreground">
                      <span>Total Akhir</span>
                      <span className="text-[#c8a96e]">
                        Rp {totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {errors.items && (
                    <p className="text-xs text-destructive font-medium">{errors.items.message}</p>
                  )}

                  {submitError && (
                    <div className="p-2.5 text-[11px] rounded-lg bg-destructive/15 text-destructive font-medium border border-destructive/25 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-2 pb-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={submitting}
                      className="flex-1 cursor-pointer text-xs"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || items.length === 0}
                      className="flex-1 min-w-[120px] cursor-pointer text-xs font-bold"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Buat Pesanan"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SuccessModal
        open={feedback.open && feedback.variant === "success"}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        title={feedback.title}
        description={feedback.description}
      />
      <ErrorModal
        open={feedback.open && feedback.variant === "error"}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        title={feedback.title}
        description={feedback.description}
      />
    </>
  );
}
