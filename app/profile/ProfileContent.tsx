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

const MAX_AVATAR_BYTES = 300 * 1024;

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
  const [avatarUploading, setAvatarUploading] = useState(false);
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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_AVATAR_BYTES) {
      setMessage({
        type: "error",
        text: "ファイルサイズは 300KB 以下にしてください",
      });
      return;
    }

    setMessage(null);
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/user/profile/avatar", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { error?: string } & Profile;
      if (!res.ok) throw new Error(data.error ?? "アップロードに失敗しました");
      setProfile(data);
      await update({
        user: {
          image: data.image ?? undefined,
          name: data.name ?? undefined,
        },
      });
      setMessage({ type: "success", text: "プロフィール画像を更新しました" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "アップロードに失敗しました",
      });
    } finally {
      setAvatarUploading(false);
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
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  src={profile.image ?? undefined}
                  alt={profile.name ?? ""}
                  sx={{ width: 72, height: 72 }}
                />
                <Stack spacing={0.5} alignItems="flex-start">
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    disabled={avatarUploading || saving}
                    sx={{ cursor: avatarUploading ? "wait" : "pointer" }}
                  >
                    {avatarUploading ? "アップロード中…" : "画像をアップロード"}
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleAvatarChange}
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    JPEG / PNG / WebP / GIF、300KB 以下。アップロードした画像が OAuth
                    のプロフィール写真より優先して表示されます。
                  </Typography>
                </Stack>
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
