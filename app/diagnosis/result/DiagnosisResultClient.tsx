"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { DiagnosisDocumentShape } from "@/types/diagnosis";

export default function DiagnosisResultClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<DiagnosisDocumentShape | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) {
        setError("診断結果IDが指定されていません");
        return;
      }
      try {
        const res = await fetch(`/api/diagnosis/${id}`);
        let payload: DiagnosisDocumentShape & {
          error?: string;
        };
        try {
          payload = (await res.json()) as DiagnosisDocumentShape & {
            error?: string;
          };
        } catch {
          throw new Error("サーバー応答の読み取りに失敗しました");
        }
        if (!res.ok) {
          throw new Error(payload.error ?? "取得に失敗しました");
        }
        if (!cancelled) setData(payload);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "取得に失敗しました");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1}>
          <Button component={Link} href="/diagnosis">
            新規診断
          </Button>
          <Button component={Link} href="/diagnosis/history">
            履歴一覧
          </Button>
        </Stack>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {!data && !error ? <Typography>読み込み中…</Typography> : null}
        {data ? (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4">診断結果</Typography>
                <Typography>{data.result.summary}</Typography>
                <Divider />
                <Typography variant="h6">強み</Typography>
                {data.result.strengths.map((x) => (
                  <Typography key={x}>- {x}</Typography>
                ))}
                <Typography variant="h6">推奨キャリア</Typography>
                {data.result.recommendedCareers.map((x) => (
                  <Typography key={x}>- {x}</Typography>
                ))}
                <Typography variant="h6">注意点</Typography>
                {data.result.cautions.map((x) => (
                  <Typography key={x}>- {x}</Typography>
                ))}
                <Divider />
                <Typography variant="h6">キャリアロードマップ（短期）</Typography>
                {data.careerRoadmap.shortTerm.map((x) => (
                  <Typography key={x}>- {x}</Typography>
                ))}
                <Typography variant="h6">キャリアロードマップ（中期）</Typography>
                {data.careerRoadmap.midTerm.map((x) => (
                  <Typography key={x}>- {x}</Typography>
                ))}
                <Typography variant="h6">キャリアロードマップ（長期）</Typography>
                {data.careerRoadmap.longTerm.map((x) => (
                  <Typography key={x}>- {x}</Typography>
                ))}
                <Button component={Link} href={`/diagnosis/${data._id}`}>
                  詳細ページへ
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </Box>
  );
}
