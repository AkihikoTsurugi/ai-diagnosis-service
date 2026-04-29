"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function HelloworkSearchContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const backHref = id ? `/diagnosis/result?id=${id}` : "/diagnosis/result";

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Stack spacing={3}>
        <Typography variant="h4">ハローワーク検索</Typography>
        <Typography>検索条件等は現在制作中です。</Typography>
        <Button component={Link} href={backHref} variant="outlined">
          戻る
        </Button>
      </Stack>
    </Box>
  );
}
