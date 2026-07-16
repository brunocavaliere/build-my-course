import { redirect } from 'next/navigation';

type EditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditCourseLegacyPage({ params, searchParams }: EditCoursePageProps) {
  const { id } = await params;
  const search = await searchParams;
  const query = new URLSearchParams();

  if (search.error) {
    query.set('error', search.error);
  }

  redirect(query.size ? `/app/${id}/edit?${query.toString()}` : `/app/${id}/edit`);
}
