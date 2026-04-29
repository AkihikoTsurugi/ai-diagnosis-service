"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { DiagnosisDocumentShape } from "@/types/diagnosis";

export default function DiagnosisHistoryContent() {
  const [items, setItems] = useState<DiagnosisDocumentShape[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/diagnosis");
        const payload = (await res.json()) as
          | DiagnosisDocumentShape[]
          | { error?: string };
        if (!res.ok || !Array.isArray(payload)) {
          throw new Error(
            !Array.isArray(payload) && payload.error
              ? payload.error
              : "履歴の取得に失敗しました",
          );
        }
        if (!cancelled) setItems(payload);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "履歴の取得に失敗しました");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 960, mx: "auto" }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1}>
          <Button component={Link} href="/diagnosis">
            新規診断
          </Button>
          <Button component={Link} href="/dashboard">
            ダッシュボード
          </Button>
        </Stack>
        <Typography variant="h4">診断履歴</Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {items.map((item) => (
          <Card key={item._id}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">{item.result.summary}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.createdAt).toLocaleString("ja-JP")}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button component={Link} href={`/diagnosis/${item._id}`}>
                    詳細
                  </Button>
                  <Button component={Link} href={`/diagnosis/${item._id}/edit`}>
                    編集
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {!error && items.length === 0 ? (
          <Typography color="text.secondary">まだ診断履歴がありません。</Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
