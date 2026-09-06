import YachtsSlugPage from '@/features/yachtsSlug/YachtsSlugPage';

interface PreOwnedSlugPageProps {
	params: Promise<{ slug: string }>;
}

export default async function PreOwnedSlugPage({ params }: PreOwnedSlugPageProps) {
	return <YachtsSlugPage params={await params} />;
}
