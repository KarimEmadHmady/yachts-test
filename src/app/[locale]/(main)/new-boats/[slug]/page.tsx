import YachtsSlugPage from '@/features/yachtsSlug/YachtsSlugPage';

interface NewBoatSlugPageProps {
	params: Promise<{ slug: string }>;
}

export default async function NewBoatSlugPage({ params }: NewBoatSlugPageProps) {
	return <YachtsSlugPage params={await params} />;
}
