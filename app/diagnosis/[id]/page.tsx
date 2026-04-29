import { auth } from "@/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import { getDiagnosisLocal } from "@/lib/diagnosis-local-store";
import { connectMongoose } from "@/lib/mongoose";
import { DiagnosisModel, type DiagnosisDocument } from "@/models/Diagnosis";
import { Types } from "mongoose";

export default async function DiagnosisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    redirect("/diagnosis/history");
  }

  let data: DiagnosisDocument | null = null;
  let localData: Awaited<ReturnType<typeof getDiagnosisLocal>> = null;
  try {
    await connectMongoose();
    data = await DiagnosisModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(session.user.id),
    }).lean<DiagnosisDocument | null>();
  } catch {
    localData = await getDiagnosisLocal(session.user.id, id);
  }

  if (!data && !localData) {
    redirect("/diagnosis/history");
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1}>
          <Button href="/diagnosis/history">
            履歴へ戻る
          </Button>
          <Button href={`/diagnosis/${id}/edit`}>
            編集
          </Button>
        </Stack>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h4">診断詳細</Typography>
              <Typography>{data?.result.summary ?? localData?.result.summary}</Typography>
              <Typography variant="h6">回答内容</Typography>
              <Typography>Q1: {data?.answers.q1 ?? localData?.answers.q1}</Typography>
              <Typography>Q2: {data?.answers.q2 ?? localData?.answers.q2}</Typography>
              <Typography>Q3: {data?.answers.q3 ?? localData?.answers.q3}</Typography>
              <Typography>Q4: {data?.answers.q4 ?? localData?.answers.q4}</Typography>
              <Typography>Q5: {data?.answers.q5 ?? localData?.answers.q5}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
