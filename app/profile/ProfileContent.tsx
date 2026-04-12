"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function ProfileContent() {
  const { status, update } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("読み込みに失敗しました");
        const data = (await res.json()) as Profile;
        if (!cancelled) {
          setProfile(data);
          setName(data.name ?? "");
        }
      } catch {
        if (!cancelled) {
          setMessage({
            type: "error",
            text: "プロフィールの取得に失敗しました",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (status === "authenticated") load();
    else if (status === "unauthenticated") setLoading(false);
    return () => {
      cancelled = true;
    };
  }, [status]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as { error?: string } & Profile;
      if (!res.ok) throw new Error(data.error ?? "保存に失敗しました");
      setProfile(data);
      await update({ user: { name: data.name ?? undefined } });
      setMessage({ type: "success", text: "保存しました" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "保存に失敗しました",
      });
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>読み込み中…</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        {message ? <Alert severity="error">{message.text}</Alert> : null}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 560, mx: "auto" }}>
      <Stack spacing={2}>
        <Button
          component={Link}
          href="/dashboard"
          variant="text"
          sx={{ alignSelf: "flex-start" }}
        >
          ダッシュボードへ戻る
        </Button>
        <Card>
          <CardContent>
            <Stack spacing={2} component="form" onSubmit={handleSave}>
              <Typography variant="h5" component="h1">
                プロフィール
              </Typography>
              {message ? (
                <Alert severity={message.type === "success" ? "success" : "error"}>
                  {message.text}
                </Alert>
              ) : null}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={profile.image ?? undefined}
                  alt={profile.name ?? ""}
                  sx={{ width: 72, height: 72 }}
                />
                <Typography variant="body2" color="text.secondary">
                  アバターは Google アカウントの画像を表示しています。
                </Typography>
              </Stack>
              <TextField
                label="メールアドレス"
                value={profile.email ?? ""}
                fullWidth
                disabled
              />
              <TextField
                label="表示名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
              {profile.createdAt ? (
                <Typography variant="caption" color="text.secondary">
                  登録日:{" "}
                  {new Date(profile.createdAt).toLocaleString("ja-JP")}
                </Typography>
              ) : null}
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "保存中…" : "変更を保存"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
