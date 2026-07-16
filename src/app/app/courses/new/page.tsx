import { redirect } from 'next/navigation';

type NewCoursePageProps = {
  searchParams: Promise<{
    generateError?: string;
  }>;
};

export default async function NewCourseLegacyPage({ searchParams }: NewCoursePageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.generateError) {
    query.set('generateError', params.generateError);
  }

  redirect(query.size ? `/app/new?${query.toString()}` : '/app/new');
}
