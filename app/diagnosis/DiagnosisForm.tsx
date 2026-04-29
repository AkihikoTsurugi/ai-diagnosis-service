"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";

const questions = [
  { key: "q1", label: "Q1. 現在の職種・学習状況を教えてください" },
  { key: "q2", label: "Q2. これから挑戦したい仕事は何ですか？" },
  { key: "q3", label: "Q3. あなたの強み・得意なことは何ですか？" },
  { key: "q4", label: "Q4. キャリアで不安に感じていることは何ですか？" },
  { key: "q5", label: "Q5. 1年後にどんな状態になっていたいですか？" },
] as const;

type Answers = Record<(typeof questions)[number]["key"], string>;

export default function DiagnosisForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      let data: { _id?: string; error?: string };
      try {
        data = (await res.json()) as { _id?: string; error?: string };
      } catch {
        throw new Error("サーバー応答の読み取りに失敗しました");
      }
      if (!res.ok || !data._id) {
        throw new Error(data.error ?? "診断の実行に失敗しました");
      }
      router.push(`/diagnosis/result?id=${data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "診断の実行に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 840, mx: "auto" }}>
      <Stack spacing={2}>
        <Button component={Link} href="/dashboard" sx={{ alignSelf: "flex-start" }}>
          ダッシュボードへ戻る
        </Button>
        <Card>
          <CardContent>
            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
              <Typography variant="h4" component="h1">
                AIキャリア診断
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5問に回答すると、AIがキャリア方針とロードマップを提案します。
              </Typography>
              {error ? <Alert severity="error">{error}</Alert> : null}
              {questions.map((q) => (
                <TextField
                  key={q.key}
                  label={q.label}
                  value={answers[q.key]}
                  disabled={submitting}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
                  }
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  inputProps={{ maxLength: 500 }}
                />
              ))}
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "診断中…" : "診断を実行する"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      <Backdrop
        open={submitting}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" />
          <Typography>診断結果を作成しています…</Typography>
        </Stack>
      </Backdrop>
    </Box>
  );
}
