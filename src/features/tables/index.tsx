"use client";

import { useState } from "react";
import {
  useGetTableList,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from "@/api/domains/tables/query";
import { TableCard } from "./components/TableCard";
import { TableDialog } from "./components/TableDialog";
import { SuccessModal, ErrorModal, ConfirmDeleteModal, EmptyState } from "@/components/block";
import { Button } from "@/components/ui/button";
import { Plus, Table2 } from "lucide-react";
import type { Table } from "@/types";
import { getErrorMessage } from "@/utils/error";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { TableFormValues } from "./schema";

export default function TablesContent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  const { data: tableListResponse, isLoading, error } = useGetTableList();

  const createTableMutation = useCreateTable({
    onSuccess: (res) => {
      setDialogOpen(false);
      setFeedback({
        open: true,
        variant: "success",
        title: "Meja berhasil ditambahkan!",
        description: `Meja nomor ${res.data.number} siap digunakan.`,
      });
    },
    onError: (err) => {
      setFeedback({
        open: true,
        variant: "error",
        title: "Gagal menyimpan meja",
        description: getErrorMessage(err, "Gagal menyimpan meja."),
      });
    },
  });

  const updateTableMutation = useUpdateTable({
    onSuccess: (res) => {
      setDialogOpen(false);
      setFeedback({
        open: true,
        variant: "success",
        title: "Meja berhasil diperbarui!",
        description: `Meja nomor ${res.data.number} telah disimpan.`,
      });
    },
    onError: (err) => {
      setFeedback({
        open: true,
        variant: "error",
        title: "Gagal memperbarui meja",
        description: getErrorMessage(err, "Gagal memperbarui meja."),
      });
    },
  });

  const deleteTableMutation = useDeleteTable({
    onSuccess: () => {
      setDeleteConfirmId(null);
      setFeedback({
        open: true,
        variant: "success",
        title: "Meja berhasil dihapus!",
        description: "Data meja telah dihapus dari sistem.",
      });
    },
    onError: (err) => {
      setDeleteConfirmId(null);
      setFeedback({
        open: true,
        variant: "error",
        title: "Gagal menghapus meja",
        description: getErrorMessage(err, "Gagal menghapus meja."),
      });
    },
  });

  const openAddDialog = () => {
    setEditingTable(null);
    setDialogOpen(true);
  };

  const openEditDialog = (table: Table) => {
    setEditingTable(table);
    setDialogOpen(true);
  };

  const handleSubmit = (values: TableFormValues) => {
    const num = parseInt(values.number, 10);
    const cap = parseInt(values.capacity, 10);

    if (editingTable) {
      updateTableMutation.mutate({
        path: { id: editingTable.id },
        body: { number: num, capacity: cap },
      });
    } else {
      createTableMutation.mutate({ body: { number: num, capacity: cap } });
    }
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteTableMutation.mutate({ path: { id: deleteConfirmId } });
  };

  const handlePrint = (table: Table) => {
    const url = table.qrCode;
    if (!url) return;

    const win = window.open("", "_blank", "width=500,height=600");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Meja ${table.number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #ffffff;
              color: #000000;
              padding: 40px;
            }
            .card {
              border: 3px solid #000000;
              border-radius: 24px;
              padding: 40px 30px;
              text-align: center;
              max-width: 380px;
              width: 100%;
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .logo { font-size: 32px; margin-bottom: 12px; }
            h1 { font-size: 28px; font-weight: 900; color: #000000; margin-bottom: 8px; text-transform: uppercase; letter-spacing: -0.02em; }
            p { font-size: 14px; color: #4b5563; margin-bottom: 28px; line-height: 1.5; font-weight: 500; }
            .qr-container {
              display: inline-block;
              padding: 20px;
              border: 2px solid #e5e7eb;
              border-radius: 20px;
              background: #ffffff;
              margin-bottom: 28px;
            }
            small { font-size: 11px; color: #9ca3af; font-family: monospace; word-break: break-all; }
            @media print {
              body { padding: 0; }
              .card { box-shadow: none; border-color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">☕</div>
            <h1>Meja ${table.number}</h1>
            <p>Silakan pindai untuk melihat menu<br>dan langsung memesan dari meja Anda.</p>
            <div class="qr-container" id="qr"></div>
            <div>
              <small>${url}</small>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
          <script>
            QRCode.toCanvas(document.createElement('canvas'), '${url}', { width: 240, margin: 1 }, function(err, canvas) {
              if (!err) {
                document.getElementById('qr').appendChild(canvas);
              }
              setTimeout(() => {
                window.print();
              }, 400);
            });
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  if (error) {
    return (
      <EmptyState
        icon={Table2}
        title="Gagal memuat data meja"
        subtitle="Terjadi kesalahan saat mengambil data. Coba muat ulang halaman."
      />
    );
  }

  const tables = tableListResponse?.data ?? [];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Table2 className="w-8 h-8 text-[#c8a96e]" /> Kelola Meja Cafe
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Lihat, tambah, ubah detail meja, serta cetak QR Code unik untuk setiap meja pelanggan.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="font-bold cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Meja
        </Button>
      </div>

      {/* Grid Meja */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={`table-skeleton-${idx}`}
              className="border-border bg-card overflow-hidden shadow-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                <Skeleton className="size-[150px] rounded-xl animate-pulse bg-accent" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tables.length === 0 ? (
        <EmptyState
          icon={Table2}
          title="Belum ada meja cafe"
          subtitle="Tambahkan meja baru melalui tombol di bagian kanan atas halaman."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onEdit={openEditDialog}
              onDelete={(id) => setDeleteConfirmId(id)}
              onPrint={handlePrint}
            />
          ))}
        </div>
      )}

      {/* Dialog: Add / Edit Meja */}
      <TableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingTable={editingTable}
        onSubmit={handleSubmit}
        submitting={createTableMutation.isPending || updateTableMutation.isPending}
      />

      {/* Modal: Confirm Delete */}
      <ConfirmDeleteModal
        open={deleteConfirmId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
        loading={deleteTableMutation.isPending}
        title="Hapus Meja Ini?"
        description="Data meja beserta QR Code-nya akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
      />

      {/* Modal: Success / Error Feedback */}
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
    </div>
  );
}
