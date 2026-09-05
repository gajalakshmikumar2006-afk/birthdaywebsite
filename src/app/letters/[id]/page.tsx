import { notFound } from 'next/navigation';
import { getGeneratedLetterById, getSubmissionById } from '@/lib/db';
import ScrapbookLetter from '@/components/letter/ScrapbookLetter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const letter = getGeneratedLetterById(id);
  if (!letter || !letter.published) {
    return {
      title: 'Birthday Letter',
    };
  }

  const submission = getSubmissionById(letter.submissionId);
  const name = submission?.contributorName || 'Someone Special';

  return {
    title: `Birthday Letter from ${name} 💌`,
    description: `A special birthday memory letter from ${name}.`,
  };
}

export default async function PublicLetterPage({ params }: PageProps) {
  const { id } = await params;
  const letter = getGeneratedLetterById(id);

  if (!letter || !letter.published) {
    notFound();
  }

  const submission = getSubmissionById(letter.submissionId);
  if (!submission) {
    notFound();
  }

  return (
    <ScrapbookLetter
      contributorName={submission.contributorName}
      letterContent={submission.letterContent}
      layoutConfig={letter.layoutConfig}
      publishedAt={letter.publishedAt}
      isPreview={false}
    />
  );
}
