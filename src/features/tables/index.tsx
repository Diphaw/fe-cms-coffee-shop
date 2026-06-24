"use client";

import { useState } from "react";
import {
  useGetTableList,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from "@/api/domains/tables/query";
import { TableDialog } from "./components/TableDialog";
import { TableDetailDialog } from "./components/TableDetailDialog";
import { getColumns } from "./column";
import { ConfirmDeleteModal, EmptyState, DataTable, alert, TitleActions } from "@/components/block";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Table2, Loader2 } from "lucide-react";
import type { Table } from "@/types";
import { getErrorMessage } from "@/utils/error";

import type { TableFormValues } from "./schema";

export default function TablesContent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [detailTable, setDetailTable] = useState<Table | null>(null);

  const { data: tableListResponse, isLoading } = useGetTableList();

  const createTableMutation = useCreateTable({
    onSuccess: (res) => {
      setDialogOpen(false);
      alert.success({
        title: "Meja berhasil ditambahkan!",
        description: `Meja nomor ${res.data.number} siap digunakan.`,
      });
    },
    onError: (err) => {
      alert.error({
        title: "Gagal menyimpan meja",
        description: getErrorMessage(err, "Gagal menyimpan meja."),
      });
    },
  });

  const updateTableMutation = useUpdateTable({
    onSuccess: (res) => {
      setDialogOpen(false);
      alert.success({
        title: "Meja berhasil diperbarui!",
        description: `Meja nomor ${res.data.number} telah disimpan.`,
      });
    },
    onError: (err) => {
      alert.error({
        title: "Gagal memperbarui meja",
        description: getErrorMessage(err, "Gagal memperbarui meja."),
      });
    },
  });

  const deleteTableMutation = useDeleteTable({
    onSuccess: () => {
      setDeleteConfirmId(null);
      alert.success({
        title: "Meja berhasil dihapus!",
        description: "Data meja telah dihapus dari sistem.",
      });
    },
    onError: (err) => {
      setDeleteConfirmId(null);
      alert.error({
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
    const textCap = values.capacity ? values.capacity.toString() : "0";
    const cap = parseInt(textCap, 10);

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

  const tables = tableListResponse?.data ?? [];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <TitleActions
        title={
          <span className="flex items-center gap-2">
            <Table2 className="w-8 h-8 text-[#c8a96e]" /> Kelola Meja Cafe
          </span>
        }
        description="Lihat, tambah, ubah detail meja, serta cetak QR Code unik untuk setiap meja pelanggan."
        actions={
          <Button onClick={openAddDialog} className="font-bold cursor-pointer">
            <Plus className="w-4 h-4 mr-2" /> Tambah Meja
          </Button>
        }
      />

      {/* Tabel Meja */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8a96e]" />
        </div>
      ) : tables.length === 0 ? (
        <EmptyState
          icon={Table2}
          title="Belum ada meja cafe"
          subtitle="Tambahkan meja baru melalui tombol di bagian kanan atas halaman."
        />
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <DataTable
              columns={getColumns({
                onEdit: openEditDialog,
                onDelete: (id) => setDeleteConfirmId(id),
                onPrint: handlePrint,
                onViewDetail: (table) => setDetailTable(table),
              })}
              data={tables}
              loading={isLoading}
              hidePagination
              className="shadow-none border-none bg-transparent rounded-none"
            />
          </CardContent>
        </Card>
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

      {/* Dialog Detail Meja */}
      <TableDetailDialog
        table={detailTable}
        open={detailTable !== null}
        onOpenChange={(open) => !open && setDetailTable(null)}
      />
    </div>
  );
}
