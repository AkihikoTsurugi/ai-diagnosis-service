"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DiagnosisDocumentShape } from "@/types/diagnosis";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function DiagnosisEditContent({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<DiagnosisDocumentShape | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [recommendedCareers, setRecommendedCareers] = useState("");
  const [cautions, setCautions] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [midTerm, setMidTerm] = useState("");
  const [longTerm, setLongTerm] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/diagnosis/${id}`);
        const payload = (await res.json()) as DiagnosisDocumentShape & {
          error?: string;
        };
        if (!res.ok) {
          throw new Error(payload.error ?? "読み込みに失敗しました");
        }
        if (!cancelled) {
          setData(payload);
          setSummary(payload.result.summary);
          setStrengths(payload.result.strengths.join("\n"));
          setRecommendedCareers(payload.result.recommendedCareers.join("\n"));
          setCautions(payload.result.cautions.join("\n"));
          setShortTerm(payload.careerRoadmap.shortTerm.join("\n"));
          setMidTerm(payload.careerRoadmap.midTerm.join("\n"));
          setLongTerm(payload.careerRoadmap.longTerm.join("\n"));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "読み込みに失敗しました");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/diagnosis/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          result: {
            summary,
            strengths: splitLines(strengths),
            recommendedCareers: splitLines(recommendedCareers),
            cautions: splitLines(cautions),
          },
          careerRoadmap: {
            shortTerm: splitLines(shortTerm),
            midTerm: splitLines(midTerm),
            longTerm: splitLines(longTerm),
          },
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? "保存に失敗しました");
      }
      router.push(`/diagnosis/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("この診断結果を削除しますか？")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/diagnosis/${id}`, { method: "DELETE" });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? "削除に失敗しました");
      }
      router.push("/diagnosis/history");
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  if (!data && !error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>読み込み中…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Stack spacing={2}>
        <Button component={Link} href={`/diagnosis/${id}`} sx={{ alignSelf: "flex-start" }}>
          詳細へ戻る
        </Button>
        <Card>
          <CardContent>
            <Stack spacing={2} component="form" onSubmit={handleSave}>
              <Typography variant="h4">診断結果編集</Typography>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <TextField
                label="総評"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="強み（改行で区切る）"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                required
              />
              <TextField
                label="推奨キャリア（改行で区切る）"
                value={recommendedCareers}
                onChange={(e) => setRecommendedCareers(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                required
              />
              <TextField
                label="注意点（改行で区切る）"
                value={cautions}
                onChange={(e) => setCautions(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                required
              />
              <TextField
                label="短期プラン（改行で区切る）"
                value={shortTerm}
                onChange={(e) => setShortTerm(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                required
              />
              <TextField
                label="中期プラン（改行で区切る）"
                value={midTerm}
                onChange={(e) => setMidTerm(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                required
              />
              <TextField
                label="長期プラン（改行で区切る）"
                value={longTerm}
                onChange={(e) => setLongTerm(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                required
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "保存中…" : "保存"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  disabled={saving}
                  onClick={handleDelete}
                >
                  削除
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
